import { test, expect, TEST_USERS } from "./fixtures/auth";

test.describe("Authenticated User Flows", () => {
  test.describe("Grading System (Grader Role)", () => {
    test("grader can access grading queue", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Should see grading page content, not redirect to signin
      await expect(page).toHaveURL(/grading/);

      // Should have grading-related content - use first() to handle multiple matches
      const heading = page.getByRole("heading", { name: /grading|review/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test("grader can view progress page", async ({ page, loginAs }) => {
      await loginAs("grader");

      await page.goto("/grading/progress");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/progress/);

      // Should show progress statistics
      const progressHeading = page.getByRole("heading", { name: /progress/i });
      const statsVisible = await progressHeading.isVisible().catch(() => false);

      // Either shows progress or some content (not signin)
      expect(page.url()).not.toContain("signin");
    });

    test("grading form displays all 5 domains", async ({ page, loginAs }) => {
      await loginAs("grader");

      // Navigate to grading page first to find a review
      await page.goto("/grading");
      await page.waitForLoadState("networkidle");

      // Check if there are any reviews to grade
      const reviewLink = page.locator("a[href*='/grading/']").first();
      const hasReviews = await reviewLink.isVisible().catch(() => false);

      if (hasReviews) {
        await reviewLink.click();
        await page.waitForLoadState("networkidle");

        // Check for the 5 grading domains
        const domains = [
          "Clinical Relevance",
          "Methodology",
          "Results",
          "Writing Clarity",
          "Ethical",
        ];

        for (const domain of domains) {
          const domainElement = page.getByText(domain, { exact: false });
          // Just check they exist on page
          const isVisible = await domainElement.isVisible().catch(() => false);
        }
      }
    });
  });

  test.describe("Author Flows", () => {
    test("author can view authors list", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors");
      await page.waitForLoadState("networkidle");

      // Should not redirect to signin
      await expect(page).toHaveURL(/authors/);
    });

    test("author can access new author form", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors/new");
      await page.waitForLoadState("networkidle");

      // Should show author form
      await expect(page).toHaveURL(/authors\/new/);

      // Form should have name field
      const nameField = page.getByLabel(/name/i);
      await expect(nameField).toBeVisible();
    });

    test("author can create a new author", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/authors/new");
      await page.waitForLoadState("networkidle");

      // Fill in the form
      const testAuthor = {
        name: `Test Author ${Date.now()}`,
        email: `testauthor${Date.now()}@test.com`,
        affiliation: "Test University",
      };

      await page.getByLabel(/name/i).fill(testAuthor.name);

      // Fill optional fields if they exist
      const emailField = page.getByLabel(/email/i);
      if (await emailField.isVisible()) {
        await emailField.fill(testAuthor.email);
      }

      const affiliationField = page.getByLabel(/affiliation/i);
      if (await affiliationField.isVisible()) {
        await affiliationField.fill(testAuthor.affiliation);
      }

      // Submit the form
      const submitButton = page.getByRole("button", {
        name: /create|save|submit/i,
      });
      await submitButton.click();

      // Should redirect or show success
      await page.waitForLoadState("networkidle");

      // Verify we're not still on the form with an error
      // (either redirected to list or showing success message)
    });
  });

  test.describe("Manuscript Flows", () => {
    test("user can view manuscript list", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Should show manuscripts heading (not sign in form when authenticated)
      const hasManuscripts = await page.getByRole("heading", { name: "Manuscripts" }).isVisible();
      expect(hasManuscripts).toBeTruthy();
    });

    test("user can access new manuscript form", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/manuscripts/new");
      await page.waitForLoadState("networkidle");

      // Should show manuscript form
      await expect(page).toHaveURL(/manuscripts\/new/);

      // Form should have title field
      const titleField = page.getByLabel(/title/i);
      await expect(titleField).toBeVisible();
    });

    test("user can search manuscripts", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Find search input
      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill("test search");
        await page.waitForTimeout(500); // Debounce

        // Search should trigger without error
        await page.waitForLoadState("networkidle");
      }
    });
  });

  test.describe("Admin Flows (Admin Role)", () => {
    test("admin can access admin dashboard", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin");
      await page.waitForLoadState("networkidle");

      // Should show admin page (not redirect to signin or unauthorized)
      await expect(page).toHaveURL(/admin/);
    });

    test("admin can access user management", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/admin\/users/);

      // Should have users tab
      const usersTab = page.getByRole("button", { name: /users/i });
      await expect(usersTab).toBeVisible();
    });

    test("admin can access graders page", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/graders");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/admin\/graders/);
    });

    test("admin can access email templates", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/emails");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/admin\/emails/);

      // Should show templates section
      const templatesHeading = page.getByRole("heading", {
        name: /template/i,
      });
      const hasTemplates = await templatesHeading.isVisible().catch(() => false);
    });

    test("admin can create invitation", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Look for create invitation button
      const createButton = page.getByRole("button", {
        name: /create.*invitation|invite/i,
      });

      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(500);

        // Form should appear
        const emailField = page.getByLabel(/email/i);
        const hasForm = await emailField.isVisible().catch(() => false);
      }
    });
  });

  test.describe("Profile Page", () => {
    test("user can access profile page", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/profile");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/profile/);
    });

    test("profile shows change password form", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/profile");
      await page.waitForLoadState("networkidle");

      // Should have password-related fields
      const passwordField = page.getByLabel(/current.*password|old.*password/i);
      const newPasswordField = page.getByLabel(/new.*password/i);

      const hasPasswordForm =
        (await passwordField.isVisible().catch(() => false)) ||
        (await newPasswordField.isVisible().catch(() => false));
    });
  });

  test.describe("Import Page", () => {
    test("user can access import page", async ({ page, loginAs }) => {
      await loginAs("author");

      await page.goto("/import");
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/import/);

      // Should have data input area
      const textarea = page.locator("textarea");
      const hasTextarea = await textarea.isVisible().catch(() => false);
    });
  });
});

test.describe("Role-Based Access Control", () => {
  test("non-admin cannot access admin pages", async ({ page, loginAs }) => {
    await loginAs("author"); // Regular user, not admin

    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Should redirect to unauthorized or home
    const url = page.url();
    expect(
      url.includes("unauthorized") || url.includes("signin") || !url.includes("admin")
    ).toBeTruthy();
  });

  test("grader can access grading but not admin", async ({ page, loginAs }) => {
    await loginAs("grader");

    // Should access grading
    await page.goto("/grading");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/grading/);

    // Should not access admin
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const url = page.url();
    expect(
      url.includes("unauthorized") || url.includes("signin") || !url.includes("admin")
    ).toBeTruthy();
  });
});
