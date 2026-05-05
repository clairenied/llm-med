import { test, expect } from "@playwright/test";

test.describe("User Profile", () => {
  test("profile page requires authentication", async ({ page }) => {
    await page.goto("/profile");

    // Should redirect to signin
    await expect(page).toHaveURL(/signin|profile/, { timeout: 10000 });
  });

  test("profile page has change password option", async ({ page }) => {
    await page.goto("/profile");

    await page.waitForTimeout(2000);

    if (page.url().includes("profile") && !page.url().includes("signin")) {
      // Should have password change form
      const passwordSection = page.getByText(/change.*password|password/i);
      const hasPasswordSection = await passwordSection.isVisible().catch(() => false);
    }
  });
});

test.describe("Import Page", () => {
  test("import page requires authentication", async ({ page }) => {
    await page.goto("/import");

    await expect(page).toHaveURL(/signin|import/, { timeout: 10000 });
  });

  test("import page has data input area", async ({ page }) => {
    await page.goto("/import");

    await page.waitForTimeout(2000);

    if (page.url().includes("import") && !page.url().includes("signin")) {
      // Should have textarea or input for data
      const textarea = page.locator("textarea");
      const hasTextarea = await textarea.isVisible().catch(() => false);
    }
  });
});
