import { NextResponse } from 'next/server';
import { ProgrammaticBulkScraper } from '../../../../../scraper/run-bulk-scraper';

export async function GET(request: Request) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🕐 Starting daily scraping job...');
    
    // Configure scraping for daily job (smaller batch to avoid timeouts)
    const config = {
      baseUrl: 'https://f1000research.com/browse/articles?term=Medical_and_health_sciences',
      maxPages: 5, // Smaller batch for daily runs
      delayMs: 1500, // Faster for cron jobs
      maxRetries: 2,
      batchSize: 3,
    };

    const scraper = new ProgrammaticBulkScraper(config);
    await scraper.run();

    console.log('✅ Daily scraping job completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Daily scraping completed',
      timestamp: new Date().toISOString(),
      config
    });

  } catch (error) {
    console.error('❌ Daily scraping job failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Also allow POST for manual triggers
export async function POST(request: Request) {
  return GET(request);
}
