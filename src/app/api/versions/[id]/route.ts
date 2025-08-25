import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { documentUrl, documentType, notes } = body;

    const version = await prisma.manuscriptVersion.update({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.manuscriptVersion.delete({
      where: { id },
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
