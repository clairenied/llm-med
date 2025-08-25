import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { manuscriptId, versionNumber, documentUrl, documentType, notes } = body;

    const version = await prisma.manuscriptVersion.create({
      data: {
        manuscriptId,
        versionNumber,
        documentUrl,
        documentType,
        notes,
      },
      include: {
        reviews: {
          include: {
            reviewer: true,
          },
        },
      },
    });

    return NextResponse.json(version, { status: 201 });
  } catch (error) {
    console.error('Error creating version:', error);
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    );
  }
}
