import { test, expect } from "@playwright/test";

test.describe("Auth Error Page", () => {
  test("displays generic error message", async ({ page }) => {
    await page.goto("/auth/error");
    await page.waitForLoadState("networkidle");

    // Should show error heading
    await expect(page.getByRole("heading", { name: /authentication error/i })).toBeVisible();

    // Should show error message
    await expect(page.getByText(/error occurred during authentication/i)).toBeVisible();
  });

  test("displays Configuration error message", async ({ page }) => {
    await page.goto("/auth/error?error=Configuration");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/server configuration/i)).toBeVisible();
  });

  test("displays AccessDenied error message", async ({ page }) => {
    await page.goto("/auth/error?error=AccessDenied");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/access denied/i)).toBeVisible();
  });

  test("displays Verification error message", async ({ page }) => {
    await page.goto("/auth/error?error=Verification");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/verification token/i)).toBeVisible();
  });

  test("has Try Again link to signin", async ({ page }) => {
    await page.goto("/auth/error");
    await page.waitForLoadState("networkidle");

    const tryAgainLink = page.getByRole("link", { name: /try again/i });
    await expect(tryAgainLink).toBeVisible();

    await tryAgainLink.click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/auth/signin");
  });
});
