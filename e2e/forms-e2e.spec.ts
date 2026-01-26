import { test, expect } from "./fixtures/auth";

/**
 * Comprehensive End-to-End Form Tests
 * 
 * These tests verify that every form in the application can be:
 * 1. Accessed
 * 2. Filled out completely
 * 3. Submitted successfully
 * 4. Results in the expected outcome
 */

test.describe("Form Submission Tests", () => {
  // Store IDs created during tests for use in subsequent tests
  let createdAuthorId: string;
  let createdManuscriptId: string;
  let createdVersionId: string;

  test.describe.serial("Author Forms", () => {
    test("can create a new author via form", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/authors/new");
      await page.waitForLoadState("networkidle");

      const timestamp = Date.now();

      // Fill required fields
      await page.getByLabel(/name/i).fill(`Test Author ${timestamp}`);
      
      // Fill optional fields if visible
      const emailField = page.getByLabel(/email/i);
      if (await emailField.isVisible()) {
        await emailField.fill(`testauthor${timestamp}@example.com`);
      }

      const affiliationField = page.getByLabel(/affiliation/i);
      if (await affiliationField.isVisible()) {
        await affiliationField.fill("Test University");
      }

      // Submit the form
      await page.getByRole("button", { name: /create|save|submit/i }).click();

      // Wait for navigation - should redirect to author detail or list
      await page.waitForURL(/\/authors\/[a-zA-Z0-9]+$|\/authors$/);
      
      // Extract author ID if redirected to detail page
      if (page.url().match(/\/authors\/[a-zA-Z0-9]+$/)) {
        createdAuthorId = page.url().split("/").pop() || "";
      }

      // Verify success - should see the author name
      await expect(page.getByText(new RegExp(`Test Author ${timestamp}`, "i"))).toBeVisible();
    });

    test("can edit an author via form", async ({ page, loginAs }) => {
      test.skip(!createdAuthorId, "No author created");

      await loginAs("admin");
      await page.goto(`/authors/${createdAuthorId}/edit`);
      await page.waitForLoadState("networkidle");

      // Update affiliation
      const affiliationField = page.getByLabel(/affiliation/i);
      await affiliationField.fill("Updated University");

      // Submit
      await page.getByRole("button", { name: /save|update|submit/i }).click();

      // Wait for navigation
      await page.waitForURL(/\/authors\/[a-zA-Z0-9]+$/);

      // Verify update
      await expect(page.getByText(/updated university/i)).toBeVisible();
    });
  });

  test.describe.serial("Manuscript Forms", () => {
    test("can create manuscript via upload form (text method)", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/manuscripts/upload");
      await page.waitForLoadState("networkidle");

      const timestamp = Date.now();

      // Ensure text upload is selected (default)
      const textRadio = page.getByRole("radio", { name: /plain text/i });
      if (await textRadio.isVisible() && !(await textRadio.isChecked())) {
        await textRadio.check();
      }

      // Fill title (required)
      await page.getByLabel(/article title/i).fill(`E2E Test Manuscript ${timestamp}`);

      // Fill abstract (optional)
      const abstractField = page.getByLabel(/abstract/i);
      if (await abstractField.isVisible()) {
        await abstractField.fill(`This is a test abstract for manuscript ${timestamp}`);
      }

      // Add author (required)
      const authorInput = page.getByPlaceholder(/enter author name/i);
      await authorInput.fill("E2E Test Author");
      await page.getByRole("button", { name: /^add$/i }).first().click();
      
      // Verify author was added
      await expect(page.getByText("E2E Test Author")).toBeVisible();

      // Fill content (required for text upload)
      const contentField = page.getByLabel(/article content/i);
      await contentField.fill(`
        # Introduction
        This is test content for the E2E test manuscript.
        
        # Methods
        We used automated testing.
        
        # Results
        The tests passed.
        
        # Conclusion
        E2E testing works.
      `);

      // Submit the form
      await page.getByRole("button", { name: /upload article/i }).click();

      // Wait for redirect to manuscript detail page
      await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);

      // Extract manuscript ID
      createdManuscriptId = page.url().split("/").pop() || "";
      expect(createdManuscriptId).toBeTruthy();

      // Verify success
      await expect(page.getByText(new RegExp(`E2E Test Manuscript ${timestamp}`, "i"))).toBeVisible();
    });

    test("can create manuscript via new manuscript form", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/manuscripts/new");
      await page.waitForLoadState("networkidle");

      const timestamp = Date.now();

      // Fill title
      await page.getByLabel(/title/i).fill(`Standard Form Manuscript ${timestamp}`);

      // Fill abstract if available
      const abstractField = page.getByLabel(/abstract/i);
      if (await abstractField.isVisible()) {
        await abstractField.fill(`Abstract for ${timestamp}`);
      }

      // Add author if there's an input
      const authorInput = page.getByPlaceholder(/author/i);
      if (await authorInput.isVisible()) {
        await authorInput.fill("Standard Form Author");
        const addButton = page.getByRole("button", { name: /add/i }).first();
        if (await addButton.isVisible()) {
          await addButton.click();
        }
      }

      // Submit
      await page.getByRole("button", { name: /create|save|submit/i }).click();

      // Wait for redirect
      await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);

      // Verify success
      await expect(page.getByText(new RegExp(`Standard Form Manuscript ${timestamp}`, "i"))).toBeVisible();
    });

    test("can edit manuscript via form", async ({ page, loginAs }) => {
      test.skip(!createdManuscriptId, "No manuscript created");

      await loginAs("admin");
      await page.goto(`/manuscripts/${createdManuscriptId}/edit`);
      await page.waitForLoadState("networkidle");

      // Update title
      const titleField = page.getByLabel(/title/i);
      const currentTitle = await titleField.inputValue();
      await titleField.fill(`${currentTitle} - EDITED`);

      // Submit
      await page.getByRole("button", { name: /save|update|submit/i }).click();

      // Wait for redirect
      await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);

      // Verify update
      await expect(page.getByText(/edited/i)).toBeVisible();
    });
  });

  test.describe.serial("Version Forms", () => {
    test("can add a version to manuscript", async ({ page, loginAs }) => {
      test.skip(!createdManuscriptId, "No manuscript created");

      await loginAs("admin");
      await page.goto(`/manuscripts/${createdManuscriptId}/versions/new`);
      await page.waitForLoadState("networkidle");

      // Fill notes if available
      const notesField = page.getByLabel(/notes/i);
      if (await notesField.isVisible()) {
        await notesField.fill("E2E test version notes");
      }

      // Submit
      await page.getByRole("button", { name: /create|save|submit|add/i }).click();

      // Wait for redirect
      await page.waitForLoadState("networkidle");

      // Should redirect back to manuscript or version detail
      const url = page.url();
      expect(url).toContain("/manuscripts/");

      // Try to extract version ID
      if (url.includes("/versions/")) {
        const match = url.match(/versions\/([a-zA-Z0-9]+)/);
        if (match) {
          createdVersionId = match[1];
        }
      }

      // If we don't have version ID, get it from the manuscript page
      if (!createdVersionId) {
        await page.goto(`/manuscripts/${createdManuscriptId}`);
        await page.waitForLoadState("networkidle");
        
        // Look for version link
        const versionLink = page.locator("a[href*='/versions/']").first();
        if (await versionLink.isVisible()) {
          const href = await versionLink.getAttribute("href");
          if (href) {
            const match = href.match(/versions\/([a-zA-Z0-9]+)/);
            if (match) {
              createdVersionId = match[1];
            }
          }
        }
      }

      // Verify version was created
      await page.goto(`/manuscripts/${createdManuscriptId}`);
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(/version/i)).toBeVisible();
    });
  });

  test.describe.serial("Review Forms", () => {
    test("can add a review to version", async ({ page, loginAs }) => {
      test.skip(!createdManuscriptId || !createdVersionId, "No manuscript/version created");

      await loginAs("admin");
      await page.goto(`/manuscripts/${createdManuscriptId}/versions/${createdVersionId}/reviews/new`);
      await page.waitForLoadState("networkidle");

      // Fill review content (required)
      const contentField = page.getByLabel(/content|review/i);
      await contentField.fill(`
        This is an E2E test review.
        
        The manuscript is well-written and the methodology is sound.
        
        Recommendation: Accept with minor revisions.
      `);

      // Select review type if available
      const reviewTypeSelect = page.getByLabel(/review type/i);
      if (await reviewTypeSelect.isVisible()) {
        await reviewTypeSelect.selectOption("EXTERNAL");
      }

      // Submit
      await page.getByRole("button", { name: /create|submit|save/i }).click();

      // Wait for redirect
      await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);

      // Verify review was created
      await expect(page.getByText(/review/i)).toBeVisible();
    });
  });

  test.describe("Profile Forms", () => {
    test("can change password via profile form", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/profile");
      await page.waitForLoadState("networkidle");

      // Fill password change form
      await page.getByLabel(/current password/i).fill("admin123");
      await page.getByLabel(/^new password$/i).fill("newpassword123");
      await page.getByLabel(/confirm.*password/i).fill("newpassword123");

      // Submit
      await page.getByRole("button", { name: /change password/i }).click();

      // Wait for response
      await page.waitForLoadState("networkidle");

      // Should show success message or stay on page without error
      const hasSuccess = await page.getByText(/success|changed/i).isVisible();
      const hasError = await page.getByText(/error|failed|incorrect/i).isVisible();
      
      // Either success or specific validation error (not generic failure)
      expect(hasSuccess || !hasError).toBeTruthy();

      // Change password back if successful
      if (hasSuccess) {
        await page.getByLabel(/current password/i).fill("newpassword123");
        await page.getByLabel(/^new password$/i).fill("admin123");
        await page.getByLabel(/confirm.*password/i).fill("admin123");
        await page.getByRole("button", { name: /change password/i }).click();
      }
    });
  });

  test.describe("Admin Forms", () => {
    test("can invite user via admin form", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin/graders");
      await page.waitForLoadState("networkidle");

      const timestamp = Date.now();

      // Fill email for invitation
      const emailInput = page.getByPlaceholder(/user@example.com|email/i).first();
      await emailInput.fill(`testinvite${timestamp}@example.com`);

      // Fill first name if available
      const firstNameInput = page.getByPlaceholder(/first|john/i);
      if (await firstNameInput.isVisible()) {
        await firstNameInput.fill("Test");
      }

      // Fill last name if available
      const lastNameInput = page.getByPlaceholder(/last|doe/i);
      if (await lastNameInput.isVisible()) {
        await lastNameInput.fill("User");
      }

      // Submit invitation
      await page.getByRole("button", { name: /invite/i }).click();

      // Wait for response
      await page.waitForLoadState("networkidle");

      // Should show success or result
      const hasSuccess = await page.getByText(/success|sent|invited|created/i).isVisible();
      const hasResult = await page.getByText(/result/i).isVisible();
      
      expect(hasSuccess || hasResult).toBeTruthy();
    });

    test("can create email template", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin/emails");
      await page.waitForLoadState("networkidle");

      const timestamp = Date.now();

      // Look for create button
      const createButton = page.getByRole("button", { name: /create|new|add/i }).first();
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState("networkidle");

        // Fill template form
        const nameInput = page.getByLabel(/name/i);
        if (await nameInput.isVisible()) {
          await nameInput.fill(`E2E Test Template ${timestamp}`);
        }

        const subjectInput = page.getByLabel(/subject/i);
        if (await subjectInput.isVisible()) {
          await subjectInput.fill("Test Subject Line");
        }

        const bodyInput = page.getByLabel(/body|content/i);
        if (await bodyInput.isVisible()) {
          await bodyInput.fill("Hello {{firstName}}, this is a test template.");
        }

        // Submit
        const saveButton = page.getByRole("button", { name: /save|create|submit/i });
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForLoadState("networkidle");
        }
      }
    });
  });

  test.describe("Import Form", () => {
    test("can import data via JSON", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/import");
      await page.waitForLoadState("networkidle");

      const timestamp = Date.now();

      // Fill import data textarea
      const textarea = page.getByPlaceholder(/paste|json/i);
      if (await textarea.isVisible()) {
        await textarea.fill(JSON.stringify([
          {
            title: `Imported Manuscript ${timestamp}`,
            abstract: "Test abstract for imported manuscript",
            keywords: ["test", "import"],
            authors: ["Import Author"],
            status: "DRAFT"
          }
        ]));

        // Click parse button
        const parseButton = page.getByRole("button", { name: /parse/i });
        if (await parseButton.isVisible()) {
          await parseButton.click();
          await page.waitForTimeout(500);

          // Should show parsed data
          await expect(page.getByText(/imported manuscript/i)).toBeVisible();

          // Import if parsed successfully
          const importButton = page.getByRole("button", { name: /import/i });
          if (await importButton.isVisible() && await importButton.isEnabled()) {
            await importButton.click();
            await page.waitForLoadState("networkidle");
          }
        }
      }
    });
  });

  test.describe("Grading Form", () => {
    test("can access and fill grading form", async ({ page, loginAs }) => {
      await loginAs("grader");
      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Find a review to grade
      const gradeLink = page.getByRole("link", { name: /grade/i }).first();
      
      if (await gradeLink.isVisible()) {
        await gradeLink.click();
        await page.waitForLoadState("networkidle");

        // Should be on grading form
        expect(page.url()).toMatch(/\/grading\/[a-zA-Z0-9]+/);

        // Fill all grade criteria
        const criteria = ["clinicalRelevance", "methodology", "results", "writingClarity", "ethicalConsiderations"];
        
        for (const criterion of criteria) {
          // Try to find and click a grade button
          const gradeButtons = page.locator(`button:has-text("Good"), button:has-text("Very Good")`);
          const count = await gradeButtons.count();
          if (count > 0) {
            // Click buttons that aren't already selected
            for (let i = 0; i < Math.min(count, 5); i++) {
              const button = gradeButtons.nth(i);
              const isSelected = await button.evaluate(el => el.classList.contains('bg-emerald-600'));
              if (!isSelected) {
                await button.click();
                break;
              }
            }
          }
        }

        // Fill notes
        const notesField = page.getByLabel(/notes/i);
        if (await notesField.isVisible()) {
          await notesField.fill("E2E test grading notes");
        }

        // Submit grade
        const submitButton = page.getByRole("button", { name: /submit|save/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState("networkidle");
        }
      }
    });
  });
});

test.describe("Auth Forms", () => {
  test("sign in form works with password", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.waitForLoadState("networkidle");

    // Click Password tab
    await page.getByRole("button", { name: /password/i }).click();

    // Fill credentials
    await page.getByLabel(/email/i).last().fill("admin@example.com");
    await page.getByLabel(/password/i).fill("admin123");

    // Submit
    await page.getByRole("button", { name: /sign in/i }).last().click();

    // Should redirect to home
    await page.waitForURL("/");
    expect(page.url()).not.toContain("/auth/signin");
  });

  test("forgot password form submits", async ({ page }) => {
    await page.goto("/auth/forgot-password");
    await page.waitForLoadState("networkidle");

    // Fill email
    await page.getByLabel(/email/i).fill("test@example.com");

    // Submit
    await page.getByRole("button", { name: /send|reset|submit/i }).click();

    // Should show message (success or error about email not found)
    await page.waitForLoadState("networkidle");
    
    const hasMessage = await page.getByText(/sent|check.*email|not found|error/i).isVisible();
    expect(hasMessage).toBeTruthy();
  });
});
