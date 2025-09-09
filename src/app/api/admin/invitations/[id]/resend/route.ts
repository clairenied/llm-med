import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendInvitationEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    
    // Find the invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id }
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Check if invitation is already used
    if (invitation.usedAt) {
      return NextResponse.json({ 
        error: 'Cannot resend - invitation has already been used' 
      }, { status: 400 });
    }

    // Extend expiration if it's expired (give another 7 days)
    let updatedInvitation = invitation;
    if (invitation.expiresAt < new Date()) {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);
      
      updatedInvitation = await prisma.invitation.update({
        where: { id },
        data: { expiresAt: newExpiresAt }
      });
    }

    // Send invitation email
    const emailResult = await sendInvitationEmail({
      email: updatedInvitation.email,
      role: updatedInvitation.role,
      invitationId: updatedInvitation.id,
      inviterName: session.user.name || session.user.email || 'Admin'
    });

    if (!emailResult.success) {
      console.warn('Failed to resend invitation email:', emailResult.error);
      return NextResponse.json({ 
        error: 'Failed to send email: ' + emailResult.error 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Invitation email resent successfully',
      invitation: updatedInvitation,
      emailSent: true
    });

  } catch (error) {
    console.error('Error resending invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
