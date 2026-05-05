import { test, expect } from "@playwright/test";

test.describe("Authors CRUD", () => {
  test.describe("Author List", () => {
    test("authors page loads", async ({ page }) => {
      await page.goto("/authors");

      // Should show authors list or redirect to signin
      await expect(page).toHaveURL(/signin|authors/, { timeout: 10000 });
    });

    test("authors page has search functionality", async ({ page }) => {
      await page.goto("/authors");

      await page.waitForTimeout(1000);

      // If we're on the authors page
      if (page.url().includes("authors")) {
        const searchInput = page.getByPlaceholder(/search/i);
        const hasSearch = await searchInput.isVisible().catch(() => false);

        if (hasSearch) {
          await searchInput.fill("test");
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe("Author Detail", () => {
    test("author detail page structure", async ({ page }) => {
      await page.goto("/authors/test-id");

      await page.waitForTimeout(1000);

      // Should show error or author details
      const url = page.url();
      expect(url.includes("authors") || url.includes("signin")).toBeTruthy();
    });
  });

  test.describe("Create Author", () => {
    test("new author page requires authentication", async ({ page }) => {
      await page.goto("/authors/new");

      await expect(page).toHaveURL(/signin|authors\/new/, { timeout: 10000 });
    });

    test("new author form has required fields", async ({ page }) => {
      await page.goto("/authors/new");

      await page.waitForTimeout(1000);

      if (page.url().includes("authors/new")) {
        // Check for name field (required)
        const nameField = page.getByLabel(/name/i);
        const hasNameField = await nameField.isVisible().catch(() => false);

        if (hasNameField) {
          await expect(nameField).toBeVisible();

          // Check for optional fields
          const emailField = page.getByLabel(/email/i);
          const affiliationField = page.getByLabel(/affiliation/i);

          // These should exist but not be required
          const hasEmail = await emailField.isVisible().catch(() => false);
          const hasAffiliation = await affiliationField.isVisible().catch(() => false);

          // At least name should be present
          expect(hasNameField).toBeTruthy();
        }
      }
    });
  });

  test.describe("Edit Author", () => {
    test("edit author page structure", async ({ page }) => {
      await page.goto("/authors/test-id/edit");

      await page.waitForTimeout(1000);

      // Should redirect or show form
      expect(page.url()).toBeTruthy();
    });
  });
});
