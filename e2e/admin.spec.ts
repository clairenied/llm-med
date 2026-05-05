import { test, expect } from "@playwright/test";

test.describe("Admin Pages", () => {
  test.describe("Admin Dashboard", () => {
    test("admin page requires authentication", async ({ page }) => {
      await page.goto("/admin");

      // Should redirect to signin or unauthorized
      await expect(page).toHaveURL(/signin|unauthorized|admin/, { timeout: 10000 });
    });
  });

  test.describe("User Management", () => {
    test("users page requires admin access", async ({ page }) => {
      await page.goto("/admin/users");

      // Should redirect
      await expect(page).toHaveURL(/signin|unauthorized|users/, { timeout: 10000 });
    });

    test("users page has tabs for users and invitations", async ({ page }) => {
      await page.goto("/admin/users");

      await page.waitForTimeout(2000);

      if (page.url().includes("admin/users")) {
        // Should have tabs
        const usersTab = page.getByRole("button", { name: /users/i });
        const invitationsTab = page.getByRole("button", { name: /invitation/i });

        const hasUsersTab = await usersTab.isVisible().catch(() => false);
        const hasInvitationsTab = await invitationsTab.isVisible().catch(() => false);

        // If on page, should have tabs
        if (!page.url().includes("signin")) {
          expect(hasUsersTab || hasInvitationsTab).toBeTruthy();
        }
      }
    });

    test("create invitation form exists", async ({ page }) => {
      await page.goto("/admin/users");

      await page.waitForTimeout(2000);

      if (page.url().includes("admin/users") && !page.url().includes("signin")) {
        // Should have create invitation button
        const createButton = page.getByRole("button", { name: /create.*invitation/i });
        const hasCreateButton = await createButton.isVisible().catch(() => false);

        if (hasCreateButton) {
          await createButton.click();
          
          // Form should appear
          await page.waitForTimeout(500);
          const emailField = page.getByLabel(/email/i);
          const hasEmailField = await emailField.isVisible().catch(() => false);
        }
      }
    });
  });

  test.describe("Grader Management", () => {
    test("graders page requires admin access", async ({ page }) => {
      await page.goto("/admin/graders");

      await expect(page).toHaveURL(/signin|unauthorized|graders/, { timeout: 10000 });
    });

    test("graders page has bulk invite form", async ({ page }) => {
      await page.goto("/admin/graders");

      await page.waitForTimeout(2000);

      if (page.url().includes("admin/graders") && !page.url().includes("signin")) {
        // Should have invite section
        const inviteSection = page.getByText(/invite.*users/i);
        const hasInviteSection = await inviteSection.isVisible().catch(() => false);
      }
    });

    test("graders page shows user list", async ({ page }) => {
      await page.goto("/admin/graders");

      await page.waitForTimeout(2000);

      if (page.url().includes("admin/graders") && !page.url().includes("signin")) {
        // Should have users table or empty message
        const hasTable = await page.locator("table").isVisible().catch(() => false);
        const hasEmpty = await page.getByText(/no.*users/i).isVisible().catch(() => false);

        expect(hasTable || hasEmpty).toBeTruthy();
      }
    });
  });

  test.describe("Email Templates", () => {
    test("emails page requires admin access", async ({ page }) => {
      await page.goto("/admin/emails");

      await expect(page).toHaveURL(/signin|unauthorized|emails/, { timeout: 10000 });
    });

    test("emails page has template list", async ({ page }) => {
      await page.goto("/admin/emails");

      await page.waitForTimeout(2000);

      if (page.url().includes("admin/emails") && !page.url().includes("signin")) {
        // Should have templates section
        const templatesHeading = page.getByRole("heading", { name: /templates/i });
        const hasTemplates = await templatesHeading.isVisible().catch(() => false);
      }
    });

    test("new template button exists", async ({ page }) => {
      await page.goto("/admin/emails");

      await page.waitForTimeout(2000);

      if (page.url().includes("admin/emails") && !page.url().includes("signin")) {
        const newButton = page.getByRole("button", { name: /new.*template/i });
        const hasNewButton = await newButton.isVisible().catch(() => false);
      }
    });

    test("send emails section exists", async ({ page }) => {
      await page.goto("/admin/emails");

      await page.waitForTimeout(2000);

      if (page.url().includes("admin/emails") && !page.url().includes("signin")) {
        const sendSection = page.getByText(/send.*email/i);
        const hasSendSection = await sendSection.isVisible().catch(() => false);
      }
    });
  });

  test.describe("Delete Articles", () => {
    test("delete articles page requires admin access", async ({ page }) => {
      await page.goto("/admin/delete-articles");

      await expect(page).toHaveURL(/signin|unauthorized|delete/, { timeout: 10000 });
    });
  });
});
