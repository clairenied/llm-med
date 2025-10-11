import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Security: Only allow this in development or with a special token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Check for admin creation token (set this in your Vercel environment variables)
    const adminCreationToken = process.env.ADMIN_CREATION_TOKEN;

    if (!adminCreationToken || token !== adminCreationToken) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid admin creation token" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      email = "admin@example.com",
      password = "admin123",
      name = "System Administrator",
    } = body;

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user already exists with this email" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(), // Mark as verified
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      admin,
      credentials: {
        email,
        password,
        warning: "Please change the password after first login!",
      },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 },
    );
  }
}
