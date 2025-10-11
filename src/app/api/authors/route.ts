import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, affiliation, orcId } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const author = await prisma.author.create({
      data: {
        name,
        email: email || null,
        affiliation: affiliation || null,
        orcId: orcId || null,
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}
