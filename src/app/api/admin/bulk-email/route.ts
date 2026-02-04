import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { processEmailTemplate } from "@/lib/email-templates";

interface SendResult {
  email: string;
  userId: string;
  success: boolean;
  message: string;
}

/**
 * POST: Send bulk emails to selected users
 *
 * Request body:
 * - userIds: string[] (list of user IDs to email)
 * - templateId: string (required, the template to use)
 * - ccEmails?: string (comma-separated CC email addresses)
 * - useGmail?: boolean (send from admin's Gmail instead of system email)
 */
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
    const { userIds, templateId, ccEmails, useGmail } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "At least one user ID is required" },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Get the template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Get all selected users
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No users found with the provided IDs" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";
    const signinUrl = `${baseUrl}/auth/signin`;

    const results: SendResult[] = [];

    // Send email to each user
    for (const recipient of users) {
      try {
        // Process template with user's data
        const { subject, body: htmlBody } = processEmailTemplate(
          template.subject,
          template.body,
          {
            firstName: recipient.firstName || recipient.name?.split(" ")[0] || "",
            lastName: recipient.lastName || recipient.name?.split(" ").slice(1).join(" ") || "",
            email: recipient.email,
            signInUrl: signinUrl,
          }
        );

        await sendEmail({
          to: recipient.email,
          subject,
          html: htmlBody,
          cc: ccEmails || undefined,
          useGmail,
        });

        results.push({
          email: recipient.email,
          userId: recipient.id,
          success: true,
          message: "Email sent successfully",
        });
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        results.push({
          email: recipient.email,
          userId: recipient.id,
          success: false,
          message: "Failed to send email",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} emails, ${failCount} failed`,
      results,
    });
  } catch (error) {
    console.error("Bulk email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
