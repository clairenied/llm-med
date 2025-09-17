import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import * as cheerio from 'cheerio';

async function fetchAndParseUrl(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LLM-Med-Bot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title - try multiple selectors
    const title = $('title').text().trim() || 
                  $('h1').first().text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  '';

    // Extract abstract/description - try multiple selectors
    const abstract = $('meta[name="description"]').attr('content') || 
                     $('meta[property="og:description"]').attr('content') || 
                     $('meta[name="abstract"]').attr('content') || 
                     '';

    // Extract main content - try to find article content
    let content = '';
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.content',
      '.article-content',
      '.post-content',
      'main',
      '.entry-content'
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        break;
      }
    }

    // If no specific content found, try to get all paragraphs
    if (!content) {
      content = $('p').map((_, el) => $(el).text().trim()).get().join('\n\n');
    }

    // Extract keywords from meta tags
    const keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || [];

    // Try to extract author information
    const authors: string[] = [];
    $('meta[name="author"]').each((_, el) => {
      const author = $(el).attr('content');
      if (author) authors.push(author.trim());
    });

    // Also try other author selectors
    $('.author, .byline, [rel="author"]').each((_, el) => {
      const author = $(el).text().trim();
      if (author && !authors.includes(author)) {
        authors.push(author);
      }
    });

    return {
      title: title || 'Untitled Article',
      abstract: abstract || '',
      content: content || '',
      keywords,
      authors: authors.length > 0 ? authors : ['Unknown Author'],
      sourceUrl: url
    };
  } catch (error) {
    console.error('Error fetching URL:', error);
    throw new Error(`Failed to fetch content from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

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
    const url = formData.get('url') as string;

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

    if (uploadType === 'url' && !url?.trim()) {
      return NextResponse.json(
        { error: 'URL is required for URL upload' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (uploadType === 'url' && url?.trim()) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { error: 'Please provide a valid URL' },
          { status: 400 }
        );
      }
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
    } else if (uploadType === 'url') {
      documentType = 'TEXT';
      documentUrl = url;
    }

    // Handle URL content fetching
    let finalTitle = title;
    let finalAbstract = abstract;
    let finalKeywords = keywords;
    let finalAuthors = authors;

    if (uploadType === 'url' && url) {
      try {
        const parsedContent = await fetchAndParseUrl(url);
        
        // Use parsed content if form fields are empty, otherwise keep user input
        finalTitle = title?.trim() || parsedContent.title;
        finalAbstract = abstract?.trim() || parsedContent.abstract;
        
        // Merge keywords and authors
        if (keywords.length === 0 && parsedContent.keywords.length > 0) {
          finalKeywords = parsedContent.keywords;
        }
        if (authors.length === 0 && parsedContent.authors.length > 0) {
          finalAuthors = parsedContent.authors;
        }
        
        console.log('Successfully parsed content from URL:', url);
      } catch (error) {
        console.error('Failed to parse URL content:', error);
        return NextResponse.json(
          { error: `Failed to fetch content from URL: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 400 }
        );
      }
    }

    // Create or find authors
    const authorRecords = await Promise.all(
      finalAuthors.map(async (authorName) => {
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
        title: finalTitle.trim(),
        abstract: finalAbstract?.trim() || null,
        keywords: finalKeywords,
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
              : uploadType === 'pdf'
              ? 'Uploaded from PDF file'
              : `Uploaded from URL: ${url}`
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
