import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('🗑️  Starting bulk deletion of scraped articles...');

    // Find all manuscripts that have F1000Research sources (scraped articles)
    const scrapedManuscripts = await prisma.manuscript.findMany({
      where: {
        sources: {
          some: {
            source: {
              name: 'F1000Research'
            }
          }
        }
      },
      include: {
        sources: true,
        versions: true,
        authors: true
      }
    });

    console.log(`📊 Found ${scrapedManuscripts.length} scraped manuscripts to delete`);

    if (scrapedManuscripts.length === 0) {
      return NextResponse.json({ 
        message: 'No scraped articles found to delete',
        deletedCount: 0 
      });
    }

    // Delete all scraped manuscripts (cascade will handle versions, reviews, etc.)
    const deleteResult = await prisma.manuscript.deleteMany({
      where: {
        id: {
          in: scrapedManuscripts.map(m => m.id)
        }
      }
    });

    // Clean up orphaned authors (authors not connected to any manuscripts)
    const orphanedAuthors = await prisma.author.findMany({
      where: {
        manuscripts: {
          none: {}
        }
      }
    });

    if (orphanedAuthors.length > 0) {
      await prisma.author.deleteMany({
        where: {
          id: {
            in: orphanedAuthors.map(a => a.id)
          }
        }
      });
      console.log(`🧹 Cleaned up ${orphanedAuthors.length} orphaned authors`);
    }

    console.log(`✅ Successfully deleted ${deleteResult.count} scraped manuscripts`);

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} scraped articles`,
      deletedCount: deleteResult.count,
      orphanedAuthorsDeleted: orphanedAuthors.length
    });

  } catch (error) {
    console.error('Error deleting scraped articles:', error);
    return NextResponse.json(
      { error: 'Failed to delete scraped articles' },
      { status: 500 }
    );
  }
}
