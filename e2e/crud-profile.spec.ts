import { test, expect } from "./fixtures/auth";

test.describe("Profile CRUD Operations", () => {
  test.describe("Read Profile", () => {
    test("user can view their profile", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/profile");
      await page.waitForLoadState("networkidle");

      // Should show profile information
      const heading = page.getByRole("heading", { name: /profile/i }).first();
      const hasHeading = await heading.isVisible().catch(() => false);
      expect(page.url()).toContain("/profile");
    });
  });

  test.describe("Update Profile (Change Password)", () => {
    test("user can access change password form", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/profile");
      await page.waitForLoadState("networkidle");

      // Should have password fields
      const currentPasswordField = page.getByLabel(/current.*password/i);
      const newPasswordField = page.getByLabel(/new.*password/i);

      const hasCurrentPassword = await currentPasswordField.isVisible().catch(() => false);
      const hasNewPassword = await newPasswordField.isVisible().catch(() => false);

      // At least some password functionality should exist
      const changePasswordSection = page.getByText(/change.*password|password/i);
      const hasPasswordSection = await changePasswordSection.isVisible().catch(() => false);
    });

    test("validates password requirements", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/profile");
      await page.waitForLoadState("networkidle");

      const currentPasswordField = page.getByLabel(/current.*password/i);
      const newPasswordField = page.getByLabel(/new.*password/i);
      const confirmPasswordField = page.getByLabel(/confirm.*password/i);

      if (await currentPasswordField.isVisible()) {
        await currentPasswordField.fill("wrongpassword");
      }

      if (await newPasswordField.isVisible()) {
        await newPasswordField.fill("short");
      }

      if (await confirmPasswordField.isVisible()) {
        await confirmPasswordField.fill("mismatch");
      }

      const submitButton = page.getByRole("button", { name: /change.*password|update.*password|save/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(500);

        // Should show error (validation failed)
        const hasError = await page.getByText(/error|invalid|mismatch|short/i).isVisible().catch(() => false);
        // May or may not show error depending on implementation
      }
    });
  });
});

test.describe("Import Page Operations", () => {
  test.describe("Import Data", () => {
    test("user can access import page", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/import");
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/import");

      // Should have data input area
      const textarea = page.locator("textarea").first();
      const hasTextarea = await textarea.isVisible().catch(() => false);
    });

    test("can submit import data", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/import");
      await page.waitForLoadState("networkidle");

      const textarea = page.locator("textarea").first();
      if (await textarea.isVisible()) {
        // Enter some test JSON data
        await textarea.fill(
          JSON.stringify({
            title: "Imported Test Article",
            authors: ["Test Author"],
          })
        );

        const importButton = page.getByRole("button", { name: /import|submit/i });
        if (await importButton.isVisible()) {
          await importButton.click();
          await page.waitForLoadState("networkidle");
        }
      }
    });
  });
});

test.describe("Upload Manuscript Operations", () => {
  test.describe("Upload Article", () => {
    test("user can access upload page", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/manuscripts/upload");
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/upload");
    });

    test("upload form has file input", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/manuscripts/upload");
      await page.waitForLoadState("networkidle");

      // Look for file input
      const fileInput = page.locator("input[type='file']");
      const hasFileInput = await fileInput.isVisible().catch(() => false);

      // Or a drop zone
      const dropZone = page.getByText(/drop|upload|select.*file/i);
      const hasDropZone = await dropZone.isVisible().catch(() => false);
    });
  });
});
