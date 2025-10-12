/**
 * Inngest Functions Registry
 *
 * This file exports all Inngest functions for registration
 */

import { f1000ListPapers } from "./functions/f1000-list-papers";
import { f1000FetchArticle } from "./functions/f1000-fetch-article";

// Export individual functions
export { f1000ListPapers, f1000FetchArticle };

// Export all functions as array for easy registration
export const allFunctions = [f1000ListPapers, f1000FetchArticle] as const;
