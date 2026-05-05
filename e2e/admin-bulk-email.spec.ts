import { test, expect } from "./fixtures/auth";

test.describe("Admin Bulk Email Flow", () => {
  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs("admin");
  });

  test("graders page has bulk email functionality", async ({ page }) => {
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Should show "Send Reminder Emails" section
    await expect(page.getByRole("heading", { name: /send reminder emails/i })).toBeVisible();
  });

  test("can select email template for sending", async ({ page }) => {
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Should have template dropdown for sending
    const templateSelect = page.getByRole("combobox").filter({ hasText: /template|select/i }).last();
    await expect(templateSelect).toBeVisible();
  });

  test("send button is disabled when no users selected", async ({ page }) => {
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Send button should be disabled when no users selected
    const sendButton = page.getByRole("button", { name: /send to \d+ selected/i });
    await expect(sendButton).toBeDisabled();
  });

  test("can access graders management from admin dashboard", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Click on manage graders link
    const gradersLink = page.getByRole("link", { name: /manage graders|graders/i });
    await expect(gradersLink).toBeVisible();

    await gradersLink.click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/admin/graders");
  });

  test("invite users section is visible", async ({ page }) => {
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Should show "Invite Users" section
    await expect(page.getByRole("heading", { name: /invite users/i })).toBeVisible();
  });

  test("can add invite row", async ({ page }) => {
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Should have "Add another" button
    const addAnotherButton = page.getByRole("button", { name: /add another/i });
    await expect(addAnotherButton).toBeVisible();

    // Click to add another row
    await addAnotherButton.click();

    // Should now have more input rows
    const emailInputs = page.getByPlaceholder(/user@example.com/i);
    expect(await emailInputs.count()).toBeGreaterThanOrEqual(2);
  });

  test("role selection is available", async ({ page }) => {
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Should have role dropdown with options
    const roleSelect = page.getByRole("combobox").filter({ hasText: /grader|author|reviewer|admin/i }).first();
    await expect(roleSelect).toBeVisible();
  });

  test("users table is displayed", async ({ page }) => {
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    // Should show users heading
    await expect(page.getByRole("heading", { name: /users/i })).toBeVisible();

    // Should have a table
    const table = page.getByRole("table");
    await expect(table).toBeVisible();
  });
});
