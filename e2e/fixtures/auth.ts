import { test as base, expect } from "@playwright/test";
import type { Page, Response } from "@playwright/test";
export type { Page, Response };

// Test user credentials (must exist in database or be created by global setup)
export const TEST_USERS = {
  admin: {
    email: "admin@test.llm-med.local",
    password: "TestPassword123!",
    name: "Test Admin",
    role: "ADMIN" as const,
  },
  grader: {
    email: "grader@test.llm-med.local",
    password: "TestPassword123!",
    name: "Test Grader",
    role: "GRADER" as const,
  },
  author: {
    email: "author@test.llm-med.local",
    password: "TestPassword123!",
    name: "Test Author",
    role: "AUTHOR" as const,
  },
};

type UserType = keyof typeof TEST_USERS;

// Extended test fixture with authentication helpers
export const test = base.extend<{
  authenticatedPage: Page;
  loginAs: (userType: UserType) => Promise<void>;
}>({
  // Helper function to log in as a specific user type
  loginAs: async ({ page }, use) => {
    const loginAs = async (userType: UserType) => {
      const user = TEST_USERS[userType];

      // Navigate to sign in page
      await page.goto("/auth/signin");

      // Wait for the page to load
      await page.waitForLoadState("networkidle");

      // Click on Password tab to switch to credentials login
      const passwordTab = page.getByRole("button", { name: "Password" });
      if (await passwordTab.isVisible()) {
        await passwordTab.click();
      }

      // Fill in credentials
      await page.getByLabel("Email").fill(user.email);
      await page.getByLabel("Password").fill(user.password);

      // Click sign in button (the second one, which is the form submit)
      await page.getByRole("button", { name: "Sign In" }).last().click();

      // Wait for navigation away from signin page
      await page.waitForURL((url) => !url.pathname.includes("/auth/signin"), {
        timeout: 10000,
      });
    };

    await use(loginAs);
  },

  // Pre-authenticated page for admin user
  authenticatedPage: async ({ page, loginAs }, use) => {
    // Default to admin user
    await loginAs("admin");
    await use(page);
  },
});

export { expect };

// Helper to check if user is authenticated
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check for sign out button or user menu (indicates logged in)
  const signOutButton = page.getByRole("button", { name: /sign out|logout/i });
  const userMenu = page.locator('[data-testid="user-menu"]');

  return (
    (await signOutButton.isVisible().catch(() => false)) ||
    (await userMenu.isVisible().catch(() => false))
  );
}

// Helper to sign out
export async function signOut(page: Page): Promise<void> {
  const signOutButton = page.getByRole("button", { name: /sign out|logout/i });
  if (await signOutButton.isVisible()) {
    await signOutButton.click();
    await page.waitForURL(/signin/);
  }
}
