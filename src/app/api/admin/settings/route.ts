import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch system settings (or a specific key)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const key = request.nextUrl.searchParams.get("key");

    if (key) {
      const setting = await prisma.systemSetting.findUnique({ where: { key } });
      return NextResponse.json({ setting });
    }

    const settings = await prisma.systemSetting.findMany();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update a system setting
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { key, value } = await request.json();

    if (!key || !value) {
      return NextResponse.json({ error: "key and value required" }, { status: 400 });
    }

    // Validate known settings
    if (key === "GRADING_MODE" && !["HUMAN", "AI"].includes(value)) {
      return NextResponse.json({ error: "GRADING_MODE must be HUMAN or AI" }, { status: 400 });
    }

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ setting });
  } catch (error) {
    console.error("Update setting error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
