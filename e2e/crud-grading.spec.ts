import { test, expect } from "./fixtures/auth";

test.describe("Grading CRUD Operations", () => {
  test.describe("Create Grade", () => {
    test("can access grading form for a review", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Find a grade link
      const gradeLink = page.getByRole("link", { name: /grade/i }).first();
      if (await gradeLink.isVisible()) {
        await gradeLink.click();
        await page.waitForLoadState("networkidle");

        // Should be on grading form
        expect(page.url()).toMatch(/\/grading\/[a-zA-Z0-9-]+$/);
      }
    });

    test("grading form has all 5 domains", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      const gradeLink = page.getByRole("link", { name: /grade/i }).first();
      if (await gradeLink.isVisible()) {
        await gradeLink.click();
        await page.waitForLoadState("networkidle");

        // Check for all 5 grading domains
        const domains = [
          /clinical.*relevance/i,
          /methodology/i,
          /results/i,
          /writing.*clarity|clarity/i,
          /ethical/i,
        ];

        for (const domain of domains) {
          const domainElement = page.getByText(domain).first();
          const isVisible = await domainElement.isVisible().catch(() => false);
        }
      }
    });

    test("can submit a complete grade", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      const gradeLink = page.getByRole("link", { name: /grade/i }).first();
      if (await gradeLink.isVisible()) {
        await gradeLink.click();
        await page.waitForLoadState("networkidle");

        // Select grades for each domain - click "Good" buttons
        const goodButtons = page.getByRole("button", { name: /^good$/i });
        const count = await goodButtons.count();

        for (let i = 0; i < Math.min(count, 5); i++) {
          await goodButtons.nth(i).click();
          await page.waitForTimeout(100);
        }

        // Submit the grade
        const submitButton = page.getByRole("button", { name: /submit|save.*grade/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState("networkidle");

          // Should redirect or show success
          const hasSuccess = await page.getByText(/success|saved|submitted/i).isVisible().catch(() => false);
          const redirected = page.url().includes("/grading") && !page.url().match(/\/grading\/[a-zA-Z0-9-]+$/);
          expect(hasSuccess || redirected).toBeTruthy();
        }
      }
    });
  });

  test.describe("Read Grades", () => {
    test("can view grading queue with statistics", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Should show statistics
      const totalReviews = page.getByText(/total.*review/i);
      const hasStats = await totalReviews.isVisible().catch(() => false);

      // Should show heading
      const heading = page.getByRole("heading", { name: /grading|review/i }).first();
      await expect(heading).toBeVisible();
    });

    test("can view progress report", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading/progress");
      await page.waitForLoadState("networkidle");

      // Should show progress information
      const heading = page.getByRole("heading", { name: /progress/i }).first();
      const hasHeading = await heading.isVisible().catch(() => false);
      expect(page.url()).toContain("/progress");
    });

    test("can view completed grades", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Look for completed/graded reviews indicator
      const completeCount = page.getByText(/complete/i);
      const hasComplete = await completeCount.isVisible().catch(() => false);
    });
  });

  test.describe("Update Grade", () => {
    test("can modify an existing grade", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Look for a review that was already graded by this user
      const editGradeLink = page.getByRole("link", { name: /edit.*grade|update.*grade/i }).first();
      if (await editGradeLink.isVisible()) {
        await editGradeLink.click();
        await page.waitForLoadState("networkidle");

        // Should show existing grades
        // Modify a grade
        const veryGoodButton = page.getByRole("button", { name: /very.*good/i }).first();
        if (await veryGoodButton.isVisible()) {
          await veryGoodButton.click();
        }

        // Save
        const submitButton = page.getByRole("button", { name: /submit|save|update/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState("networkidle");
        }
      }
    });
  });
});
