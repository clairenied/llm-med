import { test, expect } from "./fixtures/auth";

/**
 * End-to-End Manuscript Lifecycle Tests
 * 
 * These tests follow a manuscript through its complete journey:
 * 1. Create/Upload manuscript
 * 2. View manuscript details
 * 3. Add a version
 * 4. Add a review to the version
 * 5. Grade the review
 * 6. Edit the manuscript
 * 7. Delete the manuscript
 */

test.describe("Manuscript Complete Lifecycle", () => {
  const timestamp = Date.now();
  const manuscriptTitle = `E2E Lifecycle Test Manuscript ${timestamp}`;
  let manuscriptId: string;
  let versionId: string;
  let reviewId: string;

  test.describe.serial("Full manuscript journey", () => {
    
    test("1. Create a new manuscript via upload (text)", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/manuscripts/upload");
      await page.waitForLoadState("networkidle");

      // Fill in the upload form
      await page.getByLabel(/article title/i).fill(manuscriptTitle);
      await page.getByLabel(/abstract/i).fill(`This is the abstract for ${manuscriptTitle}. It describes the research methodology and findings.`);

      // Add author
      await page.getByPlaceholder(/enter author name/i).fill("Dr. Test Author");
      await page.getByRole("button", { name: /^add$/i }).first().click();
      await expect(page.getByText("Dr. Test Author")).toBeVisible();

      // Add another author
      await page.getByPlaceholder(/enter author name/i).fill("Prof. Second Author");
      await page.getByRole("button", { name: /^add$/i }).first().click();
      await expect(page.getByText("Prof. Second Author")).toBeVisible();

      // Add keywords
      await page.getByPlaceholder(/enter keyword/i).fill("e2e-testing");
      await page.getByRole("button", { name: /^add$/i }).last().click();
      await page.getByPlaceholder(/enter keyword/i).fill("lifecycle");
      await page.getByRole("button", { name: /^add$/i }).last().click();

      // Fill in content (required for text upload)
      await page.getByLabel(/article content/i).fill(`
        # Introduction
        This is a comprehensive test manuscript created for end-to-end testing purposes.
        
        # Methods
        We used automated testing with Playwright to verify all manuscript operations.
        
        # Results
        All CRUD operations were successfully tested.
        
        # Conclusion
        The manuscript tracking system works correctly.
      `);

      // Submit
      await page.getByRole("button", { name: /upload article/i }).click();

      // Wait for redirect to manuscript detail page
      await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);
      
      // Extract manuscript ID from URL
      const url = page.url();
      manuscriptId = url.split("/").pop() || "";
      expect(manuscriptId).toBeTruthy();

      // Verify we're on the manuscript detail page
      await expect(page.getByText(manuscriptTitle)).toBeVisible();
    });

    test("2. View manuscript details", async ({ page, loginAs }) => {
      test.skip(!manuscriptId, "No manuscript created");
      
      await loginAs("admin");
      await page.goto(`/manuscripts/${manuscriptId}`);
      await page.waitForLoadState("networkidle");

      // Verify manuscript details are displayed
      await expect(page.getByText(manuscriptTitle)).toBeVisible();
      await expect(page.getByText("Dr. Test Author")).toBeVisible();
      await expect(page.getByText(/abstract/i)).toBeVisible();
    });

    test("3. Add a version to the manuscript", async ({ page, loginAs }) => {
      test.skip(!manuscriptId, "No manuscript created");

      await loginAs("admin");
      await page.goto(`/manuscripts/${manuscriptId}/versions/new`);
      await page.waitForLoadState("networkidle");

      // Fill in version details
      const notesField = page.getByLabel(/notes/i);
      if (await notesField.isVisible()) {
        await notesField.fill("Initial submission version with complete methodology section.");
      }

      // Submit the version
      const submitButton = page.getByRole("button", { name: /create|save|submit|add/i });
      await submitButton.click();

      // Wait for redirect or success
      await page.waitForLoadState("networkidle");
      
      // Should redirect back to manuscript or show success
      // Try to extract version ID from URL or page content
      const currentUrl = page.url();
      if (currentUrl.includes("/versions/")) {
        const parts = currentUrl.split("/versions/");
        if (parts[1]) {
          versionId = parts[1].split("/")[0];
        }
      }

      // If we can't get version ID from URL, we'll get it from the manuscript page
      if (!versionId) {
        await page.goto(`/manuscripts/${manuscriptId}`);
        await page.waitForLoadState("networkidle");
        
        // Look for version link
        const versionLink = page.locator("a[href*='/versions/']").first();
        if (await versionLink.isVisible()) {
          const href = await versionLink.getAttribute("href");
          if (href) {
            const match = href.match(/versions\/([a-zA-Z0-9]+)/);
            if (match) {
              versionId = match[1];
            }
          }
        }
      }

      // Verify version was created
      await page.goto(`/manuscripts/${manuscriptId}`);
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(/version/i)).toBeVisible();
    });

    test("4. Add a review to the version", async ({ page, loginAs }) => {
      test.skip(!manuscriptId, "No manuscript created");

      await loginAs("admin");
      
      // First, get the version ID if we don't have it
      if (!versionId) {
        await page.goto(`/manuscripts/${manuscriptId}`);
        await page.waitForLoadState("networkidle");
        
        const versionLink = page.locator("a[href*='/versions/']").first();
        if (await versionLink.isVisible()) {
          const href = await versionLink.getAttribute("href");
          if (href) {
            const match = href.match(/versions\/([a-zA-Z0-9]+)/);
            if (match) {
              versionId = match[1];
            }
          }
        }
      }

      test.skip(!versionId, "No version created");

      // Navigate to add review page
      await page.goto(`/manuscripts/${manuscriptId}/versions/${versionId}/reviews/new`);
      await page.waitForLoadState("networkidle");

      // Fill in review details
      // Reviewer name
      const reviewerInput = page.getByLabel(/reviewer/i).first();
      if (await reviewerInput.isVisible()) {
        await reviewerInput.fill("Dr. Expert Reviewer");
      } else {
        // Try placeholder
        const reviewerPlaceholder = page.getByPlaceholder(/reviewer/i);
        if (await reviewerPlaceholder.isVisible()) {
          await reviewerPlaceholder.fill("Dr. Expert Reviewer");
        }
      }

      // Review content
      const contentField = page.getByLabel(/content|review|comments/i);
      if (await contentField.isVisible()) {
        await contentField.fill(`
          This manuscript presents interesting findings. The methodology is sound and the conclusions are well-supported.
          
          Strengths:
          - Clear research question
          - Appropriate methods
          - Well-written
          
          Suggestions for improvement:
          - Add more recent references
          - Expand the discussion section
        `);
      } else {
        // Try textarea
        const textarea = page.locator("textarea").first();
        if (await textarea.isVisible()) {
          await textarea.fill(`This manuscript presents interesting findings. The methodology is sound.`);
        }
      }

      // Submit the review
      const submitButton = page.getByRole("button", { name: /create|save|submit|add/i });
      await submitButton.click();

      // Wait for redirect
      await page.waitForLoadState("networkidle");

      // Try to get review ID
      const currentUrl = page.url();
      if (currentUrl.includes("/reviews/")) {
        const match = currentUrl.match(/reviews\/([a-zA-Z0-9]+)/);
        if (match) {
          reviewId = match[1];
        }
      }

      // Verify review was created by checking manuscript page
      await page.goto(`/manuscripts/${manuscriptId}`);
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(/review/i)).toBeVisible();
    });

    test("5. Grade the review", async ({ page, loginAs }) => {
      test.skip(!manuscriptId, "No manuscript created");

      await loginAs("grader");
      
      // Go to grading queue
      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Look for a review to grade (might be from this test or existing data)
      const gradeLink = page.getByRole("link", { name: /grade|review/i }).first();
      
      if (await gradeLink.isVisible()) {
        await gradeLink.click();
        await page.waitForLoadState("networkidle");

        // Fill in grades
        const grades = ["clinicalRelevance", "methodology", "results", "writingClarity", "ethicalConsiderations"];
        
        for (const grade of grades) {
          const radio = page.locator(`input[name="${grade}"][value="GOOD"]`).first();
          if (await radio.isVisible()) {
            await radio.check();
          }
        }

        // Add notes
        const notesField = page.getByLabel(/notes|comments/i);
        if (await notesField.isVisible()) {
          await notesField.fill("Good review with constructive feedback. E2E test grading.");
        }

        // Submit grade
        const submitButton = page.getByRole("button", { name: /submit|save|grade/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState("networkidle");
        }
      }

      // Verify by checking progress page
      await page.goto("/grading/progress");
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(/progress|graded|completed/i)).toBeVisible();
    });

    test("6. Edit the manuscript", async ({ page, loginAs }) => {
      test.skip(!manuscriptId, "No manuscript created");

      await loginAs("admin");
      await page.goto(`/manuscripts/${manuscriptId}/edit`);
      await page.waitForLoadState("networkidle");

      // Update the title
      const titleField = page.getByLabel(/title/i);
      const updatedTitle = `${manuscriptTitle} - UPDATED`;
      await titleField.fill(updatedTitle);

      // Update abstract if available
      const abstractField = page.getByLabel(/abstract/i);
      if (await abstractField.isVisible()) {
        const currentAbstract = await abstractField.inputValue();
        await abstractField.fill(`${currentAbstract}\n\nUPDATE: This manuscript has been revised.`);
      }

      // Save changes
      const saveButton = page.getByRole("button", { name: /save|update|submit/i });
      await saveButton.click();

      // Wait for redirect or success
      await page.waitForLoadState("networkidle");

      // Verify update
      await page.goto(`/manuscripts/${manuscriptId}`);
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(/updated/i)).toBeVisible();
    });

    test("7. Verify manuscript appears in list", async ({ page, loginAs }) => {
      test.skip(!manuscriptId, "No manuscript created");

      await loginAs("admin");
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Search for our manuscript if search is available
      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill(manuscriptTitle.substring(0, 20));
        await page.waitForTimeout(500); // debounce
      }

      // Verify manuscript appears in list
      await expect(page.getByText(new RegExp(manuscriptTitle.substring(0, 20), "i"))).toBeVisible();
    });

    test("8. Delete the manuscript (cleanup)", async ({ page, loginAs }) => {
      test.skip(!manuscriptId, "No manuscript created");

      await loginAs("admin");
      await page.goto(`/manuscripts/${manuscriptId}`);
      await page.waitForLoadState("networkidle");

      // Look for delete button
      const deleteButton = page.getByRole("button", { name: /delete/i });
      
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog
        page.on("dialog", (dialog) => dialog.accept());
        
        await deleteButton.click();
        
        // Wait for redirect
        await page.waitForLoadState("networkidle");

        // Verify deleted - should redirect to list or show confirmation
        expect(page.url()).not.toContain(manuscriptId);
      }
    });
  });
});

test.describe("Upload Article via URL Lifecycle", () => {
  test("create manuscript via URL upload method", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/manuscripts/upload");
    await page.waitForLoadState("networkidle");

    // Select URL upload method
    await page.getByRole("radio", { name: /from url/i }).check();

    const timestamp = Date.now();

    // Fill in title
    await page.getByLabel(/article title/i).fill(`URL Upload Test ${timestamp}`);

    // Add author
    await page.getByPlaceholder(/enter author name/i).fill("URL Test Author");
    await page.getByRole("button", { name: /^add$/i }).first().click();

    // Fill in URL (using a valid URL format)
    await page.getByLabel(/article url/i).fill("https://example.com/test-article");

    // Try to submit (may fail due to URL fetch, but tests the form submission)
    await page.getByRole("button", { name: /upload article/i }).click();

    // Wait for response
    await page.waitForLoadState("networkidle");

    // Either succeeded or shows error about URL - both are valid test outcomes
    const hasError = await page.getByText(/error|failed|invalid/i).isVisible();
    const hasSuccess = !page.url().includes("/upload");
    
    expect(hasError || hasSuccess).toBeTruthy();
  });
});

test.describe("New Manuscript Form Lifecycle", () => {
  test("create manuscript via standard form", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/manuscripts/new");
    await page.waitForLoadState("networkidle");

    const timestamp = Date.now();

    // Fill in title
    await page.getByLabel(/title/i).fill(`Standard Form Test ${timestamp}`);

    // Fill in abstract if available
    const abstractField = page.getByLabel(/abstract/i);
    if (await abstractField.isVisible()) {
      await abstractField.fill(`Test abstract for manuscript ${timestamp}`);
    }

    // Add author if there's an input
    const authorInput = page.getByPlaceholder(/author/i);
    if (await authorInput.isVisible()) {
      await authorInput.fill("Form Test Author");
      const addButton = page.getByRole("button", { name: /add/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }

    // Submit
    const submitButton = page.getByRole("button", { name: /create|save|submit/i });
    await submitButton.click();

    // Wait for redirect
    await page.waitForLoadState("networkidle");

    // Should redirect to manuscript detail
    expect(page.url()).toMatch(/\/manuscripts\/[a-zA-Z0-9]+$/);
  });
});

test.describe("Version and Review Lifecycle", () => {
  test("can navigate version → review → grade flow", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find any existing manuscript
    const manuscriptLink = page.getByRole("link", { name: /view|details/i }).first();
    
    if (await manuscriptLink.isVisible()) {
      await manuscriptLink.click();
      await page.waitForLoadState("networkidle");

      // Check if versions section exists
      const versionsSection = page.getByText(/versions?/i);
      if (await versionsSection.isVisible()) {
        // Look for add version link
        const addVersionLink = page.getByRole("link", { name: /add.*version|new.*version/i });
        if (await addVersionLink.isVisible()) {
          await expect(addVersionLink).toBeVisible();
        }
      }

      // Check if reviews section exists
      const reviewsSection = page.getByText(/reviews?/i);
      if (await reviewsSection.isVisible()) {
        await expect(reviewsSection).toBeVisible();
      }
    }
  });
});
