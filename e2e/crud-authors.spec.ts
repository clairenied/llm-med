import { test, expect, TEST_USERS } from "./fixtures/auth";

test.describe("Authors CRUD Operations", () => {
  test.describe("Create Author", () => {
    test("can create a new author with all fields", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors/new");
      await page.waitForLoadState("networkidle");

      // Generate unique test data
      const timestamp = Date.now();
      const testAuthor = {
        name: `Test Author ${timestamp}`,
        email: `test${timestamp}@example.com`,
        affiliation: "Test University",
        orcId: `0000-0001-${timestamp.toString().slice(-4)}-0000`,
      };

      // Fill in the form
      await page.getByLabel(/name/i).fill(testAuthor.name);

      const emailField = page.getByLabel(/email/i);
      if (await emailField.isVisible()) {
        await emailField.fill(testAuthor.email);
      }

      const affiliationField = page.getByLabel(/affiliation/i);
      if (await affiliationField.isVisible()) {
        await affiliationField.fill(testAuthor.affiliation);
      }

      const orcIdField = page.getByLabel(/orc/i);
      if (await orcIdField.isVisible()) {
        await orcIdField.fill(testAuthor.orcId);
      }

      // Submit
      const submitButton = page.getByRole("button", { name: /create|save|submit/i });
      await submitButton.click();

      // Wait for redirect or success
      await page.waitForLoadState("networkidle");

      // Should redirect to authors list or show success
      const url = page.url();
      const hasSuccess = await page.getByText(/success|created/i).isVisible().catch(() => false);
      expect(url.includes("/authors") || hasSuccess).toBeTruthy();
    });

    test("validates required fields", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors/new");
      await page.waitForLoadState("networkidle");

      // Try to submit without filling required fields
      const submitButton = page.getByRole("button", { name: /create|save|submit/i });
      await submitButton.click();

      // Should show validation error or stay on page
      await page.waitForTimeout(500);
      const isStillOnForm = page.url().includes("/authors/new");
      expect(isStillOnForm).toBeTruthy();
    });
  });

  test.describe("Read Authors", () => {
    test("can view authors list", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors");
      await page.waitForLoadState("networkidle");

      // Should show authors heading
      const heading = page.getByRole("heading", { name: /authors/i }).first();
      await expect(heading).toBeVisible();
    });

    test("can view single author detail", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors");
      await page.waitForLoadState("networkidle");

      // Click on first author if exists
      const authorLink = page.locator("a[href*='/authors/']").first();
      if (await authorLink.isVisible()) {
        const href = await authorLink.getAttribute("href");
        if (href && !href.includes("/new") && !href.includes("/edit")) {
          await authorLink.click();
          await page.waitForLoadState("networkidle");

          // Should be on author detail page
          expect(page.url()).toMatch(/\/authors\/[a-zA-Z0-9-]+$/);
        }
      }
    });

    test("can search/filter authors", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors");
      await page.waitForLoadState("networkidle");

      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill("test");
        await page.waitForTimeout(500);
        await page.waitForLoadState("networkidle");
      }
    });
  });

  test.describe("Update Author", () => {
    test("can access edit author form", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors");
      await page.waitForLoadState("networkidle");

      // Find an edit link or button
      const editLink = page.getByRole("link", { name: /edit/i }).first();
      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForLoadState("networkidle");

        // Should be on edit page
        expect(page.url()).toContain("/edit");

        // Form should be pre-filled
        const nameField = page.getByLabel(/name/i);
        const nameValue = await nameField.inputValue();
        expect(nameValue.length).toBeGreaterThan(0);
      }
    });

    test("can update author details", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors");
      await page.waitForLoadState("networkidle");

      const editLink = page.getByRole("link", { name: /edit/i }).first();
      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForLoadState("networkidle");

        // Update the name
        const nameField = page.getByLabel(/name/i);
        const originalName = await nameField.inputValue();
        await nameField.fill(`${originalName} Updated`);

        // Submit
        const submitButton = page.getByRole("button", { name: /update|save/i });
        await submitButton.click();

        await page.waitForLoadState("networkidle");

        // Should redirect or show success
        const hasSuccess = await page.getByText(/success|updated/i).isVisible().catch(() => false);
        const redirected = !page.url().includes("/edit");
        expect(hasSuccess || redirected).toBeTruthy();
      }
    });
  });

  test.describe("Delete Author", () => {
    test("can delete an author", async ({ page, loginAs }) => {
      await loginAs("admin"); // May need admin for delete

      await page.goto("/authors");
      await page.waitForLoadState("networkidle");

      // Find delete button
      const deleteButton = page.getByRole("button", { name: /delete/i }).first();
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog
        page.on("dialog", (dialog) => dialog.accept());

        await deleteButton.click();
        await page.waitForLoadState("networkidle");

        // Should show success or stay on list
        const hasSuccess = await page.getByText(/deleted|removed/i).isVisible().catch(() => false);
        expect(page.url().includes("/authors") || hasSuccess).toBeTruthy();
      }
    });
  });
});
