import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      versionId, 
      reviewerId, 
      reviewType, 
      content, 
      documentUrl, 
      documentType, 
      isSharedExternally 
    } = body;

    const review = await prisma.review.create({
      data: {
        versionId,
        reviewerId,
        reviewType,
        content,
        documentUrl,
        documentType,
        isSharedExternally: isSharedExternally || false,
      },
      include: {
        reviewer: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
