import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createPaginationData() {
  console.log('🚀 Creating Additional Data for Pagination Testing');
  console.log('==================================================');

  try {
    // Get F1000Research source
    let f1000Source = await prisma.source.findUnique({
      where: { name: 'F1000Research' }
    });

    if (!f1000Source) {
      f1000Source = await prisma.source.create({
        data: {
          name: 'F1000Research',
          baseUrl: 'https://f1000research.com',
          description: 'Open research publishing platform',
          isActive: true
        }
      });
    }

    // Create realistic medical research articles based on real F1000Research patterns
    const additionalArticles = [
      {
        title: "SARS-CoV-2 variant surveillance and genomic epidemiology in Bangladesh",
        abstract: "Background: Genomic surveillance of SARS-CoV-2 variants is crucial for understanding viral evolution and informing public health responses.",
        keywords: ["SARS-CoV-2", "genomic surveillance", "variants", "Bangladesh", "epidemiology"],
        f1000Id: "12-1234",
        url: "https://f1000research.com/articles/12-1234"
      },
      {
        title: "Machine learning approaches for predicting drug-target interactions in cancer therapy",
        abstract: "Drug discovery for cancer treatment remains challenging. This study explores machine learning methods to predict novel drug-target interactions.",
        keywords: ["machine learning", "drug discovery", "cancer", "target prediction", "bioinformatics"],
        f1000Id: "13-5678",
        url: "https://f1000research.com/articles/13-5678"
      },
      {
        title: "Impact of climate change on vector-borne diseases in tropical regions",
        abstract: "Climate change significantly affects the distribution and transmission patterns of vector-borne diseases in tropical and subtropical regions.",
        keywords: ["climate change", "vector-borne diseases", "tropical medicine", "epidemiology", "public health"],
        f1000Id: "14-9012",
        url: "https://f1000research.com/articles/14-9012"
      },
      {
        title: "CRISPR-Cas9 gene editing for treating inherited retinal diseases",
        abstract: "Gene therapy using CRISPR-Cas9 technology shows promise for treating various inherited retinal diseases that cause blindness.",
        keywords: ["CRISPR-Cas9", "gene therapy", "retinal diseases", "ophthalmology", "genetic disorders"],
        f1000Id: "15-3456",
        url: "https://f1000research.com/articles/15-3456"
      },
      {
        title: "Microbiome analysis in patients with inflammatory bowel disease",
        abstract: "The gut microbiome plays a crucial role in inflammatory bowel disease pathogenesis and treatment response.",
        keywords: ["microbiome", "inflammatory bowel disease", "gut bacteria", "16S sequencing", "dysbiosis"],
        f1000Id: "16-7890",
        url: "https://f1000research.com/articles/16-7890"
      },
      {
        title: "Telemedicine adoption in rural healthcare systems during COVID-19 pandemic",
        abstract: "The COVID-19 pandemic accelerated telemedicine adoption in rural areas, improving healthcare access and patient outcomes.",
        keywords: ["telemedicine", "rural healthcare", "COVID-19", "digital health", "healthcare access"],
        f1000Id: "17-2345",
        url: "https://f1000research.com/articles/17-2345"
      },
      {
        title: "Artificial intelligence in medical imaging for early cancer detection",
        abstract: "AI-powered medical imaging systems demonstrate superior performance in early detection of various cancer types.",
        keywords: ["artificial intelligence", "medical imaging", "cancer detection", "deep learning", "radiology"],
        f1000Id: "18-6789",
        url: "https://f1000research.com/articles/18-6789"
      },
      {
        title: "Pharmacogenomics of antidepressant response in major depressive disorder",
        abstract: "Genetic variations significantly influence antidepressant treatment response and adverse effects in patients with major depression.",
        keywords: ["pharmacogenomics", "antidepressants", "major depression", "personalized medicine", "genetic testing"],
        f1000Id: "19-0123",
        url: "https://f1000research.com/articles/19-0123"
      },
      {
        title: "Novel biomarkers for early detection of Alzheimer's disease",
        abstract: "Identification of novel biomarkers enables earlier and more accurate diagnosis of Alzheimer's disease before clinical symptoms appear.",
        keywords: ["Alzheimer's disease", "biomarkers", "early detection", "neurodegeneration", "dementia"],
        f1000Id: "20-4567",
        url: "https://f1000research.com/articles/20-4567"
      },
      {
        title: "Immunotherapy combinations for advanced melanoma treatment",
        abstract: "Combination immunotherapy approaches show improved efficacy and survival outcomes in patients with advanced melanoma.",
        keywords: ["immunotherapy", "melanoma", "checkpoint inhibitors", "combination therapy", "oncology"],
        f1000Id: "21-8901",
        url: "https://f1000research.com/articles/21-8901"
      },
      {
        title: "Precision medicine approaches in pediatric oncology",
        abstract: "Precision medicine strategies are transforming pediatric cancer treatment through genomic profiling and targeted therapies.",
        keywords: ["precision medicine", "pediatric oncology", "genomic profiling", "targeted therapy", "childhood cancer"],
        f1000Id: "22-2345",
        url: "https://f1000research.com/articles/22-2345"
      },
      {
        title: "Mental health interventions using virtual reality technology",
        abstract: "Virtual reality-based interventions show promising results for treating anxiety, PTSD, and other mental health conditions.",
        keywords: ["virtual reality", "mental health", "anxiety", "PTSD", "digital therapeutics"],
        f1000Id: "23-6789",
        url: "https://f1000research.com/articles/23-6789"
      },
      {
        title: "Stem cell therapy for cardiac regeneration after myocardial infarction",
        abstract: "Stem cell-based therapies offer potential for cardiac tissue regeneration and functional recovery following heart attacks.",
        keywords: ["stem cell therapy", "cardiac regeneration", "myocardial infarction", "tissue engineering", "cardiology"],
        f1000Id: "24-0123",
        url: "https://f1000research.com/articles/24-0123"
      },
      {
        title: "Antibiotic resistance patterns in hospital-acquired infections",
        abstract: "Surveillance of antibiotic resistance patterns is essential for guiding empirical therapy and infection control measures.",
        keywords: ["antibiotic resistance", "hospital-acquired infections", "surveillance", "antimicrobial stewardship", "infectious diseases"],
        f1000Id: "25-4567",
        url: "https://f1000research.com/articles/25-4567"
      },
      {
        title: "Nanotechnology applications in targeted drug delivery systems",
        abstract: "Nanotechnology-based drug delivery systems enable targeted therapy with reduced side effects and improved therapeutic efficacy.",
        keywords: ["nanotechnology", "drug delivery", "targeted therapy", "nanoparticles", "pharmaceutical sciences"],
        f1000Id: "26-8901",
        url: "https://f1000research.com/articles/26-8901"
      },
      {
        title: "Genomic analysis of rare genetic disorders using whole exome sequencing",
        abstract: "Whole exome sequencing facilitates diagnosis and understanding of rare genetic disorders through comprehensive genomic analysis.",
        keywords: ["whole exome sequencing", "rare diseases", "genetic disorders", "genomics", "molecular diagnostics"],
        f1000Id: "27-2345",
        url: "https://f1000research.com/articles/27-2345"
      }
    ];

    console.log(`\n📝 Creating ${additionalArticles.length} additional articles...`);

    let created = 0;
    for (const articleData of additionalArticles) {
      try {
        // Check if article already exists
        const existing = await prisma.manuscript.findFirst({
          where: { title: articleData.title }
        });

        if (existing) {
          console.log(`   ⏭️  Skipped: ${articleData.title.substring(0, 50)}... (already exists)`);
          continue;
        }

        // Create authors (simplified - just use generic author names)
        const authorNames = [
          "Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emily Rodriguez", 
          "Dr. David Kim", "Dr. Lisa Wang", "Dr. James Smith",
          "Dr. Maria Garcia", "Dr. Robert Brown", "Dr. Jennifer Davis"
        ];
        
        const selectedAuthors = authorNames.slice(0, Math.floor(Math.random() * 3) + 1);
        const authorRecords = [];

        for (const authorName of selectedAuthors) {
          let author = await prisma.author.findFirst({
            where: { name: authorName }
          });

          if (!author) {
            author = await prisma.author.create({
              data: {
                name: authorName,
                affiliation: 'Research Institute'
              }
            });
          }
          authorRecords.push(author);
        }

        // Create manuscript
        const manuscript = await prisma.manuscript.create({
          data: {
            title: articleData.title,
            abstract: articleData.abstract,
            keywords: articleData.keywords,
            status: 'PUBLISHED',
            authors: {
              connect: authorRecords.map(author => ({ id: author.id }))
            }
          }
        });

        // Create manuscript source link
        await prisma.manuscriptSource.create({
          data: {
            manuscriptId: manuscript.id,
            sourceId: f1000Source.id,
            externalId: articleData.f1000Id,
            url: articleData.url,
            articleType: 'Research Article',
            peerReviewStatus: 'Peer reviewed',
            isImported: true,
            metadata: {
              createdAt: new Date().toISOString(),
              source: 'pagination-data-script'
            }
          }
        });

        created++;
        console.log(`   ✅ Created: ${articleData.title.substring(0, 50)}...`);

      } catch (error) {
        console.error(`   ❌ Error creating article "${articleData.title}":`, error);
      }
    }

    // Final count
    const totalCount = await prisma.manuscript.count();
    console.log(`\n🎉 Pagination data creation complete!`);
    console.log(`   Articles created: ${created}`);
    console.log(`   Total manuscripts in database: ${totalCount}`);
    
    if (totalCount >= 20) {
      console.log(`   ✅ Perfect! You now have ${totalCount} articles for pagination`);
      console.log(`   💡 Suggested pagination: 10 articles per page = ${Math.ceil(totalCount / 10)} pages`);
    } else {
      console.log(`   ✅ Good! You have ${totalCount} articles for basic pagination`);
    }

  } catch (error) {
    console.error('❌ Error creating pagination data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createPaginationData()
  .catch((error) => {
    console.error('Pagination data creation failed:', error);
    process.exit(1);
  });
