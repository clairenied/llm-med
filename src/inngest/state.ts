/**
 * State management for scraping sessions
 * Tracks progress, errors, and completion status
 */

export interface SessionState {
  sessionId: string;
  status: "running" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;

  // Configuration
  totalPages: number;

  // Progress tracking
  pagesScanned: number;
  pagesCompleted: number;
  pagesFailed: number;

  articlesDiscovered: number;
  articlesEnhanced: number;
  articlesEnhancementFailed: number;
  articlesPersisted: number;
  articlesDuplicate: number;
  articlesPersistFailed: number;

  // Error tracking
  errors: Array<{
    timestamp: Date;
    source: string;
    error: string;
    context?: Record<string, unknown>;
  }>;
}

/**
 * In-memory session state store
 * Can be extended to use Redis or database for persistence
 */
class SessionStateStore {
  private sessions: Map<string, SessionState> = new Map();

  /**
   * Initialize a new session
   */
  createSession(sessionId: string, totalPages: number): SessionState {
    const state: SessionState = {
      sessionId,
      status: "running",
      startedAt: new Date(),
      totalPages,
      pagesScanned: 0,
      pagesCompleted: 0,
      pagesFailed: 0,
      articlesDiscovered: 0,
      articlesEnhanced: 0,
      articlesEnhancementFailed: 0,
      articlesPersisted: 0,
      articlesDuplicate: 0,
      articlesPersistFailed: 0,
      errors: [],
    };

    this.sessions.set(sessionId, state);
    return state;
  }

  /**
   * Get session state
   */
  getSession(sessionId: string): SessionState | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Update session state
   */
  updateSession(
    sessionId: string,
    updates: Partial<SessionState>,
  ): SessionState {
    const state = this.sessions.get(sessionId);
    if (!state) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updated = { ...state, ...updates };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  /**
   * Increment a counter in session state
   */
  incrementCounter(
    sessionId: string,
    counter: keyof Pick<
      SessionState,
      | "pagesScanned"
      | "pagesCompleted"
      | "pagesFailed"
      | "articlesDiscovered"
      | "articlesEnhanced"
      | "articlesEnhancementFailed"
      | "articlesPersisted"
      | "articlesDuplicate"
      | "articlesPersistFailed"
    >,
    amount: number = 1,
  ): void {
    const state = this.sessions.get(sessionId);
    if (!state) {
      throw new Error(`Session ${sessionId} not found`);
    }

    state[counter] += amount;
    this.sessions.set(sessionId, state);
  }

  /**
   * Add error to session
   */
  addError(
    sessionId: string,
    source: string,
    error: string,
    context?: Record<string, unknown>,
  ): void {
    const state = this.sessions.get(sessionId);
    if (!state) {
      throw new Error(`Session ${sessionId} not found`);
    }

    state.errors.push({
      timestamp: new Date(),
      source,
      error,
      context,
    });

    this.sessions.set(sessionId, state);
  }

  /**
   * Mark session as completed
   */
  completeSession(sessionId: string): SessionState {
    return this.updateSession(sessionId, {
      status: "completed",
      completedAt: new Date(),
    });
  }

  /**
   * Mark session as failed
   */
  failSession(sessionId: string, error: string): SessionState {
    const state = this.getSession(sessionId);
    if (state) {
      this.addError(sessionId, "orchestrator", error);
    }

    return this.updateSession(sessionId, {
      status: "failed",
      completedAt: new Date(),
    });
  }

  /**
   * Check if all pages are complete (either successful or failed)
   */
  isSessionComplete(sessionId: string): boolean {
    const state = this.sessions.get(sessionId);
    if (!state) return false;

    return state.pagesCompleted + state.pagesFailed >= state.totalPages;
  }

  /**
   * Get session statistics
   */
  getStats(sessionId: string) {
    const state = this.sessions.get(sessionId);
    if (!state) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const duration = state.completedAt
      ? state.completedAt.getTime() - state.startedAt.getTime()
      : Date.now() - state.startedAt.getTime();

    return {
      sessionId: state.sessionId,
      status: state.status,
      duration: Math.round(duration / 1000), // seconds
      totalPages: state.totalPages,
      pagesCompleted: state.pagesCompleted,
      pagesFailed: state.pagesFailed,
      articlesDiscovered: state.articlesDiscovered,
      articlesEnhanced: state.articlesEnhanced,
      articlesPersisted: state.articlesPersisted,
      duplicatesSkipped: state.articlesDuplicate,
      errors: state.errors.length,
      errorDetails: state.errors,
    };
  }

  /**
   * Delete old sessions (cleanup)
   */
  cleanup(olderThanMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [sessionId, state] of this.sessions.entries()) {
      const age = now - state.startedAt.getTime();
      if (age > olderThanMs && state.status !== "running") {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Singleton instance
export const sessionStore = new SessionStateStore();
