import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { manuscriptIds } = body;

    if (
      !manuscriptIds ||
      !Array.isArray(manuscriptIds) ||
      manuscriptIds.length === 0
    ) {
      return NextResponse.json(
        { error: "No manuscript IDs provided" },
        { status: 400 },
      );
    }

    // Delete manuscripts (cascade will handle related records)
    const deleteResult = await prisma.manuscript.deleteMany({
      where: {
        id: {
          in: manuscriptIds,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} manuscript(s)`,
      deletedCount: deleteResult.count,
    });
  } catch (error) {
    console.error("Error deleting manuscripts:", error);
    return NextResponse.json(
      { error: "Failed to delete manuscripts" },
      { status: 500 },
    );
  }
}
