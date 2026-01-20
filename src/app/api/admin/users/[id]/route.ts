import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { role, firstName, lastName } = body;

    const { id } = await params;

    // Build update data
    const updateData: {
      role?: UserRole;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
    } = {};

    // Handle role update
    if (role !== undefined) {
      if (!["ADMIN", "REVIEWER", "AUTHOR", "GRADER"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      // Prevent admin from changing their own role (could lock themselves out)
      if (id === session.user.id) {
        return NextResponse.json(
          { error: "Cannot change your own role" },
          { status: 400 },
        );
      }
      updateData.role = role;
    }

    // Handle name updates
    if (firstName !== undefined || lastName !== undefined) {
      // Get current user data to compute full name
      const currentUser = await prisma.user.findUnique({
        where: { id },
        select: { firstName: true, lastName: true },
      });

      if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const newFirstName = firstName !== undefined ? firstName : currentUser.firstName;
      const newLastName = lastName !== undefined ? lastName : currentUser.lastName;

      if (firstName !== undefined) updateData.firstName = firstName || null;
      if (lastName !== undefined) updateData.lastName = lastName || null;

      // Compute full name
      const nameParts = [newFirstName, newLastName].filter(Boolean);
      updateData.name = nameParts.length > 0 ? nameParts.join(" ") : null;
    }

    // Ensure there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
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
    // Prevent admin from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
