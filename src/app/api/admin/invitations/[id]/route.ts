import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Allow public access to invitation details for signup validation
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        expiresAt: true,
        usedAt: true,
        createdAt: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 },
      );
    }

    if (!["ADMIN", "REVIEWER", "AUTHOR"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if invitation exists
    const existingInvitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!existingInvitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    // Check if invitation is already used
    if (existingInvitation.usedAt) {
      return NextResponse.json(
        { error: "Cannot edit used invitation" },
        { status: 400 },
      );
    }

    // Check if email is being changed to one that already exists
    if (email !== existingInvitation.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithEmail) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 },
        );
      }

      const invitationWithEmail = await prisma.invitation.findUnique({
        where: { email },
      });

      if (invitationWithEmail && invitationWithEmail.id !== id) {
        return NextResponse.json(
          { error: "Invitation with this email already exists" },
          { status: 400 },
        );
      }
    }

    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: { email, role },
    });

    return NextResponse.json({ invitation: updatedInvitation });
  } catch (error) {
    console.error("Error updating invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.invitation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
