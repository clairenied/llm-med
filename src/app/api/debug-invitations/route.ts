import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const invitations = await prisma.invitation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate counts
    const totalCount = invitations.length;
    const pendingCount = invitations.filter(inv => !inv.usedAt && new Date(inv.expiresAt) >= new Date()).length;
    const acceptedCount = invitations.filter(inv => inv.usedAt).length;
    const expiredCount = invitations.filter(inv => !inv.usedAt && new Date(inv.expiresAt) < new Date()).length;

    return NextResponse.json({
      success: true,
      counts: {
        total: totalCount,
        pending: pendingCount,
        accepted: acceptedCount,
        expired: expiredCount
      },
      invitations: invitations.map(inv => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
        usedAt: inv.usedAt,
        isPending: !inv.usedAt && new Date(inv.expiresAt) >= new Date(),
        isExpired: !inv.usedAt && new Date(inv.expiresAt) < new Date(),
        isAccepted: !!inv.usedAt
      }))
    });
    
  } catch (error) {
    console.error('Error fetching invitations debug info:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch invitations',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
