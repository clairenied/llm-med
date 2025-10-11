import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating initial source entries...");

  // Create common academic sources
  const sources = [
    {
      name: "F1000Research",
      baseUrl: "https://f1000research.com",
      description:
        "Open research publishing platform with transparent peer review",
      isActive: true,
    },
    {
      name: "PubMed",
      baseUrl: "https://pubmed.ncbi.nlm.nih.gov",
      description: "Database of biomedical and life science literature",
      isActive: true,
    },
    {
      name: "arXiv",
      baseUrl: "https://arxiv.org",
      description: "Repository of electronic preprints for scientific papers",
      isActive: true,
    },
    {
      name: "bioRxiv",
      baseUrl: "https://www.biorxiv.org",
      description: "Preprint server for biology research",
      isActive: true,
    },
    {
      name: "medRxiv",
      baseUrl: "https://www.medrxiv.org",
      description: "Preprint server for health sciences",
      isActive: true,
    },
  ];

  for (const sourceData of sources) {
    try {
      const existingSource = await prisma.source.findUnique({
        where: { name: sourceData.name },
      });

      if (existingSource) {
        console.log(`Source "${sourceData.name}" already exists, skipping...`);
        continue;
      }

      const source = await prisma.source.create({
        data: sourceData,
      });

      console.log(`✅ Created source: ${source.name}`);
    } catch (error) {
      console.error(`❌ Error creating source "${sourceData.name}":`, error);
    }
  }

  console.log("\n✅ Source migration completed!");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
