import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ProgrammaticBulkScraper } from '../../../../../scripts/run-bulk-scraper';

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const session = await auth();
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      pages = 5,
      delay = 2000,
      batchSize = 5,
      url
    } = body;

    console.log('🚀 Starting manual scraping job...');
    
    // Configure scraping based on request parameters
    const config = {
      baseUrl: url || 'https://f1000research.com/browse/articles?term=Medical_and_health_sciences',
      maxPages: Math.min(pages, 20), // Cap at 20 pages to avoid timeouts
      delayMs: Math.max(delay, 1000), // Minimum 1 second delay
      maxRetries: 3,
      batchSize: Math.min(batchSize, 10), // Cap batch size
    };

    const scraper = new ProgrammaticBulkScraper(config);
    await scraper.run();

    console.log('✅ Manual scraping job completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Manual scraping completed',
      timestamp: new Date().toISOString(),
      config
    });

  } catch (error) {
    console.error('❌ Manual scraping job failed:', error);
    
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
