/**
 * Inngest Functions Registry
 *
 * This file exports all Inngest functions for registration
 */

import { orchestrator } from "./functions/orchestrator";
import { scanner } from "./functions/scanner";
import { enhancer } from "./functions/enhancer";
import { persister } from "./functions/persister";

// Export individual functions
export { orchestrator, scanner, enhancer, persister };

// Export all functions as array for easy registration
export const allFunctions = [
  orchestrator,
  scanner,
  enhancer,
  persister,
] as const;
