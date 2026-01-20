import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { UserRole } from "@prisma/client";
import { processEmailTemplate } from "@/lib/email-templates";

interface InviteResult {
  email: string;
  success: boolean;
  message: string;
  userId?: string;
}

interface InviteInput {
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * POST: Bulk invite users
 *
 * Request body (new format):
 * - invites: Array<{ email: string, firstName?: string, lastName?: string }>
 * - role: UserRole (GRADER, ADMIN, AUTHOR, REVIEWER)
 * - templateId?: string (optional, uses default if not provided)
 *
 * Also supports legacy format:
 * - emails: string (comma or newline separated list of emails)
 * - firstName?: string (optional, only for single invite)
 * - lastName?: string (optional, only for single invite)
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
    const { invites, emails, firstName, lastName, role, templateId } = body;

    // Validate role
    const validRoles: UserRole[] = ["ADMIN", "REVIEWER", "AUTHOR", "GRADER"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Valid role is required (ADMIN, REVIEWER, AUTHOR, GRADER)" },
        { status: 400 }
      );
    }

    // Build invite list from either new or legacy format
    let inviteList: InviteInput[] = [];

    if (invites && Array.isArray(invites)) {
      // New tabular format
      inviteList = invites
        .filter((inv: InviteInput) => inv.email && inv.email.includes("@"))
        .map((inv: InviteInput) => ({
          email: inv.email.trim().toLowerCase(),
          firstName: inv.firstName?.trim() || undefined,
          lastName: inv.lastName?.trim() || undefined,
        }));
    } else if (emails) {
      // Legacy format: comma/newline separated emails
      const emailList = emails
        .split(/[,\n]/)
        .map((e: string) => e.trim().toLowerCase())
        .filter((e: string) => e && e.includes("@"));

      // For legacy format, only first invite gets name (if single)
      inviteList = emailList.map((email: string, idx: number) => ({
        email,
        firstName: emailList.length === 1 && idx === 0 ? firstName : undefined,
        lastName: emailList.length === 1 && idx === 0 ? lastName : undefined,
      }));
    }

    if (inviteList.length === 0) {
      return NextResponse.json({ error: "No valid emails found" }, { status: 400 });
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

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3010";
    const signinUrl = `${baseUrl}/auth/signin`;

    const results: InviteResult[] = [];

    // Process each invite
    for (const invite of inviteList) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: invite.email },
        });

        let userId: string;
        let message: string;

        if (existingUser) {
          // Update role if different and not admin (don't demote admins)
          if (existingUser.role !== role && existingUser.role !== "ADMIN") {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { role },
            });
            message = `User role updated to ${role}`;
          } else {
            message = `User already exists with ${existingUser.role} role`;
          }
          userId = existingUser.id;
        } else {
          // Create new user with provided names
          const newUser = await prisma.user.create({
            data: {
              email: invite.email,
              firstName: invite.firstName || null,
              lastName: invite.lastName || null,
              name: invite.firstName || invite.lastName
                ? [invite.firstName, invite.lastName].filter(Boolean).join(" ")
                : null,
              role,
            },
          });
          userId = newUser.id;
          message = `User created with ${role} role`;

          // Send invitation email for new users
          if (template) {
            const { subject, body: htmlBody } = processEmailTemplate(
              template.subject,
              template.body,
              {
                firstName: invite.firstName || "",
                lastName: invite.lastName || "",
                email: invite.email,
                signInUrl: signinUrl,
              }
            );

            try {
              await sendEmail({
                to: invite.email,
                subject,
                html: htmlBody,
              });
              message += ", invitation sent";
            } catch (emailError) {
              console.error(`Failed to send invitation to ${invite.email}:`, emailError);
              message += ", but email failed";
            }
          }
        }

        results.push({
          email: invite.email,
          success: true,
          message,
          userId,
        });
      } catch (error) {
        console.error(`Error processing ${invite.email}:`, error);
        results.push({
          email: invite.email,
          success: false,
          message: "Failed to process invitation",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Processed ${inviteList.length} emails: ${successCount} successful, ${failCount} failed`,
      results,
    });
  } catch (error) {
    console.error("Bulk invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
