import { test, expect } from "@playwright/test";

/**
 * Critical Path E2E Test
 * 
 * This single test file verifies the application loads and core functionality works.
 * More detailed testing is handled by unit and integration tests.
 */

test.describe("Critical Path", () => {
  test("application loads and redirects unauthenticated users", async ({ page }) => {
    // Visit the home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Unauthenticated users should see sign-in or be redirected to it
    const url = page.url();
    const hasSignIn = url.includes("signin") || 
                      await page.getByText(/sign in/i).first().isVisible().catch(() => false);
    
    expect(hasSignIn).toBeTruthy();
  });

  test("API health endpoint responds", async ({ request }) => {
    const response = await request.get("/api/health");
    
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    expect(body.status).toBe("healthy");
  });
});
