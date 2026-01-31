import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Test users that need to exist for E2E tests
const TEST_USERS = {
  admin: {
    email: "admin@test.llm-med.local",
    password: "TestPassword123!",
    name: "Test Admin",
    role: "ADMIN" as const,
  },
  grader: {
    email: "grader@test.llm-med.local",
    password: "TestPassword123!",
    name: "Test Grader",
    role: "GRADER" as const,
  },
  author: {
    email: "author@test.llm-med.local",
    password: "TestPassword123!",
    name: "Test Author",
    role: "AUTHOR" as const,
  },
};

async function createTestUsers() {
  const prisma = new PrismaClient();

  try {
    console.log("🔧 Creating test users...");

    // Create test users
    for (const [userType, user] of Object.entries(TEST_USERS)) {
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
      console.log(`✅ Created/updated test user: ${userType}`);
    }

    // Create test reviewers (needed for review forms)
    const reviewer1 = await prisma.reviewer.upsert({
      where: {
        name_affiliation: {
          name: "E2E Test Reviewer",
          affiliation: "Test Institution",
        },
      },
      update: {},
      create: {
        name: "E2E Test Reviewer",
        email: "reviewer@test.com",
        affiliation: "Test Institution",
      },
    });
    console.log(`✅ Created test reviewer: ${reviewer1.name}`);

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
    console.log(`✅ Created test author: ${author.name}`);

    // Create a test manuscript with version and review for grading tests
    const existingManuscript = await prisma.manuscript.findFirst({
      where: { title: { contains: "E2E Test Manuscript" } },
    });

    if (!existingManuscript) {
      const manuscript = await prisma.manuscript.create({
        data: {
          title: "E2E Test Manuscript for Grading",
          abstract:
            "This is a test manuscript created for E2E testing purposes.",
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
          content:
            "This is a test review for E2E grading tests. The methodology is sound and the results are clear.",
          documentType: "TEXT",
          documentUrl: "/test-documents/sample-review-external.txt",
        },
      });

      console.log("✅ Created test manuscript with version and review");
    } else {
      console.log("ℹ️ Test manuscript already exists");
    }

    console.log("✅ Test setup complete");
  } catch (error) {
    console.error("❌ Error creating test users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
