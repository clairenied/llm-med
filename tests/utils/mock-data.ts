// Mock data factories for testing

export const createMockAuthor = (overrides = {}) => ({
  id: `author-${Math.random().toString(36).substr(2, 9)}`,
  name: "John Doe",
  email: "john.doe@example.com",
  affiliation: "Test University",
  orcId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockReviewer = (overrides = {}) => ({
  id: `reviewer-${Math.random().toString(36).substr(2, 9)}`,
  name: "Jane Reviewer",
  email: "jane.reviewer@example.com",
  affiliation: "Review Institute",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockReview = (overrides = {}) => ({
  id: `review-${Math.random().toString(36).substr(2, 9)}`,
  versionId: "version-1",
  reviewerId: "reviewer-1",
  reviewType: "EXTERNAL" as const,
  content: "This is a comprehensive review of the manuscript.",
  documentUrl: null,
  documentType: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  reviewer: createMockReviewer(),
  ...overrides,
});

export const createMockVersion = (overrides = {}) => ({
  id: `version-${Math.random().toString(36).substr(2, 9)}`,
  versionNumber: 1,
  manuscriptId: "manuscript-1",
  documentUrl: "https://example.com/doc.pdf",
  documentType: "PDF" as const,
  notes: "Initial submission",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  reviews: [],
  ...overrides,
});

export const createMockManuscript = (overrides = {}) => ({
  id: `manuscript-${Math.random().toString(36).substr(2, 9)}`,
  title: "Test Manuscript Title",
  abstract: "This is an abstract for the test manuscript.",
  keywords: ["test", "manuscript", "research"],
  status: "DRAFT" as const,
  aiSummary: null,
  aiSummaryGeneratedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  authors: [createMockAuthor()],
  versions: [createMockVersion()],
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: `user-${Math.random().toString(36).substr(2, 9)}`,
  firstName: "Test",
  lastName: "User",
  name: "Test User",
  email: "test@example.com",
  role: "AUTHOR" as const,
  emailVerified: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockInvitation = (overrides = {}) => ({
  id: `invitation-${Math.random().toString(36).substr(2, 9)}`,
  email: "invited@example.com",
  role: "AUTHOR" as const,
  status: "PENDING" as const,
  token: `token-${Math.random().toString(36).substr(2, 9)}`,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  usedAt: null,
  ...overrides,
});

export const createMockGrade = (overrides = {}) => ({
  id: `grade-${Math.random().toString(36).substr(2, 9)}`,
  reviewId: "review-1",
  graderId: "grader-1",
  clinicalRelevance: "GOOD" as const,
  methodology: "GOOD" as const,
  results: "VERY_GOOD" as const,
  writingClarity: "GOOD" as const,
  ethicalConsiderations: "NA" as const,
  notes: "Well-written review.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockEmailTemplate = (overrides = {}) => ({
  id: `template-${Math.random().toString(36).substr(2, 9)}`,
  name: "Test Template",
  subject: "Test Subject",
  body: "<p>Hello {{firstName}},</p><p>This is a test email.</p>",
  type: "COMMUNICATION" as const,
  isDefault: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});
