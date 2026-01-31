import { FullConfig } from "@playwright/test";

/**
 * Minimal global setup for critical path E2E tests.
 * Complex test data setup has been moved to unit/integration tests.
 */
async function globalSetup(config: FullConfig) {
  console.log("🔧 Running minimal E2E global setup...");
  console.log("✅ Global setup complete");
}

export default globalSetup;
