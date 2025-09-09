import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateScrapedArticlesStatus() {
  try {
    console.log('🔄 Updating status of scraped articles from DRAFT to PUBLISHED...');
    
    // Find all manuscripts that have F1000Research sources and are currently DRAFT
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        status: 'DRAFT',
        sources: {
          some: {
            source: {
              name: 'F1000Research'
            }
          }
        }
      },
      include: {
        sources: {
          include: {
            source: true
          }
        }
      }
    });

    console.log(`📊 Found ${manuscripts.length} F1000Research manuscripts with DRAFT status`);

    if (manuscripts.length === 0) {
      console.log('✅ No manuscripts to update');
      return;
    }

    // Update all found manuscripts to PUBLISHED status
    const updateResult = await prisma.manuscript.updateMany({
      where: {
        id: {
          in: manuscripts.map(m => m.id)
        }
      },
      data: {
        status: 'PUBLISHED'
      }
    });

    console.log(`✅ Updated ${updateResult.count} manuscripts to PUBLISHED status`);
    console.log('');
    console.log('📋 Summary:');
    console.log(`   • F1000Research articles: ${updateResult.count} → PUBLISHED`);
    console.log(`   • User uploads remain: DRAFT (appropriate for user-submitted work)`);
    console.log('');
    console.log('🎉 Status update completed successfully!');

  } catch (error) {
    console.error('❌ Error updating manuscript status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateScrapedArticlesStatus();
