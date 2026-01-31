import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmailTemplateType } from "@prisma/client";

// GET: Get a single email template by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Get template error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update an email template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { name, subject, body: templateBody, type, isDefault } = body;

    // Check if template exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // If name is being changed, check for duplicates
    if (name && name !== existing.name) {
      const duplicate = await prisma.emailTemplate.findUnique({
        where: { name },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "A template with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Validate type if provided
    if (type && !["INVITATION", "COMMUNICATION"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be INVITATION or COMMUNICATION" },
        { status: 400 }
      );
    }

    // Build update data (only include provided fields)
    const updateData: {
      name?: string;
      subject?: string;
      body?: string;
      type?: EmailTemplateType;
      isDefault?: boolean;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (subject !== undefined) updateData.subject = subject;
    if (templateBody !== undefined) updateData.body = templateBody;
    if (type !== undefined) updateData.type = type as EmailTemplateType;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    // If setting as default, unset other defaults of same type
    if (isDefault === true) {
      await prisma.emailTemplate.updateMany({
        where: {
          type: type || existing.type,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Update template error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an email template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if template exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    await prisma.emailTemplate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Delete template error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
