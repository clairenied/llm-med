import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviewers = await prisma.reviewer.findMany({
      include: {
        reviews: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(reviewers);
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviewers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, code, affiliation } = body;

    const reviewer = await prisma.reviewer.create({
      data: {
        name,
        email,
        code,
        affiliation,
      },
    });

    return NextResponse.json(reviewer, { status: 201 });
  } catch (error) {
    console.error('Error creating reviewer:', error);
    return NextResponse.json(
      { error: 'Failed to create reviewer' },
      { status: 500 }
    );
  }
}
