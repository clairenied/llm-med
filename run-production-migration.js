#!/usr/bin/env node

/**
 * Simple script to run the missing migration in production
 * This bypasses the need for authentication
 */

const { PrismaClient } = require('@prisma/client')

async function runMigration() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Checking database connection...')
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connected')

    console.log('🔍 Checking if usedAt column exists...')
    
    try {
      await prisma.$queryRaw`SELECT "usedAt" FROM "Invitation" LIMIT 1`
      console.log('✅ usedAt column already exists!')
      return
    } catch (error) {
      console.log('❌ usedAt column missing, adding it...')
    }

    console.log('🔧 Adding usedAt column to Invitation table...')
    await prisma.$executeRaw`ALTER TABLE "Invitation" ADD COLUMN "usedAt" TIMESTAMP(3)`
    
    console.log('✅ Successfully added usedAt column!')
    
    // Test that it works
    console.log('🧪 Testing invitation query...')
    const invitations = await prisma.invitation.findMany({
      take: 1
    })
    console.log('✅ Invitation queries working!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

runMigration()
  .then(() => {
    console.log('🎉 Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })
