import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // Get basic stats
    const [userCount, manuscriptCount] = await Promise.all([
      prisma.user.count(),
      prisma.manuscript.count(),
    ]);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      stats: {
        users: userCount,
        manuscripts: manuscriptCount,
      },
      version: process.env.npm_package_version || "1.0.0",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
