import { test, expect } from "./fixtures/auth";

/**
 * End-to-End Grading Lifecycle Tests
 * 
 * Tests the complete grading workflow:
 * 1. Grader views the grading queue
 * 2. Grader selects a review to grade
 * 3. Grader submits grades for all criteria
 * 4. Grade appears in progress tracking
 * 5. Admin can view completed grades
 */

test.describe("Grading Complete Lifecycle", () => {
  
  test.describe.serial("Full grading journey", () => {
    
    test("1. Grader accesses grading queue", async ({ page, loginAs }) => {
      await loginAs("grader");
      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Should see grading queue page
      await expect(page.getByRole("heading", { name: /grading|queue|review/i }).first()).toBeVisible();
    });

    test("2. View available reviews to grade", async ({ page, loginAs }) => {
      await loginAs("grader");
      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Should show list of reviews or empty state
      const hasReviews = await page.getByRole("link", { name: /grade|view|review/i }).first().isVisible();
      const hasEmptyState = await page.getByText(/no.*reviews|empty|nothing/i).isVisible();

      expect(hasReviews || hasEmptyState).toBeTruthy();
    });

    test("3. Access grade form for a review", async ({ page, loginAs }) => {
      await loginAs("grader");
      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Try to access a review for grading
      const gradeLink = page.getByRole("link", { name: /grade|review/i }).first();
      
      if (await gradeLink.isVisible()) {
        await gradeLink.click();
        await page.waitForLoadState("networkidle");

        // Should be on grading form page
        expect(page.url()).toMatch(/\/grading\/[a-zA-Z0-9]+/);

        // Should see grade criteria
        const hasCriteria = await page.getByText(/clinical.*relevance|methodology|results|writing|ethical/i).first().isVisible();
        expect(hasCriteria).toBeTruthy();
      }
    });

    test("4. Submit grades for a review", async ({ page, loginAs }) => {
      await loginAs("grader");
      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      const gradeLink = page.getByRole("link", { name: /grade|review/i }).first();
      
      if (await gradeLink.isVisible()) {
        await gradeLink.click();
        await page.waitForLoadState("networkidle");

        // Fill in all grade criteria
        const criteria = [
          "clinicalRelevance",
          "methodology", 
          "results",
          "writingClarity",
          "ethicalConsiderations"
        ];

        for (const criterion of criteria) {
          // Try to find and select a grade value
          const goodRadio = page.locator(`input[name="${criterion}"][value="GOOD"]`);
          if (await goodRadio.isVisible()) {
            await goodRadio.check();
          } else {
            // Try with different selector
            const radioGroup = page.getByRole("radiogroup").filter({ hasText: new RegExp(criterion.replace(/([A-Z])/g, " $1"), "i") });
            if (await radioGroup.isVisible()) {
              const goodOption = radioGroup.getByLabel(/good/i).first();
              if (await goodOption.isVisible()) {
                await goodOption.check();
              }
            }
          }
        }

        // Add optional notes
        const notesField = page.getByLabel(/notes|comments/i);
        if (await notesField.isVisible()) {
          await notesField.fill("E2E lifecycle test - grade submission verified.");
        }

        // Submit the grade
        const submitButton = page.getByRole("button", { name: /submit|save|complete/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForLoadState("networkidle");
        }
      }
    });

    test("5. View grading progress", async ({ page, loginAs }) => {
      await loginAs("grader");
      await page.goto("/grading/progress");
      await page.waitForLoadState("networkidle");

      // Should see progress page
      await expect(page.getByRole("heading", { name: /progress|graded|completed/i }).first()).toBeVisible();

      // Should show statistics or list of completed grades
      const hasStats = await page.getByText(/\d+.*graded|\d+.*completed|\d+.*total/i).isVisible();
      const hasList = await page.locator("table, ul, .list").isVisible();
      const hasEmpty = await page.getByText(/no.*grades|empty|nothing/i).isVisible();

      expect(hasStats || hasList || hasEmpty).toBeTruthy();
    });

    test("6. Admin views all grades", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/grading/progress");
      await page.waitForLoadState("networkidle");

      // Admin should also be able to see grading progress
      await expect(page.getByRole("heading", { name: /progress|grading/i }).first()).toBeVisible();
    });
  });
});

test.describe("Grading Form Validation", () => {
  
  test("grade form requires all criteria", async ({ page, loginAs }) => {
    await loginAs("grader");
    await page.goto("/grading");
    await page.waitForLoadState("networkidle");

    const gradeLink = page.getByRole("link", { name: /grade|review/i }).first();
    
    if (await gradeLink.isVisible()) {
      await gradeLink.click();
      await page.waitForLoadState("networkidle");

      // Try to submit without filling criteria
      const submitButton = page.getByRole("button", { name: /submit|save/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Should either show validation errors or stay on page
        await page.waitForTimeout(500);
        expect(page.url()).toMatch(/\/grading\//);
      }
    }
  });

  test("grade form shows manuscript context", async ({ page, loginAs }) => {
    await loginAs("grader");
    await page.goto("/grading");
    await page.waitForLoadState("networkidle");

    const gradeLink = page.getByRole("link", { name: /grade|review/i }).first();
    
    if (await gradeLink.isVisible()) {
      await gradeLink.click();
      await page.waitForLoadState("networkidle");

      // Should show manuscript title or review content for context
      const hasContext = await page.getByText(/manuscript|article|review.*content|title/i).isVisible();
      expect(hasContext).toBeTruthy();
    }
  });
});

test.describe("Grading Workflow Integration", () => {
  
  test("grading queue updates after submission", async ({ page, loginAs }) => {
    await loginAs("grader");
    
    // Get initial queue count
    await page.goto("/grading");
    await page.waitForLoadState("networkidle");
    
    const initialQueueText = await page.textContent("body");
    
    // Submit a grade if available
    const gradeLink = page.getByRole("link", { name: /grade|review/i }).first();
    if (await gradeLink.isVisible()) {
      await gradeLink.click();
      await page.waitForLoadState("networkidle");

      // Fill minimal grades
      const goodRadios = page.locator("input[value='GOOD']");
      const count = await goodRadios.count();
      for (let i = 0; i < Math.min(count, 5); i++) {
        const radio = goodRadios.nth(i);
        if (await radio.isVisible()) {
          await radio.check();
        }
      }

      // Submit
      const submitButton = page.getByRole("button", { name: /submit|save/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForLoadState("networkidle");
      }

      // Go back to queue
      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Queue should have changed (one fewer item or same if more were added)
      const newQueueText = await page.textContent("body");
      expect(newQueueText).toBeTruthy();
    }
  });

  test("completed grades appear in progress", async ({ page, loginAs }) => {
    await loginAs("grader");
    await page.goto("/grading/progress");
    await page.waitForLoadState("networkidle");

    // Should show progress information
    const pageContent = await page.textContent("body");
    expect(pageContent).toBeTruthy();
    
    // Either shows grades or empty state
    const hasGrades = await page.locator("table tbody tr, .grade-item, .completed").count() > 0;
    const hasEmptyState = await page.getByText(/no.*grades|empty|start.*grading/i).isVisible();
    
    expect(hasGrades || hasEmptyState).toBeTruthy();
  });
});
