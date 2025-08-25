import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { documentUrl, documentType, notes } = body;

    const version = await prisma.manuscriptVersion.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(version);
  } catch (error) {
    console.error('Error updating version:', error);
    return NextResponse.json(
      { error: 'Failed to update version' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.manuscriptVersion.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Version deleted successfully' });
  } catch (error) {
    console.error('Error deleting version:', error);
    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 }
    );
  }
}
