import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const manuscript = await prisma.manuscript.findUnique({
      where: { id },
      include: {
        authors: true,
        versions: {
          include: {
            reviews: {
              include: {
                reviewer: true,
              },
            },
          },
          orderBy: {
            versionNumber: 'asc',
          },
        },
      },
    });

    if (!manuscript) {
      return NextResponse.json(
        { error: 'Manuscript not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(manuscript);
  } catch (error) {
    console.error('Error fetching manuscript:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manuscript' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, abstract, keywords, status } = body;

    const manuscript = await prisma.manuscript.update({
      where: { id },
      data: {
        title,
        abstract,
        keywords,
        status,
      },
      include: {
        authors: true,
        versions: {
          include: {
            reviews: {
              include: {
                reviewer: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(manuscript);
  } catch (error) {
    console.error('Error updating manuscript:', error);
    return NextResponse.json(
      { error: 'Failed to update manuscript' },
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
    await prisma.manuscript.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Manuscript deleted successfully' });
  } catch (error) {
    console.error('Error deleting manuscript:', error);
    return NextResponse.json(
      { error: 'Failed to delete manuscript' },
      { status: 500 }
    );
  }
}
