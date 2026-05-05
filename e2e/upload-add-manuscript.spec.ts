import { test, expect } from "./fixtures/auth";

test.describe("Upload Article Flow", () => {
  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs("author");
    await page.goto("/manuscripts/upload");
    await page.waitForLoadState("networkidle");
  });

  test("upload page displays correctly", async ({ page }) => {
    // Should show heading
    await expect(page.getByRole("heading", { name: /upload.*article/i })).toBeVisible();

    // Should show upload method options
    await expect(page.getByText(/plain text/i)).toBeVisible();
    await expect(page.getByText(/pdf file/i)).toBeVisible();
    await expect(page.getByText(/from url/i)).toBeVisible();
  });

  test.describe("Text Upload Method", () => {
    test("text upload is selected by default", async ({ page }) => {
      const textRadio = page.getByRole("radio", { name: /plain text/i });
      await expect(textRadio).toBeChecked();
    });

    test("can upload article via text", async ({ page }) => {
      const timestamp = Date.now();

      // Fill in title
      await page.getByLabel(/article title/i).fill(`Test Article ${timestamp}`);

      // Fill in abstract (optional)
      await page.getByLabel(/abstract/i).fill(`This is a test abstract for article ${timestamp}`);

      // Add author (required)
      await page.getByPlaceholder(/enter author name/i).fill("Test Author");
      await page.getByRole("button", { name: /^add$/i }).first().click();

      // Verify author was added
      await expect(page.getByText("Test Author")).toBeVisible();

      // Add keyword (optional)
      await page.getByPlaceholder(/enter keyword/i).fill("test-keyword");
      await page.getByRole("button", { name: /^add$/i }).last().click();

      // Fill in content (required for text upload)
      await page.getByLabel(/article content/i).fill(
        `This is the full content of the test article ${timestamp}. It contains multiple paragraphs of text that would represent a research paper.`
      );

      // Submit the form
      await page.getByRole("button", { name: /upload article/i }).click();

      // Wait for navigation or loading
      await page.waitForLoadState("networkidle");

      // Should redirect to the new manuscript or show success
      const url = page.url();
      const hasSuccess = !url.includes("/upload");
      expect(hasSuccess).toBeTruthy();
    });

    test("validates required fields for text upload", async ({ page }) => {
      // Try to submit without filling anything
      await page.getByRole("button", { name: /upload article/i }).click();

      // Should show validation errors
      await expect(page.getByText(/title is required/i)).toBeVisible();
      await expect(page.getByText(/at least one author is required/i)).toBeVisible();
    });

    test("validates content is required for text upload", async ({ page }) => {
      // Fill title and author but not content
      await page.getByLabel(/article title/i).fill("Test Title");
      await page.getByPlaceholder(/enter author name/i).fill("Test Author");
      await page.getByRole("button", { name: /^add$/i }).first().click();

      // Submit
      await page.getByRole("button", { name: /upload article/i }).click();

      // Should show content required error
      await expect(page.getByText(/article content is required/i)).toBeVisible();
    });
  });

  test.describe("PDF Upload Method", () => {
    test("can switch to PDF upload", async ({ page }) => {
      await page.getByRole("radio", { name: /pdf file/i }).check();

      // Should show PDF upload area
      await expect(page.getByText(/choose pdf file/i)).toBeVisible();
    });

    test("validates PDF file is required", async ({ page }) => {
      await page.getByRole("radio", { name: /pdf file/i }).check();

      // Fill title and author
      await page.getByLabel(/article title/i).fill("PDF Test Article");
      await page.getByPlaceholder(/enter author name/i).fill("PDF Author");
      await page.getByRole("button", { name: /^add$/i }).first().click();

      // Submit without file
      await page.getByRole("button", { name: /upload article/i }).click();

      // Should show file required error
      await expect(page.getByText(/pdf file is required/i)).toBeVisible();
    });
  });

  test.describe("URL Upload Method", () => {
    test("can switch to URL upload", async ({ page }) => {
      await page.getByRole("radio", { name: /from url/i }).check();

      // Should show URL input
      await expect(page.getByLabel(/article url/i)).toBeVisible();
    });

    test("validates URL is required", async ({ page }) => {
      await page.getByRole("radio", { name: /from url/i }).check();

      // Fill title and author
      await page.getByLabel(/article title/i).fill("URL Test Article");
      await page.getByPlaceholder(/enter author name/i).fill("URL Author");
      await page.getByRole("button", { name: /^add$/i }).first().click();

      // Submit without URL
      await page.getByRole("button", { name: /upload article/i }).click();

      // Should show URL required error
      await expect(page.getByText(/url is required/i)).toBeVisible();
    });

    test("validates URL format", async ({ page }) => {
      await page.getByRole("radio", { name: /from url/i }).check();

      // Fill title and author
      await page.getByLabel(/article title/i).fill("URL Test Article");
      await page.getByPlaceholder(/enter author name/i).fill("URL Author");
      await page.getByRole("button", { name: /^add$/i }).first().click();

      // Fill invalid URL
      await page.getByLabel(/article url/i).fill("not-a-valid-url");

      // Submit
      await page.getByRole("button", { name: /upload article/i }).click();

      // Should show invalid URL error
      await expect(page.getByText(/valid url/i)).toBeVisible();
    });
  });

  test.describe("Authors Management", () => {
    test("can add multiple authors", async ({ page }) => {
      // Add first author
      await page.getByPlaceholder(/enter author name/i).fill("Author One");
      await page.getByRole("button", { name: /^add$/i }).first().click();
      await expect(page.getByText("Author One")).toBeVisible();

      // Add second author
      await page.getByPlaceholder(/enter author name/i).fill("Author Two");
      await page.getByRole("button", { name: /^add$/i }).first().click();
      await expect(page.getByText("Author Two")).toBeVisible();

      // Add third author
      await page.getByPlaceholder(/enter author name/i).fill("Author Three");
      await page.getByRole("button", { name: /^add$/i }).first().click();
      await expect(page.getByText("Author Three")).toBeVisible();
    });

    test("can remove authors", async ({ page }) => {
      // Add author
      await page.getByPlaceholder(/enter author name/i).fill("Author To Remove");
      await page.getByRole("button", { name: /^add$/i }).first().click();
      await expect(page.getByText("Author To Remove")).toBeVisible();

      // Remove author (click the × button)
      await page.locator("text=Author To Remove").locator("..").getByText("×").click();

      // Author should be removed
      await expect(page.getByText("Author To Remove")).not.toBeVisible();
    });
  });

  test.describe("Keywords Management", () => {
    test("can add multiple keywords", async ({ page }) => {
      // Add first keyword
      await page.getByPlaceholder(/enter keyword/i).fill("keyword-one");
      await page.getByRole("button", { name: /^add$/i }).last().click();
      await expect(page.getByText("keyword-one")).toBeVisible();

      // Add second keyword
      await page.getByPlaceholder(/enter keyword/i).fill("keyword-two");
      await page.getByRole("button", { name: /^add$/i }).last().click();
      await expect(page.getByText("keyword-two")).toBeVisible();
    });

    test("can remove keywords", async ({ page }) => {
      // Add keyword
      await page.getByPlaceholder(/enter keyword/i).fill("keyword-to-remove");
      await page.getByRole("button", { name: /^add$/i }).last().click();
      await expect(page.getByText("keyword-to-remove")).toBeVisible();

      // Remove keyword
      await page.locator("text=keyword-to-remove").locator("..").getByText("×").click();

      // Keyword should be removed
      await expect(page.getByText("keyword-to-remove")).not.toBeVisible();
    });
  });

  test("cancel button returns to manuscripts", async ({ page }) => {
    await page.getByRole("link", { name: /cancel/i }).click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/manuscripts");
  });
});

test.describe("Add Manuscript Flow", () => {
  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs("author");
    await page.goto("/manuscripts/new");
    await page.waitForLoadState("networkidle");
  });

  test("add manuscript page displays correctly", async ({ page }) => {
    // Should show the form
    await expect(page.getByLabel(/title/i)).toBeVisible();
  });

  test("can create a new manuscript", async ({ page }) => {
    const timestamp = Date.now();

    // Fill in title
    const titleField = page.getByLabel(/title/i);
    await titleField.fill(`New Manuscript ${timestamp}`);

    // Fill in abstract if available
    const abstractField = page.getByLabel(/abstract/i);
    if (await abstractField.isVisible()) {
      await abstractField.fill(`Abstract for manuscript ${timestamp}`);
    }

    // Add author if there's an author input
    const authorInput = page.getByPlaceholder(/author/i);
    if (await authorInput.isVisible()) {
      await authorInput.fill("Test Manuscript Author");
      const addButton = page.getByRole("button", { name: /add/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }

    // Submit the form
    const submitButton = page.getByRole("button", { name: /create|save|submit/i });
    await submitButton.click();

    // Wait for navigation
    await page.waitForLoadState("networkidle");

    // Should redirect to manuscript detail or list
    const url = page.url();
    expect(url.includes("/manuscripts") && !url.includes("/new")).toBeTruthy();
  });

  test("validates required title field", async ({ page }) => {
    // Try to submit without title
    const submitButton = page.getByRole("button", { name: /create|save|submit/i });
    await submitButton.click();

    await page.waitForTimeout(500);

    // Should stay on form (title required)
    expect(page.url()).toContain("/new");
  });

  test("cancel button works", async ({ page }) => {
    const cancelButton = page.getByRole("button", { name: /cancel/i });
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      await page.waitForLoadState("networkidle");

      // Should return to home or manuscripts list
      expect(page.url()).not.toContain("/new");
    }
  });
});

test.describe("Integration: Upload vs Add Manuscript", () => {
  test("upload link is accessible from manuscripts list", async ({ page, loginAs }) => {
    await loginAs("author");
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should have upload link
    const uploadLink = page.getByRole("link", { name: /upload/i });
    await expect(uploadLink).toBeVisible();

    await uploadLink.click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/upload");
  });

  test("add manuscript link is accessible from manuscripts list", async ({ page, loginAs }) => {
    await loginAs("author");
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should have add manuscript link
    const addLink = page.getByRole("link", { name: /add.*manuscript/i });
    await expect(addLink).toBeVisible();

    await addLink.click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("/manuscripts/new");
  });
});
