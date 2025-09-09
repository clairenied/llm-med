import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { sendWelcomeEmail } from "@/lib/email"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  invitationId: z.string().min(1, "Invitation is required")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, invitationId } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Validate invitation (now required)
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 400 }
      );
    }

    if (invitation.email !== email) {
      return NextResponse.json(
        { error: "Email does not match invitation" },
        { status: 400 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }

    if (invitation.usedAt) {
      return NextResponse.json(
        { error: "Invitation has already been used" },
        { status: 400 }
      );
    }

    const userRole = invitation.role as 'AUTHOR' | 'REVIEWER' | 'ADMIN';

    // Mark invitation as used
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { usedAt: new Date() }
    });

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user with appropriate role
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
    })

    // Send welcome email
    const emailResult = await sendWelcomeEmail(email, name);
    if (!emailResult.success) {
      console.warn('Failed to send welcome email:', emailResult.error);
    }

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
