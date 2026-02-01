import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { processEmailTemplate } from "@/lib/email-templates";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, ccEmails: ccEmailsRaw } = body;

    // Parse CC emails (comma-separated string to array)
    const ccEmails = ccEmailsRaw
      ? ccEmailsRaw.split(",").map((e: string) => e.trim()).filter((e: string) => e && e.includes("@"))
      : undefined;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update role to GRADER if not already a grader or admin
      if (existingUser.role !== "GRADER" && existingUser.role !== "ADMIN") {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: "GRADER" },
        });
      }

      // Send magic link to existing user so they can sign in
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";
      const secret = process.env.NEXTAUTH_SECRET || "";
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(`${rawToken}${secret}`).digest("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: hashedToken,
          expires,
        },
      });

      const magicLinkUrl = `${baseUrl}/auth/verify?token=${rawToken}&email=${encodeURIComponent(email)}&callbackUrl=/grading`;

      // Get and send invitation template
      let template = await prisma.emailTemplate.findFirst({
        where: { type: "INVITATION", isDefault: true },
      });
      if (!template) {
        template = await prisma.emailTemplate.findFirst({
          where: { type: "INVITATION" },
        });
      }

      if (template) {
        try {
          const { subject, body: htmlBody } = processEmailTemplate(
            template.subject,
            template.body,
            {
              firstName: name || existingUser.name || "",
              email,
              signInUrl: magicLinkUrl,
            }
          );

          await sendEmail({
            to: email,
            subject,
            html: htmlBody,
            cc: ccEmails,
          });
        } catch (emailError) {
          console.error("Failed to send invitation email:", emailError);
        }
      }

      return NextResponse.json({
        success: true,
        message: existingUser.role === "GRADER" || existingUser.role === "ADMIN"
          ? `Magic link sent to existing ${existingUser.role}`
          : "User role updated to GRADER and magic link sent",
        userId: existingUser.id,
      });
    }

    // Create new user with GRADER role
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        role: "GRADER",
      },
    });

    // Generate magic link token for immediate sign-in
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";
    const secret = process.env.NEXTAUTH_SECRET || "";

    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    // Hash it for storage (NextAuth uses sha256 with secret appended)
    const hashedToken = crypto.createHash("sha256").update(`${rawToken}${secret}`).digest("hex");

    // Store the verification token (expires in 24 hours)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    });

    // Build magic link URL pointing to verification page
    const magicLinkUrl = `${baseUrl}/auth/verify?token=${rawToken}&email=${encodeURIComponent(email)}&callbackUrl=/grading`;

    // Get default invitation template from database
    let template = await prisma.emailTemplate.findFirst({
      where: { type: "INVITATION", isDefault: true },
    });
    if (!template) {
      template = await prisma.emailTemplate.findFirst({
        where: { type: "INVITATION" },
      });
    }

    if (template) {
      try {
        const { subject, body: htmlBody } = processEmailTemplate(
          template.subject,
          template.body,
          {
            firstName: name || "",
            email,
            signInUrl: magicLinkUrl,
          }
        );

        await sendEmail({
          to: email,
          subject,
          html: htmlBody,
          cc: ccEmails,
        });
      } catch (emailError) {
        console.error("Failed to send invitation email:", emailError);
        // Don't fail the request if email fails - user is still created
      }
    }

    return NextResponse.json({
      success: true,
      message: "Grader invited successfully",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Invite grader error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: List all graders
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const graders = await prisma.user.findMany({
      where: {
        role: { in: ["GRADER", "ADMIN"] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            reviewGrades: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      graders: graders.map((g) => ({
        id: g.id,
        firstName: g.firstName,
        lastName: g.lastName,
        name: g.name,
        email: g.email,
        role: g.role,
        emailVerified: g.emailVerified?.toISOString() || null,
        gradeCount: g._count.reviewGrades,
        createdAt: g.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("List graders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
