import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, name: true }
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with that email exists, password reset instructions have been sent.' 
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3010'}/auth/reset-password?token=${resetToken}`;

    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail({
        to: user.email,
        name: user.name || 'User',
        resetUrl: resetUrl,
      });

      return NextResponse.json(emailResult);
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Return generic success for security (don't reveal if email sending failed)
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with that email exists, password reset instructions have been sent.'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
