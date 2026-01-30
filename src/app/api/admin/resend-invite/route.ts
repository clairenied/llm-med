import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { processEmailTemplate } from "@/lib/email-templates";

/**
 * POST: Resend invitation email to a user
 *
 * Request body:
 * - userId: string (required)
 * - templateId?: string (optional, uses default if not provided)
 * - ccEmails?: string (comma-separated list of CC emails)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, templateId, ccEmails: ccEmailsRaw } = body;

    // Parse CC emails (comma-separated string to array)
    const ccEmails = ccEmailsRaw
      ? ccEmailsRaw.split(",").map((e: string) => e.trim()).filter((e: string) => e && e.includes("@"))
      : undefined;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get email template
    let template = null;
    if (templateId) {
      template = await prisma.emailTemplate.findUnique({
        where: { id: templateId },
      });
    }

    // Fall back to default invitation template
    if (!template) {
      template = await prisma.emailTemplate.findFirst({
        where: { type: "INVITATION", isDefault: true },
      });
    }

    // If still no template, get any invitation template
    if (!template) {
      template = await prisma.emailTemplate.findFirst({
        where: { type: "INVITATION" },
      });
    }

    if (!template) {
      return NextResponse.json(
        { error: "No invitation template found" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";
    const signinUrl = `${baseUrl}/auth/signin`;

    // Process template and send email
    const { subject, body: htmlBody } = processEmailTemplate(
      template.subject,
      template.body,
      {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        signInUrl: signinUrl,
      }
    );

    await sendEmail({
      to: user.email,
      subject,
      html: htmlBody,
      cc: ccEmails,
    });

    return NextResponse.json({
      success: true,
      message: `Invitation resent to ${user.email}`,
    });
  } catch (error) {
    console.error("Resend invite error:", error);
    return NextResponse.json(
      { error: "Failed to resend invitation" },
      { status: 500 }
    );
  }
}
