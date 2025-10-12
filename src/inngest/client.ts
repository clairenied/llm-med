import { Inngest, EventSchemas } from "inngest";
import type { Events } from "./events";

/**
 * Create a typed Inngest client for the manuscript review tracker
 * This provides full type safety for all events
 */
export const inngest = new Inngest({
  id: "manuscript-review-tracker",
  name: "Manuscript Review Tracker",
  schemas: new EventSchemas().fromRecord<Events>(),
});
