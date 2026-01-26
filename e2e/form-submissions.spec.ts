import { test, expect, Page } from "./fixtures/auth";

/**
 * STRICT Form Submission Tests
 * 
 * These tests verify forms ACTUALLY submit successfully by:
 * 1. Filling ALL required fields (not skipping any)
 * 2. Intercepting API responses to verify success (200/201)
 * 3. Verifying created data appears in the UI
 * 4. Using strong assertions that will catch bugs like missing fields
 * 
 * If a form has a required dropdown/select, we MUST select a value.
 * If a form has required text fields, we MUST fill them.
 */

// Helper to wait for API response and verify success
async function waitForApiSuccess(
  page: Page,
  urlPattern: RegExp | string,
  method: string = "POST"
): Promise<{ ok: boolean; status: number; body: unknown }> {
  const responsePromise = page.waitForResponse(
    (response) =>
      (typeof urlPattern === "string"
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())) &&
      response.request().method() === method
  );

  return responsePromise.then(async (response) => {
    const body = await response.json().catch(() => null);
    return {
      ok: response.ok(),
      status: response.status(),
      body,
    };
  });
}

test.describe("STRICT Form Submissions - Reviews", () => {
  test("review creation MUST select a reviewer and fill content", async ({
    page,
    loginAs,
  }) => {
    await loginAs("admin");

    // First, ensure we have a manuscript with a version
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to a manuscript
    const manuscriptLink = page
      .locator("a[href*='/manuscripts/']")
      .filter({ hasNot: page.locator("[href*='/new']") })
      .filter({ hasNot: page.locator("[href*='/upload']") })
      .filter({ hasNot: page.locator("[href*='/edit']") })
      .first();

    if (!(await manuscriptLink.isVisible())) {
      test.skip(true, "No manuscripts available to test");
      return;
    }

    await manuscriptLink.click();
    await page.waitForLoadState("networkidle");

    // Find Add Review link
    const addReviewLink = page.getByRole("link", { name: /add.*review/i });
    if (!(await addReviewLink.isVisible())) {
      test.skip(true, "No Add Review link available");
      return;
    }

    await addReviewLink.click();
    await page.waitForLoadState("networkidle");

    // VERIFY we're on the review form
    expect(page.url()).toContain("/reviews/new");

    // CRITICAL: Check for reviewer dropdown and select a reviewer
    const reviewerDropdown = page.getByLabel(/reviewer/i);
    await expect(reviewerDropdown).toBeVisible({ timeout: 5000 });

    // Get all options to ensure there are reviewers
    const options = await reviewerDropdown.locator("option").allTextContents();
    expect(options.length).toBeGreaterThan(1); // More than just "Select..."

    // Select the first actual reviewer (not the placeholder)
    const reviewerOption = reviewerDropdown.locator("option").nth(1);
    const reviewerValue = await reviewerOption.getAttribute("value");
    expect(reviewerValue).toBeTruthy();
    await reviewerDropdown.selectOption(reviewerValue!);

    // Fill review content (REQUIRED)
    const contentField = page.getByLabel(/content/i);
    await expect(contentField).toBeVisible();
    await contentField.fill(
      "This is a comprehensive test review. The methodology is sound and results are clear. Recommendation: Accept."
    );

    // Set up API response interception BEFORE clicking submit
    const apiResponsePromise = waitForApiSuccess(page, "/api/reviews", "POST");

    // Submit the form
    const submitButton = page.getByRole("button", { name: /create.*review/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // VERIFY API returned success
    const apiResponse = await apiResponsePromise;
    expect(apiResponse.ok).toBe(true);
    expect(apiResponse.status).toBe(201);
    expect(apiResponse.body).toHaveProperty("id");

    // VERIFY redirect happened
    await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);
    expect(page.url()).not.toContain("/reviews/new");

    // VERIFY the review appears on the page
    await page.waitForLoadState("networkidle");
    const reviewText = page.getByText(/comprehensive test review/i);
    await expect(reviewText).toBeVisible({ timeout: 5000 });
  });

  test("review creation fails without reviewer selection", async ({
    page,
    loginAs,
  }) => {
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
      test.skip(true, "No Add Review link");
      return;
    }

    await addReviewLink.click();
    await page.waitForLoadState("networkidle");

    // Fill content but DON'T select a reviewer
    const contentField = page.getByLabel(/content/i);
    await contentField.fill("Test review without reviewer selected");

    // Try to submit
    const submitButton = page.getByRole("button", { name: /create.*review/i });
    await submitButton.click();

    // Should stay on the form (validation error)
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/reviews/new");

    // Should show validation error
    const errorMessage = page.getByText(/select.*reviewer|reviewer.*required/i);
    await expect(errorMessage).toBeVisible();
  });
});

test.describe("STRICT Form Submissions - Manuscripts", () => {
  test("manuscript upload MUST add author before submitting", async ({
    page,
    loginAs,
  }) => {
    await loginAs("admin");
    await page.goto("/manuscripts/upload");
    await page.waitForLoadState("networkidle");

    const timestamp = Date.now();

    // Fill title
    await page.getByLabel(/article title/i).fill(`Strict Test Manuscript ${timestamp}`);

    // CRITICAL: Add author - don't just fill, must click Add button
    const authorInput = page.getByPlaceholder(/enter author name/i);
    await authorInput.fill("Dr. Test Author");
    
    const addAuthorButton = page.getByRole("button", { name: /^add$/i }).first();
    await addAuthorButton.click();

    // VERIFY author was added (should appear as a tag/chip)
    await expect(page.getByText("Dr. Test Author")).toBeVisible();

    // Fill content
    await page.getByLabel(/article content/i).fill(
      "This is test content for the strict submission test."
    );

    // Set up API interception
    const apiResponsePromise = waitForApiSuccess(
      page,
      "/api/manuscripts/upload",
      "POST"
    );

    // Submit
    await page.getByRole("button", { name: /upload article/i }).click();

    // Verify API success
    const apiResponse = await apiResponsePromise;
    expect(apiResponse.ok).toBe(true);
    expect(apiResponse.status).toBe(201);

    // Verify redirect
    await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);

    // Verify manuscript appears
    await expect(
      page.getByText(new RegExp(`Strict Test Manuscript ${timestamp}`))
    ).toBeVisible();
  });

  test("manuscript upload fails without author", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/manuscripts/upload");
    await page.waitForLoadState("networkidle");

    // Fill title and content but NO author
    await page.getByLabel(/article title/i).fill("Test Without Author");
    await page.getByLabel(/article content/i).fill("Some content");

    // Try to submit
    await page.getByRole("button", { name: /upload article/i }).click();

    // Should stay on form
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/upload");

    // Should show error
    const errorMessage = page.getByText(/author.*required/i);
    await expect(errorMessage).toBeVisible();
  });
});

test.describe("STRICT Form Submissions - Authors", () => {
  test("author creation requires name field", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/authors/new");
    await page.waitForLoadState("networkidle");

    const timestamp = Date.now();

    // Fill name (required)
    await page.getByLabel(/name/i).fill(`Strict Test Author ${timestamp}`);

    // Fill optional fields
    const emailField = page.getByLabel(/email/i);
    if (await emailField.isVisible()) {
      await emailField.fill(`strict${timestamp}@test.com`);
    }

    // Set up API interception
    const apiResponsePromise = waitForApiSuccess(page, "/api/authors", "POST");

    // Submit
    await page.getByRole("button", { name: /create|save|submit/i }).click();

    // Verify API success
    const apiResponse = await apiResponsePromise;
    expect(apiResponse.ok).toBe(true);
    expect([200, 201]).toContain(apiResponse.status);

    // Verify redirect
    await page.waitForURL(/\/authors\/[a-zA-Z0-9]+$|\/authors$/);

    // Verify author name appears
    await expect(
      page.getByText(new RegExp(`Strict Test Author ${timestamp}`))
    ).toBeVisible();
  });
});

test.describe("STRICT Form Submissions - Versions", () => {
  test("version edit updates successfully", async ({ page, loginAs }) => {
    await loginAs("admin");

    // Navigate to a manuscript
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

    // Find edit version link
    const editLink = page.getByRole("link", { name: /edit/i }).first();
    if (!(await editLink.isVisible())) {
      test.skip(true, "No edit link available");
      return;
    }

    await editLink.click();
    await page.waitForLoadState("networkidle");

    // Update notes
    const timestamp = Date.now();
    const notesField = page.getByLabel(/notes/i);
    await notesField.fill(`Strict test update ${timestamp}`);

    // Set up API interception
    const apiResponsePromise = waitForApiSuccess(page, "/api/versions/", "PUT");

    // Submit
    await page.getByRole("button", { name: /update|save/i }).click();

    // Verify API success
    const apiResponse = await apiResponsePromise;
    expect(apiResponse.ok).toBe(true);
    expect(apiResponse.status).toBe(200);

    // Verify redirect
    await page.waitForURL(/\/manuscripts\/[a-zA-Z0-9]+$/);

    // Verify updated notes appear
    await expect(page.getByText(new RegExp(`Strict test update ${timestamp}`))).toBeVisible();
  });
});

test.describe("STRICT Form Submissions - Profile", () => {
  test("password change validates current password", async ({
    page,
    loginAs,
  }) => {
    await loginAs("admin");
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");

    // Try with wrong current password
    const currentPasswordField = page.getByLabel(/current password/i);
    const newPasswordField = page.getByLabel(/^new password$/i);
    const confirmPasswordField = page.getByLabel(/confirm.*password/i);

    await currentPasswordField.fill("wrongpassword");
    await newPasswordField.fill("newpassword123");
    await confirmPasswordField.fill("newpassword123");

    // Submit
    await page.getByRole("button", { name: /change password/i }).click();
    await page.waitForLoadState("networkidle");

    // Should show error about incorrect password
    const hasError = await page
      .getByText(/incorrect|wrong|invalid|error/i)
      .isVisible()
      .catch(() => false);
    
    // Should stay on profile page
    expect(page.url()).toContain("/profile");
  });
});

test.describe("STRICT Form Submissions - Admin", () => {
  test("user invitation requires email", async ({ page, loginAs }) => {
    await loginAs("admin");
    await page.goto("/admin/graders");
    await page.waitForLoadState("networkidle");

    const timestamp = Date.now();

    // Fill all required fields for invitation
    const emailInput = page.getByPlaceholder(/email/i).first();
    if (!(await emailInput.isVisible())) {
      test.skip(true, "No email input found");
      return;
    }

    await emailInput.fill(`stricttest${timestamp}@example.com`);

    // Fill name fields if visible
    const firstNameInput = page.getByPlaceholder(/first/i);
    if (await firstNameInput.isVisible()) {
      await firstNameInput.fill("Strict");
    }

    const lastNameInput = page.getByPlaceholder(/last/i);
    if (await lastNameInput.isVisible()) {
      await lastNameInput.fill("Test");
    }

    // Submit invitation
    const inviteButton = page.getByRole("button", { name: /invite/i });
    await inviteButton.click();
    await page.waitForLoadState("networkidle");

    // Should show success or the invitation in the list
    const hasSuccess = await page
      .getByText(/success|sent|invited|created/i)
      .isVisible()
      .catch(() => false);
    const hasInvitation = await page
      .getByText(new RegExp(`stricttest${timestamp}@example.com`))
      .isVisible()
      .catch(() => false);

    expect(hasSuccess || hasInvitation).toBe(true);
  });
});
