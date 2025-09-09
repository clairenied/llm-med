const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test invitations table
    const invitationCount = await prisma.invitation.count();
    console.log(`📊 Found ${invitationCount} invitations in database`);
    
    // Test fetching invitations (same as API)
    const invitations = await prisma.invitation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(`📋 Successfully fetched ${invitations.length} invitations`);
    
    if (invitations.length > 0) {
      console.log('Sample invitation:', {
        id: invitations[0].id,
        email: invitations[0].email,
        role: invitations[0].role,
        createdAt: invitations[0].createdAt,
        expiresAt: invitations[0].expiresAt,
        usedAt: invitations[0].usedAt
      });
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
