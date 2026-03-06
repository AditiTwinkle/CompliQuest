const { doraScraper } = require('./dist/services/doraScraper');

async function testDoraScraper() {
  console.log('Testing DORA scraper...');
  
  try {
    const result = await doraScraper.scrapeDORARequirements();
    
    console.log('✅ DORA scraping successful!');
    console.log(`📊 Requirements extracted: ${result.requirements.length}`);
    console.log(`🔗 Source URL: ${result.sourceUrl}`);
    console.log(`⏱️  Extraction time: ${result.metadata.extractionDuration}ms`);
    
    // Show first few requirements
    console.log('\n📋 Sample requirements:');
    result.requirements.slice(0, 3).forEach((req, index) => {
      console.log(`${index + 1}. ${req.sectionNumber}: ${req.title}`);
      console.log(`   Category: ${req.category}`);
      console.log(`   Severity: ${req.severity}`);
      console.log(`   Mandatory: ${req.mandatory}`);
      console.log('');
    });
    
    return result;
  } catch (error) {
    console.error('❌ DORA scraping failed:', error.message);
    throw error;
  }
}

testDoraScraper()
  .then(() => {
    console.log('🎉 Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });