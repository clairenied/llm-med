import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Checking database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected');

    console.log('🔍 Checking if usedAt column exists...');
    
    try {
      await prisma.$queryRaw`SELECT "usedAt" FROM "Invitation" LIMIT 1`;
      return NextResponse.json({ 
        success: true,
        message: 'usedAt column already exists!',
        status: 'already_exists'
      });
    } catch (error) {
      console.log('❌ usedAt column missing, adding it...');
    }

    console.log('🔧 Adding usedAt column to Invitation table...');
    await prisma.$executeRaw`ALTER TABLE "Invitation" ADD COLUMN "usedAt" TIMESTAMP(3)`;
    
    console.log('✅ Successfully added usedAt column!');
    
    // Test that it works
    console.log('🧪 Testing invitation query...');
    const invitations = await prisma.invitation.findMany({
      take: 1
    });
    console.log('✅ Invitation queries working!');
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully added usedAt column and verified it works!',
      status: 'added',
      testResult: `Found ${invitations.length} invitations`
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json({ 
      success: false,
      error: 'Migration failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
