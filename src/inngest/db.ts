import { prisma } from "@/lib/prisma";
import type { Prisma, PrismaClient } from "@prisma/client";

/**
 * Database wrapper for Inngest functions
 * Uses the singleton Prisma client from @/lib/prisma
 */

/**
 * Execute a database operation with automatic retry on transient failures
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      const isRetryable =
        error instanceof Error &&
        (error.message.includes("connection") ||
          error.message.includes("timeout") ||
          error.message.includes("ECONNRESET"));

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Get the Prisma client instance
 * This ensures we always use the singleton
 */
export function getDb(): PrismaClient {
  return prisma;
}

/**
 * Type-safe transaction wrapper
 */
export async function transaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return await withRetry(() => prisma.$transaction(callback));
}

export { prisma as db };
