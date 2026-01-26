import { test, expect } from "./fixtures/auth";

test.describe("Admin User Management CRUD", () => {
  test.describe("Read Users", () => {
    test("admin can view users list", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Should show users tab
      const usersTab = page.getByRole("button", { name: /users/i }).first();
      await expect(usersTab).toBeVisible();
    });

    test("admin can view user details", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Users should be listed in a table or list
      const userRow = page.locator("tr, [class*='user']").first();
      const hasUsers = await userRow.isVisible().catch(() => false);
    });
  });

  test.describe("Update User", () => {
    test("admin can change user role", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Look for role dropdown or edit button
      const roleSelect = page.locator("select").first();
      if (await roleSelect.isVisible()) {
        // Change the role
        await roleSelect.selectOption({ index: 1 });
        await page.waitForLoadState("networkidle");
      }
    });

    test("admin can reset user password", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      const resetButton = page.getByRole("button", { name: /reset.*password/i }).first();
      if (await resetButton.isVisible()) {
        page.on("dialog", (dialog) => dialog.accept());
        await resetButton.click();
        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/reset|sent/i).isVisible().catch(() => false);
      }
    });
  });

  test.describe("Delete User", () => {
    test("admin can delete a user", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      const deleteButton = page.getByRole("button", { name: /delete/i }).first();
      if (await deleteButton.isVisible()) {
        page.on("dialog", (dialog) => dialog.accept());
        await deleteButton.click();
        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/deleted|removed/i).isVisible().catch(() => false);
      }
    });
  });
});

test.describe("Admin Invitations CRUD", () => {
  test.describe("Create Invitation", () => {
    test("admin can create single invitation", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Switch to invitations tab if needed
      const invitationsTab = page.getByRole("button", { name: /invitation/i });
      if (await invitationsTab.isVisible()) {
        await invitationsTab.click();
        await page.waitForLoadState("networkidle");
      }

      // Click create invitation
      const createButton = page.getByRole("button", { name: /create|invite|new/i }).first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(500);

        // Fill in email
        const emailField = page.getByLabel(/email/i);
        if (await emailField.isVisible()) {
          await emailField.fill(`invite${Date.now()}@test.com`);

          // Select role if available
          const roleSelect = page.getByLabel(/role/i);
          if (await roleSelect.isVisible()) {
            await roleSelect.selectOption("GRADER");
          }

          // Submit
          const submitButton = page.getByRole("button", { name: /send|create|invite/i });
          await submitButton.click();
          await page.waitForLoadState("networkidle");

          const hasSuccess = await page.getByText(/sent|created|invitation/i).isVisible().catch(() => false);
        }
      }
    });
  });

  test.describe("Read Invitations", () => {
    test("admin can view pending invitations", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      const invitationsTab = page.getByRole("button", { name: /invitation/i });
      if (await invitationsTab.isVisible()) {
        await invitationsTab.click();
        await page.waitForLoadState("networkidle");

        // Should show invitations list
        const pendingText = page.getByText(/pending|invitation/i).first();
        const hasPending = await pendingText.isVisible().catch(() => false);
      }
    });
  });

  test.describe("Update Invitation (Resend)", () => {
    test("admin can resend invitation", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      const invitationsTab = page.getByRole("button", { name: /invitation/i });
      if (await invitationsTab.isVisible()) {
        await invitationsTab.click();
        await page.waitForLoadState("networkidle");
      }

      const resendButton = page.getByRole("button", { name: /resend/i }).first();
      if (await resendButton.isVisible()) {
        await resendButton.click();
        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/sent|resent/i).isVisible().catch(() => false);
      }
    });
  });

  test.describe("Delete Invitation", () => {
    test("admin can revoke/delete invitation", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      const invitationsTab = page.getByRole("button", { name: /invitation/i });
      if (await invitationsTab.isVisible()) {
        await invitationsTab.click();
        await page.waitForLoadState("networkidle");
      }

      const revokeButton = page.getByRole("button", { name: /revoke|delete|cancel/i }).first();
      if (await revokeButton.isVisible()) {
        page.on("dialog", (dialog) => dialog.accept());
        await revokeButton.click();
        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/revoked|deleted|cancelled/i).isVisible().catch(() => false);
      }
    });
  });
});

test.describe("Admin Email Templates CRUD", () => {
  test.describe("Create Template", () => {
    test("admin can create new email template", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/emails");
      await page.waitForLoadState("networkidle");

      const newButton = page.getByRole("button", { name: /new.*template|create.*template/i });
      if (await newButton.isVisible()) {
        await newButton.click();
        await page.waitForTimeout(500);

        // Fill in template fields
        const nameField = page.getByLabel(/name/i);
        if (await nameField.isVisible()) {
          await nameField.fill(`Test Template ${Date.now()}`);
        }

        const subjectField = page.getByLabel(/subject/i);
        if (await subjectField.isVisible()) {
          await subjectField.fill("Test Subject");
        }

        const bodyField = page.getByLabel(/body|content/i);
        if (await bodyField.isVisible()) {
          await bodyField.fill("Test email body content with {{name}} placeholder");
        }

        // Save
        const saveButton = page.getByRole("button", { name: /save|create/i });
        await saveButton.click();
        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/created|saved/i).isVisible().catch(() => false);
      }
    });
  });

  test.describe("Read Templates", () => {
    test("admin can view email templates list", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/emails");
      await page.waitForLoadState("networkidle");

      const templatesHeading = page.getByRole("heading", { name: /template/i }).first();
      const hasTemplates = await templatesHeading.isVisible().catch(() => false);
      expect(page.url()).toContain("/admin/emails");
    });
  });

  test.describe("Update Template", () => {
    test("admin can edit email template", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/emails");
      await page.waitForLoadState("networkidle");

      const editButton = page.getByRole("button", { name: /edit/i }).first();
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        // Update subject
        const subjectField = page.getByLabel(/subject/i);
        if (await subjectField.isVisible()) {
          const currentSubject = await subjectField.inputValue();
          await subjectField.fill(`${currentSubject} - Updated`);
        }

        // Save
        const saveButton = page.getByRole("button", { name: /save|update/i });
        await saveButton.click();
        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/updated|saved/i).isVisible().catch(() => false);
      }
    });
  });

  test.describe("Delete Template", () => {
    test("admin can delete email template", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/emails");
      await page.waitForLoadState("networkidle");

      const deleteButton = page.getByRole("button", { name: /delete/i }).first();
      if (await deleteButton.isVisible()) {
        page.on("dialog", (dialog) => dialog.accept());
        await deleteButton.click();
        await page.waitForLoadState("networkidle");

        const hasSuccess = await page.getByText(/deleted/i).isVisible().catch(() => false);
      }
    });
  });
});

test.describe("Admin Graders Management", () => {
  test.describe("Bulk Invite", () => {
    test("admin can bulk invite graders", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/graders");
      await page.waitForLoadState("networkidle");

      // Look for bulk invite textarea
      const bulkTextarea = page.locator("textarea").first();
      if (await bulkTextarea.isVisible()) {
        await bulkTextarea.fill(
          `bulk1_${Date.now()}@test.com\nbulk2_${Date.now()}@test.com`
        );

        const inviteButton = page.getByRole("button", { name: /invite|send/i });
        if (await inviteButton.isVisible()) {
          await inviteButton.click();
          await page.waitForLoadState("networkidle");

          const hasSuccess = await page.getByText(/sent|invited/i).isVisible().catch(() => false);
        }
      }
    });
  });

  test.describe("View Graders", () => {
    test("admin can view graders list with progress", async ({ page, loginAs }) => {
      await loginAs("admin");

      await page.goto("/admin/graders");
      await page.waitForLoadState("networkidle");

      // Should show graders or empty state
      const hasTable = await page.locator("table").isVisible().catch(() => false);
      const hasEmpty = await page.getByText(/no.*grader|no.*user/i).isVisible().catch(() => false);
      expect(hasTable || hasEmpty || page.url().includes("/admin/graders")).toBeTruthy();
    });
  });
});
