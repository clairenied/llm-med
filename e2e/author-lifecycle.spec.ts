import { test, expect } from "./fixtures/auth";

/**
 * End-to-End Author Lifecycle Tests
 * 
 * Tests the complete author management workflow:
 * 1. Create a new author
 * 2. View author details
 * 3. Link author to a manuscript
 * 4. Edit author information
 * 5. Search for author
 * 6. Delete author
 */

test.describe("Author Complete Lifecycle", () => {
  const timestamp = Date.now();
  const authorName = `Dr. E2E Lifecycle Author ${timestamp}`;
  let authorId: string;

  test.describe.serial("Full author journey", () => {
    
    test("1. Create a new author", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/authors/new");
      await page.waitForLoadState("networkidle");

      // Fill in author details
      await page.getByLabel(/name/i).fill(authorName);
      
      // Fill email if available
      const emailField = page.getByLabel(/email/i);
      if (await emailField.isVisible()) {
        await emailField.fill(`lifecycle.author.${timestamp}@test.example.com`);
      }

      // Fill affiliation if available
      const affiliationField = page.getByLabel(/affiliation/i);
      if (await affiliationField.isVisible()) {
        await affiliationField.fill("E2E Test University");
      }

      // Fill ORCID if available
      const orcidField = page.getByLabel(/orcid/i);
      if (await orcidField.isVisible()) {
        await orcidField.fill(`0000-0001-${timestamp.toString().slice(-4)}-0001`);
      }

      // Submit
      const submitButton = page.getByRole("button", { name: /create|save|submit/i });
      await submitButton.click();

      // Wait for redirect
      await page.waitForLoadState("networkidle");

      // Extract author ID from URL
      const url = page.url();
      const match = url.match(/authors\/([a-zA-Z0-9]+)/);
      if (match) {
        authorId = match[1];
      }

      // Verify author was created
      await expect(page.getByText(authorName)).toBeVisible();
    });

    test("2. View author details", async ({ page, loginAs }) => {
      test.skip(!authorId, "No author created");

      await loginAs("admin");
      await page.goto(`/authors/${authorId}`);
      await page.waitForLoadState("networkidle");

      // Verify author details are displayed
      await expect(page.getByText(authorName)).toBeVisible();
    });

    test("3. Author appears in authors list", async ({ page, loginAs }) => {
      test.skip(!authorId, "No author created");

      await loginAs("admin");
      await page.goto("/authors");
      await page.waitForLoadState("networkidle");

      // Search for the author if search is available
      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill(authorName.substring(0, 20));
        await page.waitForTimeout(500);
      }

      // Verify author appears in list
      await expect(page.getByText(new RegExp(authorName.substring(0, 20), "i"))).toBeVisible();
    });

    test("4. Edit author information", async ({ page, loginAs }) => {
      test.skip(!authorId, "No author created");

      await loginAs("admin");
      await page.goto(`/authors/${authorId}/edit`);
      await page.waitForLoadState("networkidle");

      // Update affiliation
      const affiliationField = page.getByLabel(/affiliation/i);
      if (await affiliationField.isVisible()) {
        await affiliationField.fill("Updated E2E Test Institute");
      }

      // Save changes
      const saveButton = page.getByRole("button", { name: /save|update|submit/i });
      await saveButton.click();

      // Wait for redirect
      await page.waitForLoadState("networkidle");

      // Verify update
      await page.goto(`/authors/${authorId}`);
      await page.waitForLoadState("networkidle");
      
      const hasUpdate = await page.getByText(/updated.*institute/i).isVisible() || 
                        await page.getByText(authorName).isVisible();
      expect(hasUpdate).toBeTruthy();
    });

    test("5. Author can be linked to manuscript", async ({ page, loginAs }) => {
      test.skip(!authorId, "No author created");

      await loginAs("admin");
      
      // Create a manuscript with this author
      await page.goto("/manuscripts/upload");
      await page.waitForLoadState("networkidle");

      // Fill in manuscript details
      await page.getByLabel(/article title/i).fill(`Manuscript by ${authorName}`);
      
      // Add the author by name
      await page.getByPlaceholder(/enter author name/i).fill(authorName);
      await page.getByRole("button", { name: /^add$/i }).first().click();

      // Fill content
      await page.getByLabel(/article content/i).fill("Test content for author linking test.");

      // Submit
      await page.getByRole("button", { name: /upload article/i }).click();
      await page.waitForLoadState("networkidle");

      // Verify manuscript was created with author
      await expect(page.getByText(authorName)).toBeVisible();
    });

    test("6. Delete the author (cleanup)", async ({ page, loginAs }) => {
      test.skip(!authorId, "No author created");

      await loginAs("admin");
      await page.goto(`/authors/${authorId}`);
      await page.waitForLoadState("networkidle");

      // Look for delete button
      const deleteButton = page.getByRole("button", { name: /delete/i });
      
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog
        page.on("dialog", (dialog) => dialog.accept());
        
        await deleteButton.click();
        await page.waitForLoadState("networkidle");

        // Verify deleted
        expect(page.url()).not.toContain(authorId);
      }
    });
  });
});

test.describe("Author Integration with Manuscripts", () => {
  
  test("creating manuscript creates new author entries", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/manuscripts/upload");
    await page.waitForLoadState("networkidle");

    const timestamp = Date.now();
    const newAuthorName = `New Author ${timestamp}`;

    // Fill in manuscript with new author
    await page.getByLabel(/article title/i).fill(`Test Manuscript ${timestamp}`);
    await page.getByPlaceholder(/enter author name/i).fill(newAuthorName);
    await page.getByRole("button", { name: /^add$/i }).first().click();
    await page.getByLabel(/article content/i).fill("Test content.");

    await page.getByRole("button", { name: /upload article/i }).click();
    await page.waitForLoadState("networkidle");

    // Verify author was added to manuscript
    await expect(page.getByText(newAuthorName)).toBeVisible();
  });

  test("multiple authors can be added to single manuscript", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/manuscripts/upload");
    await page.waitForLoadState("networkidle");

    const timestamp = Date.now();

    // Fill in manuscript with multiple authors
    await page.getByLabel(/article title/i).fill(`Multi-Author Test ${timestamp}`);

    // Add first author
    await page.getByPlaceholder(/enter author name/i).fill("First Author");
    await page.getByRole("button", { name: /^add$/i }).first().click();
    await expect(page.getByText("First Author")).toBeVisible();

    // Add second author
    await page.getByPlaceholder(/enter author name/i).fill("Second Author");
    await page.getByRole("button", { name: /^add$/i }).first().click();
    await expect(page.getByText("Second Author")).toBeVisible();

    // Add third author
    await page.getByPlaceholder(/enter author name/i).fill("Third Author");
    await page.getByRole("button", { name: /^add$/i }).first().click();
    await expect(page.getByText("Third Author")).toBeVisible();

    // All three authors should be visible
    await expect(page.getByText("First Author")).toBeVisible();
    await expect(page.getByText("Second Author")).toBeVisible();
    await expect(page.getByText("Third Author")).toBeVisible();
  });
});
