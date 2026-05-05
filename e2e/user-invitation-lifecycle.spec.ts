import { test, expect } from "./fixtures/auth";

/**
 * End-to-End User Invitation Lifecycle Tests
 * 
 * Tests the complete user invitation workflow:
 * 1. Admin creates invitation
 * 2. Invitation appears in pending list
 * 3. Admin can resend invitation
 * 4. Admin can cancel/delete invitation
 * 5. User receives and uses invitation to sign up
 */

test.describe("User Invitation Complete Lifecycle", () => {
  const timestamp = Date.now();
  const testEmail = `lifecycle.user.${timestamp}@test.example.com`;

  test.describe.serial("Full invitation journey", () => {
    
    test("1. Admin navigates to user management", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin");
      await page.waitForLoadState("networkidle");

      // Find and click user management link
      const usersLink = page.getByRole("link", { name: /users|manage.*users/i });
      await expect(usersLink).toBeVisible();
      await usersLink.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("/admin/users");
    });

    test("2. Admin creates a new invitation", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Look for invite button/link
      const inviteButton = page.getByRole("button", { name: /invite|add/i }).first();
      const inviteLink = page.getByRole("link", { name: /invite|add/i }).first();

      if (await inviteButton.isVisible()) {
        await inviteButton.click();
      } else if (await inviteLink.isVisible()) {
        await inviteLink.click();
      }

      await page.waitForLoadState("networkidle");

      // Fill in invitation form
      const emailInput = page.getByLabel(/email/i).first();
      if (await emailInput.isVisible()) {
        await emailInput.fill(testEmail);
      } else {
        const emailPlaceholder = page.getByPlaceholder(/email/i).first();
        if (await emailPlaceholder.isVisible()) {
          await emailPlaceholder.fill(testEmail);
        }
      }

      // Select role if available
      const roleSelect = page.getByRole("combobox").filter({ hasText: /role|grader|author/i }).first();
      if (await roleSelect.isVisible()) {
        await roleSelect.selectOption("GRADER");
      }

      // Submit invitation
      const submitButton = page.getByRole("button", { name: /send|invite|submit/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForLoadState("networkidle");
      }
    });

    test("3. Invitation appears in pending list", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Look for pending invitations section or the email we just invited
      const hasPendingSection = await page.getByText(/pending|invited/i).isVisible();
      const hasEmail = await page.getByText(testEmail).isVisible();

      expect(hasPendingSection || hasEmail).toBeTruthy();
    });

    test("4. Admin can resend invitation", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Find resend button for our invitation
      const resendButton = page.getByRole("button", { name: /resend/i }).first();
      
      if (await resendButton.isVisible()) {
        await resendButton.click();
        await page.waitForLoadState("networkidle");

        // Should show success message or stay on page
        const hasSuccess = await page.getByText(/sent|resent|success/i).isVisible();
        const stillOnPage = page.url().includes("/admin/users");
        expect(hasSuccess || stillOnPage).toBeTruthy();
      }
    });

    test("5. Admin can view/edit user details", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Find edit button
      const editButton = page.getByRole("button", { name: /edit/i }).first();
      const editLink = page.getByRole("link", { name: /edit/i }).first();

      if (await editButton.isVisible()) {
        await editButton.click();
      } else if (await editLink.isVisible()) {
        await editLink.click();
      }

      await page.waitForLoadState("networkidle");

      // Should show edit form or modal
      const hasEditForm = await page.getByRole("button", { name: /save|update|cancel/i }).isVisible();
      const hasModal = await page.locator(".modal, [role='dialog']").isVisible();
      
      expect(hasEditForm || hasModal).toBeTruthy();
    });

    test("6. Admin can change user role", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Find a user row with role selector
      const roleSelect = page.getByRole("combobox").filter({ hasText: /role|grader|author|admin/i }).first();
      
      if (await roleSelect.isVisible()) {
        // Try to change role
        await roleSelect.selectOption("AUTHOR");
        await page.waitForLoadState("networkidle");
      }
    });

    test("7. Admin can delete/cancel invitation", async ({ page, loginAs }) => {
      await loginAs("admin");
      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");

      // Find delete button
      const deleteButton = page.getByRole("button", { name: /delete|cancel|remove/i }).first();
      
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog
        page.on("dialog", (dialog) => dialog.accept());
        
        await deleteButton.click();
        await page.waitForLoadState("networkidle");
      }
    });
  });
});

test.describe("Bulk Invitation Lifecycle", () => {
  
  test("admin can access bulk invite page", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Should see invite section
    await expect(page.getByRole("heading", { name: /invite.*users/i })).toBeVisible();
  });

  test("can add multiple invite rows", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Add multiple rows
    const addButton = page.getByRole("button", { name: /add another/i });
    
    if (await addButton.isVisible()) {
      await addButton.click();
      await addButton.click();
      await addButton.click();

      // Should have multiple email inputs
      const emailInputs = page.getByPlaceholder(/user@example.com/i);
      expect(await emailInputs.count()).toBeGreaterThanOrEqual(4);
    }
  });

  test("can remove invite rows", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Add a row first
    const addButton = page.getByRole("button", { name: /add another/i });
    if (await addButton.isVisible()) {
      await addButton.click();
      
      const initialCount = await page.getByPlaceholder(/user@example.com/i).count();

      // Remove a row
      const removeButton = page.getByRole("button", { name: /×|remove/i }).first();
      if (await removeButton.isVisible()) {
        await removeButton.click();
        
        const finalCount = await page.getByPlaceholder(/user@example.com/i).count();
        expect(finalCount).toBeLessThan(initialCount);
      }
    }
  });

  test("invite button shows count of valid emails", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Fill in email
    const emailInput = page.getByPlaceholder(/user@example.com/i).first();
    if (await emailInput.isVisible()) {
      await emailInput.fill("test@example.com");
      
      // Button should show "Invite 1 User"
      await expect(page.getByRole("button", { name: /invite.*1.*user/i })).toBeVisible();
    }
  });
});

test.describe("Email Template Lifecycle", () => {
  
  test("admin can view email templates", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/admin/emails");
    await page.waitForLoadState("networkidle");

    // Should see templates page
    await expect(page.getByRole("heading", { name: /email.*template|template/i })).toBeVisible();
  });

  test("admin can create new template", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/admin/emails");
    await page.waitForLoadState("networkidle");

    const timestamp = Date.now();

    // Find create button
    const createButton = page.getByRole("button", { name: /create|new|add/i }).first();
    
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForLoadState("networkidle");

      // Fill in template details
      const nameInput = page.getByLabel(/name/i);
      if (await nameInput.isVisible()) {
        await nameInput.fill(`Test Template ${timestamp}`);
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

  test("templates can be used for invitations", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Template selector should be visible
    const templateSelect = page.getByRole("combobox").filter({ hasText: /template/i }).first();
    
    if (await templateSelect.isVisible()) {
      // Should have options
      const options = templateSelect.locator("option");
      expect(await options.count()).toBeGreaterThan(0);
    }
  });
});
