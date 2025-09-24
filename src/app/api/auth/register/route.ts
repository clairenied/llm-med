import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  invitationId: z.string().min(1, "Invitation is required")
})

export async function POST(request: NextRequest) {
  try {
    console.log("Registration attempt started")
    const body = await request.json()
    console.log("Request body parsed successfully")
    
    const { name, email, password, invitationId } = registerSchema.parse(body)
    console.log("Schema validation passed for email:", email)

    // Check if user already exists
    console.log("Checking for existing user...")
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Validate invitation (now required)
    console.log("Validating invitation:", invitationId)
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      console.log("Invitation not found:", invitationId)
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 400 }
      );
    }

    console.log("Invitation found, validating details...")
    if (invitation.email !== email) {
      console.log("Email mismatch - invitation:", invitation.email, "provided:", email)
      return NextResponse.json(
        { error: "Email does not match invitation" },
        { status: 400 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      console.log("Invitation expired:", invitation.expiresAt)
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }

    if (invitation.usedAt) {
      console.log("Invitation already used:", invitation.usedAt)
      return NextResponse.json(
        { error: "Invitation has already been used" },
        { status: 400 }
      );
    }

    const userRole = invitation.role as 'AUTHOR' | 'REVIEWER' | 'ADMIN';
    console.log("Invitation valid, proceeding with user creation. Role:", userRole)

    // Mark invitation as used
    console.log("Marking invitation as used...")
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { usedAt: new Date() }
    });

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await hashPassword(password)

    // Create user with appropriate role
    console.log("Creating user...")
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    // User registered successfully - no email needed
    console.log("User created successfully:", user.email)

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Registration validation error:", error.issues)
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    // Enhanced error logging for production debugging
    console.error("Registration error details:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
