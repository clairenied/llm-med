import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");

    // Page should load without errors
    await expect(page).toHaveTitle(/.*/);
  });

  test("shows sign in form for unauthenticated users", async ({ page }) => {
    await page.goto("/");

    // For unauthenticated users, should show sign in or redirect
    const signInButton = page.getByRole("button", { name: /sign in/i });
    const signInLink = page.getByRole("link", { name: /sign in/i });
    const emailField = page.getByLabel(/email/i);

    // At least one of these should be visible
    const hasSignInButton = await signInButton.isVisible().catch(() => false);
    const hasSignInLink = await signInLink.isVisible().catch(() => false);
    const hasEmailField = await emailField.isVisible().catch(() => false);
    const isRedirected = page.url().includes("signin");

    expect(hasSignInButton || hasSignInLink || hasEmailField || isRedirected).toBeTruthy();
  });

  test("navigation is present", async ({ page }) => {
    await page.goto("/");

    // Navigation should be visible
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
  });
});

test.describe("Health Check", () => {
  test("API health endpoint responds", async ({ request }) => {
    const response = await request.get("/api/health");
    
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    expect(body).toHaveProperty("status");
  });
});
