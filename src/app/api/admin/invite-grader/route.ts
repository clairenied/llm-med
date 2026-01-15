import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

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
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update role to GRADER if not already
      if (existingUser.role === "USER") {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: "GRADER" },
        });
      }
      return NextResponse.json({
        success: true,
        message: "User already exists and has been updated to GRADER role",
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

    // Send invitation email
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";
    const signinUrl = `${baseUrl}/auth/signin`;

    try {
      await sendEmail({
        to: email,
        subject: "Invitation to Grade Peer Reviews - LLM Med Research",
        html: `
          <h2>You've been invited to help grade peer reviews!</h2>
          <p>Hi${name ? ` ${name}` : ""},</p>
          <p>You've been invited to participate in a research project to evaluate peer reviews of urology manuscripts.</p>
          <p>Your task will be to grade existing peer reviews across five domains:</p>
          <ul>
            <li>Clinical Relevance</li>
            <li>Methodology</li>
            <li>Results</li>
            <li>Writing Clarity</li>
            <li>Ethical Considerations</li>
          </ul>
          <p>Each review takes about 5-10 minutes to grade. You can complete them at your own pace.</p>
          <p><a href="${signinUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Get Started</a></p>
          <p>When you click the button above, enter your email address and we'll send you a magic link to sign in (no password needed).</p>
          <p>Thank you for contributing to this research!</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
      // Don't fail the request if email fails - user is still created
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
        name: true,
        email: true,
        role: true,
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
        name: g.name,
        email: g.email,
        role: g.role,
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
