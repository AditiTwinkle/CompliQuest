import { DoraScraper } from '../services/doraScraper';
import { RequirementCategory, SeverityLevel } from '../types';

describe('DoraScraper', () => {
  let doraScraper: DoraScraper;

  beforeEach(() => {
    doraScraper = new DoraScraper();
  });

  describe('scrapeDORARequirements', () => {
    it('should extract DORA requirements successfully', async () => {
      // This test will use mock data if scraping fails
      const result = await doraScraper.scrapeDORARequirements();

      expect(result).toBeDefined();
      expect(result.framework).toBe('DORA');
      expect(result.requirements).toBeDefined();
      expect(result.requirements.length).toBeGreaterThan(0);
      expect(result.extractedAt).toBeInstanceOf(Date);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.totalArticles).toBe(result.requirements.length);
    });

    it('should extract requirements with proper structure', async () => {
      const result = await doraScraper.scrapeDORARequirements();

      // Check that all requirements have required fields
      result.requirements.forEach(req => {
        expect(req.id).toBeTruthy();
        expect(req.frameworkId).toBe('DORA');
        expect(req.title).toBeTruthy();
        expect(req.description).toBeTruthy();
        expect(req.sectionNumber).toBeTruthy();
        expect(Object.values(RequirementCategory)).toContain(req.category);
        expect(Object.values(SeverityLevel)).toContain(req.severity);
        expect(Array.isArray(req.keywords)).toBe(true);
        expect(typeof req.mandatory).toBe('boolean');
      });
    });

    it('should categorize requirements correctly', async () => {
      const result = await doraScraper.scrapeDORARequirements();

      // Should have different categories
      const categories = new Set(result.requirements.map(req => req.category));
      expect(categories.size).toBeGreaterThan(1);

      // Should include key DORA categories
      const categoryValues = Array.from(categories);
      expect(categoryValues).toContain(RequirementCategory.ICT_RISK_MANAGEMENT);
    });

    it('should assign appropriate severity levels', async () => {
      const result = await doraScraper.scrapeDORARequirements();

      // Should have requirements with different severity levels
      const severities = new Set(result.requirements.map(req => req.severity));
      expect(severities.size).toBeGreaterThan(1);

      // Should include high severity requirements
      const severityValues = Array.from(severities);
      expect(severityValues).toContain(SeverityLevel.HIGH);
    });

    it('should extract meaningful keywords', async () => {
      const result = await doraScraper.scrapeDORARequirements();

      // Should have requirements with keywords
      const requirementsWithKeywords = result.requirements.filter(req => req.keywords.length > 0);
      expect(requirementsWithKeywords.length).toBeGreaterThan(0);

      // Should include DORA-specific keywords
      const allKeywords = result.requirements.flatMap(req => req.keywords);
      const doraKeywords = allKeywords.filter(keyword => 
        keyword.includes('ict') || 
        keyword.includes('operational resilience') || 
        keyword.includes('risk management')
      );
      expect(doraKeywords.length).toBeGreaterThan(0);
    });

    it('should handle extraction errors gracefully', async () => {
      // This test ensures the scraper doesn't throw unhandled errors
      // and falls back to mock data when needed
      await expect(doraScraper.scrapeDORARequirements()).resolves.toBeDefined();
    });
  });
});

describe('DORA Content Validation', () => {
  it('should validate extracted content structure', async () => {
    const doraScraper = new DoraScraper();
    const content = await doraScraper.scrapeDORARequirements();

    // Basic structure validation
    expect(content.id).toBeTruthy();
    expect(content.framework).toBe('DORA');
    expect(content.sourceUrl).toBeTruthy();
    expect(content.extractedAt).toBeInstanceOf(Date);
    expect(Array.isArray(content.requirements)).toBe(true);
    expect(content.metadata).toBeDefined();
    expect(typeof content.metadata.totalArticles).toBe('number');
    expect(typeof content.metadata.extractionDuration).toBe('number');
    expect(Array.isArray(content.metadata.parsingErrors)).toBe(true);
  });

  it('should have requirements with complete metadata', async () => {
    const doraScraper = new DoraScraper();
    const content = await doraScraper.scrapeDORARequirements();

    content.requirements.forEach((req, index) => {
      expect(req.id).toBeTruthy();
      expect(req.title).toBeTruthy();
      expect(req.description).toBeTruthy();
      expect(req.description.length).toBeGreaterThan(10);
      expect(req.sectionNumber).toBeTruthy();
    });
  });
});