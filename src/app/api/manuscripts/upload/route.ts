import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const keywordsJson = formData.get('keywords') as string;
    const authorsJson = formData.get('authors') as string;
    const uploadType = formData.get('uploadType') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    let keywords: string[] = [];
    let authors: string[] = [];
    
    try {
      keywords = keywordsJson ? JSON.parse(keywordsJson) : [];
      authors = authorsJson ? JSON.parse(authorsJson) : [];
    } catch {
      return NextResponse.json(
        { error: 'Invalid keywords or authors format' },
        { status: 400 }
      );
    }

    if (authors.length === 0) {
      return NextResponse.json(
        { error: 'At least one author is required' },
        { status: 400 }
      );
    }

    // Validate content based on upload type
    if (uploadType === 'text' && !content?.trim()) {
      return NextResponse.json(
        { error: 'Article content is required for text upload' },
        { status: 400 }
      );
    }

    if (uploadType === 'pdf' && !file) {
      return NextResponse.json(
        { error: 'PDF file is required for PDF upload' },
        { status: 400 }
      );
    }

    // Process PDF file if uploaded
    let documentUrl: string | undefined;
    let documentType: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT' = 'FREE_TEXT';
    
    if (uploadType === 'pdf' && file) {
      // For now, we'll store the file name and indicate it's a PDF
      // In a real implementation, you'd upload to a file storage service
      documentUrl = `/uploads/${file.name}`;
      documentType = 'PDF';
      
      // TODO: Implement actual file storage (AWS S3, etc.)
      console.log('PDF file received:', file.name, file.size, 'bytes');
    } else if (uploadType === 'text') {
      documentType = 'FREE_TEXT';
    }

    // Create or find authors
    const authorRecords = await Promise.all(
      authors.map(async (authorName) => {
        let author = await prisma.author.findFirst({
          where: { name: authorName.trim() }
        });
        
        if (!author) {
          author = await prisma.author.create({
            data: { name: authorName.trim() }
          });
        }
        
        return author;
      })
    );

    // Create the manuscript
    const manuscript = await prisma.manuscript.create({
      data: {
        title: title.trim(),
        abstract: abstract?.trim() || null,
        keywords: keywords,
        status: 'DRAFT',
        authors: {
          connect: authorRecords.map(author => ({ id: author.id }))
        },
        versions: {
          create: {
            versionNumber: 1,
            documentUrl: documentUrl,
            documentType: documentType,
            notes: uploadType === 'text' 
              ? 'Uploaded as plain text' 
              : 'Uploaded from PDF file'
          }
        }
      },
      include: {
        authors: true,
        versions: {
          include: {
            reviews: {
              include: {
                reviewer: true
              }
            }
          }
        }
      }
    });

    // If it's a text upload, we could store the content in a separate field
    // For now, we'll just indicate it was uploaded as text
    
    return NextResponse.json(manuscript, { status: 201 });
    
  } catch (error) {
    console.error('Error uploading article:', error);
    return NextResponse.json(
      { error: 'Failed to upload article' },
      { status: 500 }
    );
  }
}
