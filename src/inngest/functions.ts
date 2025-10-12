import { inngest } from "./client";

// Sample function for testing
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

// Import scraper functions
import { scraperOrchestrator } from "./functions/scraper-orchestrator";
import { pageScanner } from "./functions/page-scanner";
import { articleEnhancer } from "./functions/article-enhancer";
import { articlePersister } from "./functions/article-persister";

// Re-export individual functions
export { scraperOrchestrator, pageScanner, articleEnhancer, articlePersister };

// Export all functions as array for easy registration
export const allFunctions = [
  helloWorld,
  scraperOrchestrator,
  pageScanner,
  articleEnhancer,
  articlePersister,
] as const;
