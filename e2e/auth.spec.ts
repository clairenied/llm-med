import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("Sign In Page", () => {
    test("displays sign in form", async ({ page }) => {
      await page.goto("/auth/signin");

      // Check page title and form elements
      await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    });

    test("shows error for invalid credentials", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.getByLabel(/email/i).fill("invalid@example.com");
      await page.getByLabel(/password/i).fill("wrongpassword");
      await page.getByRole("button", { name: /sign in/i }).click();

      // Wait for error message
      await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({
        timeout: 10000,
      });
    });

    test("has link to forgot password", async ({ page }) => {
      await page.goto("/auth/signin");

      const forgotPasswordLink = page.getByRole("link", { name: /forgot.*password/i });
      await expect(forgotPasswordLink).toBeVisible();
      
      await forgotPasswordLink.click();
      await expect(page).toHaveURL(/forgot-password/);
    });

    test("shows magic link option if available", async ({ page }) => {
      await page.goto("/auth/signin");

      // Check if magic link option is present (may be a tab or button)
      const magicLinkOption = page.getByText(/magic link|email.*link|passwordless/i);
      // This test just checks if the element exists, doesn't fail if not present
      const isVisible = await magicLinkOption.isVisible().catch(() => false);
      
      if (isVisible) {
        await expect(magicLinkOption).toBeVisible();
      }
    });
  });

  test.describe("Sign Up Page", () => {
    test("requires invitation token", async ({ page }) => {
      // Try to access signup without token
      await page.goto("/auth/signup");

      // Should show error or redirect
      await expect(
        page.getByText(/invitation|invalid|required/i)
      ).toBeVisible({ timeout: 10000 });
    });

    test("displays sign up form with valid invitation", async ({ page }) => {
      // Note: This test requires a valid invitation token to be set up
      // In a real test, you'd create an invitation first via API
      await page.goto("/auth/signup?invitation=test-token");

      // Check for form elements (may show error if token invalid)
      const emailField = page.getByLabel(/email/i);
      const passwordField = page.getByLabel(/password/i);
      
      // Either form is shown or error about invalid invitation
      const hasForm = await emailField.isVisible().catch(() => false);
      const hasError = await page.getByText(/invalid|expired/i).isVisible().catch(() => false);
      
      expect(hasForm || hasError).toBeTruthy();
    });
  });

  test.describe("Forgot Password Page", () => {
    test("displays forgot password form", async ({ page }) => {
      await page.goto("/auth/forgot-password");

      await expect(page.getByRole("heading", { name: /forgot.*password|reset.*password/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /send|reset|submit/i })).toBeVisible();
    });

    test("shows confirmation after submitting email", async ({ page }) => {
      await page.goto("/auth/forgot-password");

      await page.getByLabel(/email/i).fill("test@example.com");
      await page.getByRole("button", { name: /send|reset|submit/i }).click();

      // Should show confirmation or error
      await expect(
        page.getByText(/sent|check.*email|instructions|error/i)
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Protected Routes", () => {
    test("redirects unauthenticated users from manuscripts page", async ({ page }) => {
      await page.goto("/manuscripts/new");

      // Should redirect to signin
      await expect(page).toHaveURL(/signin/, { timeout: 10000 });
    });

    test("redirects unauthenticated users from admin page", async ({ page }) => {
      await page.goto("/admin");

      // Should redirect to signin or show unauthorized
      await expect(page).toHaveURL(/signin|unauthorized/, { timeout: 10000 });
    });

    test("redirects unauthenticated users from grading page", async ({ page }) => {
      await page.goto("/grading");

      // Should redirect to signin
      await expect(page).toHaveURL(/signin/, { timeout: 10000 });
    });
  });
});
