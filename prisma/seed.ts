import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    const admin = await prisma.user.create({
      data: {
        name: "System Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });
    console.log("✅ Created admin user:", admin.email);
  } else {
    console.log("ℹ️  Admin user already exists:", adminEmail);
  }

  // Create authors
  const author1 = await prisma.author.create({
    data: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      affiliation: "Department of Computer Science, University Medical Center",
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: "Prof. Michael Chen",
      email: "michael.chen@research.org",
      affiliation: "Institute for Medical AI Research",
    },
  });

  // Create reviewers
  const reviewerA = await prisma.reviewer.upsert({
    where: { name_affiliation: { name: "Anonymous Reviewer", affiliation: "External" } },
    update: {},
    create: {
      name: "Anonymous Reviewer",
      affiliation: "External",
    },
  });

  const reviewerB = await prisma.reviewer.upsert({
    where: { name_affiliation: { name: "Internal Reviewer", affiliation: "Internal" } },
    update: {},
    create: {
      name: "Internal Reviewer",
      affiliation: "Internal",
    },
  });

  const reviewerC = await prisma.reviewer.upsert({
    where: { name_affiliation: { name: "Senior Reviewer", affiliation: "External" } },
    update: {},
    create: {
      name: "Senior Reviewer",
      affiliation: "External",
    },
  });

  // Create manuscript
  const manuscript = await prisma.manuscript.create({
    data: {
      title: "Novel Approaches to Machine Learning in Medical Diagnosis",
      abstract:
        "This study explores innovative machine learning techniques for improving diagnostic accuracy in clinical settings. We present a comprehensive analysis of deep learning models applied to medical imaging data.",
      keywords: [
        "machine learning",
        "medical diagnosis",
        "deep learning",
        "clinical applications",
      ],
      status: "UNDER_REVIEW",
      authors: {
        connect: [{ id: author1.id }, { id: author2.id }],
      },
    },
  });

  // Create version 1 - Initial submission
  const version1 = await prisma.manuscriptVersion.create({
    data: {
      versionNumber: 1,
      manuscriptId: manuscript.id,
      documentType: "TEXT",
      documentUrl: "/test-documents/sample-manuscript-v1.txt",
      notes: "Initial submission",
    },
  });

  // Create reviews for version 1
  await prisma.review.create({
    data: {
      versionId: version1.id,
      reviewerId: reviewerA.id,
      reviewType: "EXTERNAL",
      content:
        "The methodology is sound but requires more detailed statistical analysis. The results section needs expansion with additional validation studies.",
      documentType: "TEXT",
      documentUrl: "/test-documents/sample-review-external.txt",
    },
  });

  await prisma.review.create({
    data: {
      versionId: version1.id,
      reviewerId: reviewerB.id,
      reviewType: "INTERNAL",
      content:
        "Strong technical contribution. Suggest minor revisions to the introduction and discussion sections.",
      documentType: "TEXT",
      documentUrl: "/test-documents/sample-review-internal.txt",
    },
  });

  // Create version 2 - Revised submission
  const version2 = await prisma.manuscriptVersion.create({
    data: {
      versionNumber: 2,
      manuscriptId: manuscript.id,
      documentType: "TEXT",
      documentUrl: "/test-documents/sample-manuscript-v2.txt",
      notes: "Revised based on reviewer feedback",
    },
  });

  // Create review for version 2
  await prisma.review.create({
    data: {
      versionId: version2.id,
      reviewerId: reviewerC.id,
      reviewType: "EXTERNAL",
      content:
        "Significant improvements made. The statistical analysis is now comprehensive. Ready for publication pending minor formatting changes.",
      documentType: "PDF",
      documentUrl: "/test-documents/sample-review.pdf",
    },
  });

  console.log("✅ Seed data created successfully!");
  console.log("✅ Created manuscript:", manuscript.title);
  console.log("✅ Created authors:", author1.name, author2.name);
  console.log(
    "✅ Created reviewers:",
    reviewerA.name,
    reviewerB.name,
    reviewerC.name,
  );
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
