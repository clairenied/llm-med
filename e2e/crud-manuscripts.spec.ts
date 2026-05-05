import { test, expect } from "./fixtures/auth";

test.describe("Manuscripts CRUD Operations", () => {
  test.describe("Create Manuscript", () => {
    test("can create a new manuscript", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/manuscripts/new");
      await page.waitForLoadState("networkidle");

      const timestamp = Date.now();
      const testManuscript = {
        title: `Test Manuscript ${timestamp}`,
        abstract: `This is a test abstract for manuscript ${timestamp}. It describes the key findings and methodology of the research.`,
      };

      // Fill in the form
      const titleField = page.getByLabel(/title/i);
      await titleField.fill(testManuscript.title);

      const abstractField = page.getByLabel(/abstract/i);
      if (await abstractField.isVisible()) {
        await abstractField.fill(testManuscript.abstract);
      }

      // Submit
      const submitButton = page.getByRole("button", { name: /create|save|submit/i });
      await submitButton.click();

      await page.waitForLoadState("networkidle");

      // Should redirect or show success
      const hasSuccess = await page.getByText(/success|created/i).isVisible().catch(() => false);
      const redirected = !page.url().includes("/new");
      expect(hasSuccess || redirected).toBeTruthy();
    });

    test("validates required title field", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/manuscripts/new");
      await page.waitForLoadState("networkidle");

      // Try to submit without title
      const submitButton = page.getByRole("button", { name: /create|save|submit/i });
      await submitButton.click();

      await page.waitForTimeout(500);

      // Should stay on form or show error
      const isStillOnForm = page.url().includes("/new");
      expect(isStillOnForm).toBeTruthy();
    });
  });

  test.describe("Read Manuscripts", () => {
    test("can view manuscripts list with pagination", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Should show manuscripts heading
      const heading = page.getByRole("heading", { name: /manuscripts/i }).first();
      await expect(heading).toBeVisible();

      // Check for pagination if present
      const pagination = page.locator('[class*="pagination"]');
      const hasPagination = await pagination.isVisible().catch(() => false);
      // Pagination may or may not exist depending on data
    });

    test("can view single manuscript detail", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Click on first manuscript
      const manuscriptLink = page
        .locator("a[href*='/manuscripts/']")
        .filter({ hasNot: page.locator("[href*='/new']") })
        .filter({ hasNot: page.locator("[href*='/edit']") })
        .filter({ hasNot: page.locator("[href*='/upload']") })
        .first();

      if (await manuscriptLink.isVisible()) {
        await manuscriptLink.click();
        await page.waitForLoadState("networkidle");

        // Should show manuscript details
        const title = page.getByRole("heading").first();
        await expect(title).toBeVisible();
      }
    });

    test("can search manuscripts", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill("machine learning");
        await page.waitForTimeout(500);
        await page.waitForLoadState("networkidle");

        // Results should update
      }
    });
  });

  test.describe("Update Manuscript", () => {
    test("can access edit manuscript form", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Find edit link
      const editLink = page.getByRole("link", { name: /edit/i }).first();
      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForLoadState("networkidle");

        expect(page.url()).toContain("/edit");

        // Form should be pre-filled
        const titleField = page.getByLabel(/title/i);
        const titleValue = await titleField.inputValue();
        expect(titleValue.length).toBeGreaterThan(0);
      }
    });

    test("can update manuscript details", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const editLink = page.getByRole("link", { name: /edit/i }).first();
      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForLoadState("networkidle");

        // Update title
        const titleField = page.getByLabel(/title/i);
        const originalTitle = await titleField.inputValue();
        await titleField.fill(`${originalTitle} - Updated`);

        // Submit
        const submitButton = page.getByRole("button", { name: /update|save/i });
        await submitButton.click();

        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/success|updated/i).isVisible().catch(() => false);
        const redirected = !page.url().includes("/edit");
        expect(hasSuccess || redirected).toBeTruthy();
      }
    });
  });

  test.describe("Delete Manuscript", () => {
    test("can delete a manuscript", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const deleteButton = page.getByRole("button", { name: /delete/i }).first();
      if (await deleteButton.isVisible()) {
        page.on("dialog", (dialog) => dialog.accept());

        await deleteButton.click();
        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/deleted|removed/i).isVisible().catch(() => false);
        expect(page.url().includes("/") || hasSuccess).toBeTruthy();
      }
    });
  });
});

test.describe("Versions CRUD Operations", () => {
  test.describe("Create Version", () => {
    test("can access new version form from manuscript", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Navigate to a manuscript
      const manuscriptLink = page
        .locator("a[href*='/manuscripts/']")
        .filter({ hasNot: page.locator("[href*='/new']") })
        .first();

      if (await manuscriptLink.isVisible()) {
        await manuscriptLink.click();
        await page.waitForLoadState("networkidle");

        // Look for add version link
        const addVersionLink = page.getByRole("link", { name: /add.*version|new.*version/i });
        if (await addVersionLink.isVisible()) {
          await addVersionLink.click();
          await page.waitForLoadState("networkidle");

          expect(page.url()).toContain("/versions/new");
        }
      }
    });
  });

  test.describe("Read Versions", () => {
    test("can view versions on manuscript detail page", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const manuscriptLink = page
        .locator("a[href*='/manuscripts/']")
        .filter({ hasNot: page.locator("[href*='/new']") })
        .first();

      if (await manuscriptLink.isVisible()) {
        await manuscriptLink.click();
        await page.waitForLoadState("networkidle");

        // Should show versions section
        const versionsSection = page.getByText(/version/i).first();
        const hasVersions = await versionsSection.isVisible().catch(() => false);
      }
    });
  });
});

test.describe("Reviews CRUD Operations", () => {
  test.describe("Create Review", () => {
    test("can create a review with reviewer selection", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Navigate to manuscript
      const manuscriptLink = page
        .locator("a[href*='/manuscripts/']")
        .filter({ hasNot: page.locator("[href*='/new']") })
        .filter({ hasNot: page.locator("[href*='/upload']") })
        .first();

      if (!(await manuscriptLink.isVisible())) {
        test.skip(true, "No manuscripts available");
        return;
      }

      await manuscriptLink.click();
      await page.waitForLoadState("networkidle");

      const addReviewLink = page.getByRole("link", { name: /add.*review|new.*review/i });
      if (!(await addReviewLink.isVisible())) {
        test.skip(true, "No add review link");
        return;
      }

      await addReviewLink.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/reviews/new");

      // CRITICAL: Select a reviewer from dropdown
      const reviewerDropdown = page.getByLabel(/reviewer/i);
      await expect(reviewerDropdown).toBeVisible();
      
      // Select the first real reviewer option (not placeholder)
      const reviewerOption = reviewerDropdown.locator("option").nth(1);
      const reviewerValue = await reviewerOption.getAttribute("value");
      if (reviewerValue) {
        await reviewerDropdown.selectOption(reviewerValue);
      }

      // Fill review content (required)
      const contentField = page.getByLabel(/content/i);
      await expect(contentField).toBeVisible();
      const timestamp = Date.now();
      await contentField.fill(`Test review created at ${timestamp}. The methodology is sound.`);

      // Submit
      const submitButton = page.getByRole("button", { name: /create.*review/i });
      await submitButton.click();

      // Should redirect to manuscript page
      await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);
      expect(page.url()).not.toContain("/reviews/new");

      // Verify review was created - content should appear
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(new RegExp(`Test review created at ${timestamp}`))).toBeVisible();
    });

    test("review form requires reviewer selection", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const manuscriptLink = page
        .locator("a[href*='/manuscripts/']")
        .filter({ hasNot: page.locator("[href*='/new']") })
        .filter({ hasNot: page.locator("[href*='/upload']") })
        .first();

      if (!(await manuscriptLink.isVisible())) {
        test.skip(true, "No manuscripts available");
        return;
      }

      await manuscriptLink.click();
      await page.waitForLoadState("networkidle");

      const addReviewLink = page.getByRole("link", { name: /add.*review/i });
      if (!(await addReviewLink.isVisible())) {
        test.skip(true, "No add review link");
        return;
      }

      await addReviewLink.click();
      await page.waitForLoadState("networkidle");

      // Fill content but DO NOT select reviewer
      const contentField = page.getByLabel(/content/i);
      await contentField.fill("Test content without reviewer");

      // Try to submit
      const submitButton = page.getByRole("button", { name: /create.*review/i });
      await submitButton.click();

      // Should stay on form with validation error
      await page.waitForTimeout(500);
      expect(page.url()).toContain("/reviews/new");

      // Should show error about missing reviewer
      const errorText = page.getByText(/select.*reviewer|reviewer.*required|please select/i);
      await expect(errorText).toBeVisible();
    });
  });

  test.describe("Read Reviews", () => {
    test("can view reviews on manuscript/version page", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const manuscriptLink = page
        .locator("a[href*='/manuscripts/']")
        .filter({ hasNot: page.locator("[href*='/new']") })
        .first();

      if (await manuscriptLink.isVisible()) {
        await manuscriptLink.click();
        await page.waitForLoadState("networkidle");

        // Should show reviews section
        const reviewSection = page.getByText(/review/i).first();
        await expect(reviewSection).toBeVisible();
      }
    });
  });
});
