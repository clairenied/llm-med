import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmailTemplateType } from "@prisma/client";
import {
  DEFAULT_INVITATION_TEMPLATE,
  DEFAULT_COMMUNICATION_TEMPLATE,
} from "@/lib/email-templates";

// GET: List all email templates
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

    // Get all templates
    let templates = await prisma.emailTemplate.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    // If no templates exist, seed the defaults
    if (templates.length === 0) {
      await prisma.emailTemplate.createMany({
        data: [
          DEFAULT_INVITATION_TEMPLATE,
          DEFAULT_COMMUNICATION_TEMPLATE,
        ],
      });
      templates = await prisma.emailTemplate.findMany({
        orderBy: [{ type: "asc" }, { name: "asc" }],
      });
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("List templates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new email template
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
    const { name, subject, body: templateBody, type } = body;

    // Validate required fields
    if (!name || !subject || !templateBody || !type) {
      return NextResponse.json(
        { error: "Name, subject, body, and type are required" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["INVITATION", "COMMUNICATION"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be INVITATION or COMMUNICATION" },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A template with this name already exists" },
        { status: 400 }
      );
    }

    // Create the template
    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        body: templateBody,
        type: type as EmailTemplateType,
      },
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Create template error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
