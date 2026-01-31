import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { processEmailTemplate } from "@/lib/email-templates";

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
        return NextResponse.json({
          success: true,
          message: "User role updated to GRADER",
          userId: existingUser.id,
        });
      }
      return NextResponse.json({
        success: true,
        message: `User already exists with ${existingUser.role} role`,
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

    // Send invitation email using template
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";
    // Include callbackUrl so graders are redirected to grading page after sign-in
    const signinUrl = `${baseUrl}/auth/signin?callbackUrl=/grading`;

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
            signInUrl: signinUrl,
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
