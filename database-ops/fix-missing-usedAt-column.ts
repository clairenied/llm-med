#!/usr/bin/env tsx

/**
 * Manual script to add the missing usedAt column to the Invitation table
 * Run this if the postbuild migration didn't work
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addUsedAtColumn() {
  try {
    console.log('🔍 Checking if usedAt column exists...')
    
    // Try to query the usedAt column to see if it exists
    try {
      await prisma.$queryRaw`SELECT "usedAt" FROM "Invitation" LIMIT 1`
      console.log('✅ usedAt column already exists!')
      return
    } catch (error) {
      console.log('❌ usedAt column missing, adding it...')
    }

    // Add the missing column
    console.log('🔧 Adding usedAt column to Invitation table...')
    await prisma.$executeRaw`ALTER TABLE "Invitation" ADD COLUMN "usedAt" TIMESTAMP(3)`
    
    console.log('✅ Successfully added usedAt column!')
    
    // Verify it was added
    const result = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Invitation' AND column_name = 'usedAt'`
    console.log('🔍 Verification result:', result)
    
  } catch (error) {
    console.error('❌ Error adding usedAt column:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  addUsedAtColumn()
    .then(() => {
      console.log('🎉 Migration completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

export { addUsedAtColumn }
