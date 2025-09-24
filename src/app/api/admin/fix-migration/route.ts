import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('🔍 Checking if usedAt column exists...');
    
    // Try to query the usedAt column to see if it exists
    try {
      await prisma.$queryRaw`SELECT "usedAt" FROM "Invitation" LIMIT 1`;
      return NextResponse.json({ 
        message: 'usedAt column already exists!',
        status: 'already_exists'
      });
    } catch (error) {
      console.log('❌ usedAt column missing, adding it...');
    }

    // Add the missing column
    console.log('🔧 Adding usedAt column to Invitation table...');
    await prisma.$executeRaw`ALTER TABLE "Invitation" ADD COLUMN "usedAt" TIMESTAMP(3)`;
    
    console.log('✅ Successfully added usedAt column!');
    
    // Verify it was added
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Invitation' AND column_name = 'usedAt'
    `;
    
    return NextResponse.json({ 
      message: 'Successfully added usedAt column!',
      status: 'added',
      verification: result
    });
    
  } catch (error) {
    console.error('❌ Error adding usedAt column:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to add usedAt column',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
