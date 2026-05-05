import { test, expect } from "./fixtures/auth";

test.describe("Delete Articles Admin Page", () => {
  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs("admin");
  });

  test("admin can access delete articles page", async ({ page }) => {
    await page.goto("/admin/delete-articles");
    await page.waitForLoadState("networkidle");

    // Should show heading
    await expect(page.getByRole("heading", { name: /delete articles/i })).toBeVisible();
  });

  test("page displays filter options", async ({ page }) => {
    await page.goto("/admin/delete-articles");
    await page.waitForLoadState("networkidle");

    // Should have filter dropdown
    const filterSelect = page.locator("select").first();
    await expect(filterSelect).toBeVisible();

    // Should have "Scraped Articles Only" option
    await expect(page.getByText(/scraped articles only/i)).toBeVisible();
  });

  test("can switch filter between scraped and all", async ({ page }) => {
    await page.goto("/admin/delete-articles");
    await page.waitForLoadState("networkidle");

    // Select "All Articles"
    const filterSelect = page.locator("select").first();
    await filterSelect.selectOption("all");

    await page.waitForLoadState("networkidle");

    // Should now show all articles
    await expect(page.getByText(/all articles/i)).toBeVisible();
  });

  test("displays article count", async ({ page }) => {
    await page.goto("/admin/delete-articles");
    await page.waitForLoadState("networkidle");

    // Should show article count
    await expect(page.getByText(/\(\d+ articles\)/i)).toBeVisible();
  });

  test("select all button is visible", async ({ page }) => {
    await page.goto("/admin/delete-articles");
    await page.waitForLoadState("networkidle");

    // Should have select all button
    const selectAllButton = page.getByRole("button", { name: /select all|deselect all/i });
    await expect(selectAllButton).toBeVisible();
  });

  test("delete all scraped button is visible in scraped filter", async ({ page }) => {
    await page.goto("/admin/delete-articles");
    await page.waitForLoadState("networkidle");

    // Should have delete all scraped button
    const deleteAllScrapedButton = page.getByRole("button", { name: /delete all scraped/i });
    await expect(deleteAllScrapedButton).toBeVisible();
  });

  test("back to admin link works", async ({ page }) => {
    await page.goto("/admin/delete-articles");
    await page.waitForLoadState("networkidle");

    // Click back link
    await page.getByRole("link", { name: /back to admin/i }).click();
    await page.waitForLoadState("networkidle");

    // Should be on admin page
    expect(page.url()).toContain("/admin");
    expect(page.url()).not.toContain("/delete-articles");
  });

  test("non-admin cannot access delete articles page", async ({ page, loginAs }) => {
    // Login as non-admin
    await loginAs("author");
    await page.goto("/admin/delete-articles");
    await page.waitForLoadState("networkidle");

    // Should redirect to unauthorized or signin
    expect(page.url()).toMatch(/unauthorized|signin/i);
  });
});
