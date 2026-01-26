import { chromium, FullConfig } from "@playwright/test";
import { execSync } from "child_process";
import { TEST_USERS } from "./fixtures/auth";

async function globalSetup(config: FullConfig) {
  console.log("🔧 Running global setup...");

  // Create test users AND seed test data via a script that has access to Prisma
  // This avoids the need to bundle Prisma in the Playwright environment
  try {
    const script = `
      const { PrismaClient } = require("@prisma/client");
      const bcrypt = require("bcryptjs");
      
      const prisma = new PrismaClient();
      
      async function createTestUsersAndData() {
        const users = ${JSON.stringify(TEST_USERS)};
        
        // Create test users
        for (const [userType, user] of Object.entries(users)) {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              password: hashedPassword,
              role: user.role,
              emailVerified: new Date(),
            },
            create: {
              email: user.email,
              name: user.name,
              password: hashedPassword,
              role: user.role,
              emailVerified: new Date(),
            },
          });
          console.log("Created/updated test user: " + userType);
        }
        
        // Create test reviewers (needed for review forms)
        const reviewer1 = await prisma.reviewer.upsert({
          where: { name_affiliation: { name: "E2E Test Reviewer", affiliation: "Test Institution" } },
          update: {},
          create: {
            name: "E2E Test Reviewer",
            email: "reviewer@test.com",
            affiliation: "Test Institution",
          },
        });
        console.log("Created test reviewer: " + reviewer1.name);
        
        // Create a test author
        const author = await prisma.author.upsert({
          where: { id: "e2e-test-author" },
          update: {},
          create: {
            id: "e2e-test-author",
            name: "E2E Test Author",
            email: "author@test.com",
            affiliation: "Test University",
          },
        });
        console.log("Created test author: " + author.name);
        
        // Create a test manuscript with version and review for grading tests
        const existingManuscript = await prisma.manuscript.findFirst({
          where: { title: { contains: "E2E Test Manuscript" } }
        });
        
        if (!existingManuscript) {
          const manuscript = await prisma.manuscript.create({
            data: {
              title: "E2E Test Manuscript for Grading",
              abstract: "This is a test manuscript created for E2E testing purposes.",
              keywords: ["e2e", "test", "grading"],
              status: "UNDER_REVIEW",
              authors: { connect: [{ id: author.id }] },
            },
          });
          
          const version = await prisma.manuscriptVersion.create({
            data: {
              versionNumber: 1,
              manuscriptId: manuscript.id,
              documentType: "TEXT",
              documentUrl: "/test-documents/sample-manuscript-v1.txt",
              notes: "Initial test version",
            },
          });
          
          await prisma.review.create({
            data: {
              versionId: version.id,
              reviewerId: reviewer1.id,
              reviewType: "EXTERNAL",
              content: "This is a test review for E2E grading tests. The methodology is sound and the results are clear.",
              documentType: "TEXT",
              documentUrl: "/test-documents/sample-review-external.txt",
            },
          });
          
          console.log("Created test manuscript with version and review");
        } else {
          console.log("Test manuscript already exists");
        }
        
        await prisma.$disconnect();
      }
      
      createTestUsersAndData().catch(console.error);
    `;

    execSync(`node -e '${script.replace(/'/g, "'\\''")}'`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("✅ Test users created");
  } catch (error) {
    console.log("⚠️ Could not create test users via script, trying inline...");
    // Fallback: try to import and run inline (may not work in all environments)
    try {
      const { PrismaClient } = await import("@prisma/client");
      const bcrypt = await import("bcryptjs");
      const prisma = new PrismaClient();

      for (const [userType, user] of Object.entries(TEST_USERS)) {
        const hashedPassword = await bcrypt.default.hash(user.password, 12);

        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            password: hashedPassword,
            role: user.role,
          },
          create: {
            email: user.email,
            name: user.name,
            password: hashedPassword,
            role: user.role,
          },
        });
        console.log(`✅ Created/updated test user: ${userType}`);
      }

      await prisma.$disconnect();
    } catch (innerError) {
      console.log("⚠️ Could not create test users:", innerError);
    }
  }

  // Get the base URL from config
  const baseURL = config.projects[0].use?.baseURL || "http://localhost:3010";

  // Pre-authenticate and save storage state (optional optimization)
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to sign in page
    await page.goto(`${baseURL}/auth/signin`, { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Click Password tab
    const passwordTab = page.getByRole("button", { name: "Password" });
    if (await passwordTab.isVisible({ timeout: 5000 })) {
      await passwordTab.click();
    }

    // Fill credentials
    await page.getByLabel("Email").fill(TEST_USERS.admin.email);
    await page.getByLabel("Password").fill(TEST_USERS.admin.password);
    await page.getByRole("button", { name: "Sign In" }).last().click();

    // Wait for successful login
    await page.waitForURL((url) => !url.pathname.includes("/auth/signin"), {
      timeout: 15000,
    });

    // Save storage state for reuse
    await context.storageState({ path: "./e2e/.auth/admin.json" });
    console.log("✅ Saved admin authentication state");

    await browser.close();
  } catch (error) {
    console.log(
      "⚠️ Could not pre-authenticate (this is okay, tests will log in individually)"
    );
  }

  console.log("✅ Global setup complete");
}

export default globalSetup;
