const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAuthors() {
  try {
    // Check manuscripts and their authors
    const manuscripts = await prisma.manuscript.findMany({
      include: {
        authors: true,
        sources: true
      },
      take: 5
    });

    console.log('📊 Sample of manuscripts and their authors:');
    console.log('');
    
    for (const manuscript of manuscripts) {
      console.log(`📄 ${manuscript.title.substring(0, 60)}...`);
      console.log(`   Status: ${manuscript.status}`);
      console.log(`   Authors: ${manuscript.authors.length > 0 ? manuscript.authors.map(a => a.name).join(', ') : 'NO AUTHORS'}`);
      console.log(`   Sources: ${manuscript.sources.length > 0 ? manuscript.sources.map(s => s.url).join(', ') : 'NO SOURCES'}`);
      console.log('');
    }

    // Count total authors
    const totalAuthors = await prisma.author.count();
    const totalManuscripts = await prisma.manuscript.count();
    const manuscriptsWithoutAuthors = await prisma.manuscript.count({
      where: {
        authors: {
          none: {}
        }
      }
    });

    console.log('📈 Summary:');
    console.log(`   Total manuscripts: ${totalManuscripts}`);
    console.log(`   Total authors: ${totalAuthors}`);
    console.log(`   Manuscripts without authors: ${manuscriptsWithoutAuthors}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuthors();
