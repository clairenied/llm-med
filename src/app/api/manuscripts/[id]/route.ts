import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, abstract, keywords, status, pubmedUrl, f1000Url } = body;

    const manuscript = await prisma.manuscript.update({
      where: { id: params.id },
      data: {
        title,
        abstract,
        keywords,
        status,
        pubmedUrl,
        f1000Url,
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.manuscript.delete({
      where: { id: params.id },
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
