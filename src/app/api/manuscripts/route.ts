import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const manuscripts = await prisma.manuscript.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(manuscripts);
  } catch (error) {
    console.error('Error fetching manuscripts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manuscripts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, abstract, keywords, authorIds, pubmedUrl, f1000Url } = body;

    const manuscript = await prisma.manuscript.create({
      data: {
        title,
        abstract,
        keywords,
        pubmedUrl,
        f1000Url,
        authors: {
          connect: authorIds?.map((id: string) => ({ id })) || [],
        },
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

    return NextResponse.json(manuscript, { status: 201 });
  } catch (error) {
    console.error('Error creating manuscript:', error);
    return NextResponse.json(
      { error: 'Failed to create manuscript' },
      { status: 500 }
    );
  }
}
