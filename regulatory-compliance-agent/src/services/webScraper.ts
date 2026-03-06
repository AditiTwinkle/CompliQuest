import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { logger } from '../utils/logger';
import { ScrapingError } from '../utils/errors';
import { RetryHandler } from '../utils/retry';
import { config } from '../config/environment';
import { Requirement, RequirementCategory, SeverityLevel } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface ScrapingConfig {
  targetUrl: string;
  framework: string;
  selectors?: ContentSelectors;
  rateLimit?: number;
}

export interface ContentSelectors {
  articleSelector: string;
  titleSelector: string;
  contentSelector: string;
  sectionSelector?: string;
}

export interface RegulatoryContent {
  id: string;
  framework: string;
  sourceUrl: string;
  extractedAt: Date;
  requirements: Requirement[];
  metadata: ContentMetadata;
}

export interface ContentMetadata {
  totalArticles: number;
  extractionDuration: number;
  parsingErrors: string[];
  lastModified?: Date;
}

export class WebScrapingAgent {
  private browser: Browser | null = null;
  private retryHandler: RetryHandler;

  constructor() {
    this.retryHandler = new RetryHandler({
      maxAttempts: config.scraping.maxRetryAttempts,
      baseDelayMs: config.scraping.retryBackoffMs,
    });
  }

  /**
   * Main scraping method that extracts regulatory requirements from DORA documentation
   */
  async scrapeRegulatory(scrapingConfig: ScrapingConfig): Promise<RegulatoryContent> {
    const startTime = Date.now();
    logger.info('Starting regulatory content scraping', {
      url: scrapingConfig.targetUrl,
      framework: scrapingConfig.framework,
    });

    try {
      await this.initializeBrowser();
      
      const content = await this.retryHandler.executeWithRetry(
        () => this.extractContent(scrapingConfig),
        `scraping-${scrapingConfig.framework}`
      );

      const requirements = await this.parseContent(content, scrapingConfig.framework);
      
      const extractionDuration = Date.now() - startTime;
      
      const result: RegulatoryContent = {
        id: uuidv4(),
        framework: scrapingConfig.framework,
        sourceUrl: scrapingConfig.targetUrl,
        extractedAt: new Date(),
        requirements,
        metadata: {
          totalArticles: requirements.length,
          extractionDuration,
          parsingErrors: [],
        },
      };

      logger.info('Regulatory content scraping completed', {
        framework: scrapingConfig.framework,
        requirementsExtracted: requirements.length,
        duration: extractionDuration,
      });

      return result;
    } catch (error) {
      logger.error('Regulatory content scraping failed', {
        url: scrapingConfig.targetUrl,
        framework: scrapingConfig.framework,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new ScrapingError(
        `Failed to scrape regulatory content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        scrapingConfig.targetUrl
      );
    } finally {
      await this.closeBrowser();
    }
  }

  /**
   * Initialize Puppeteer browser with appropriate configuration
   */
  private async initializeBrowser(): Promise<void> {
    if (this.browser) {
      return;
    }

    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      });
      logger.debug('Puppeteer browser initialized');
    } catch (error) {
      throw new ScrapingError(`Failed to initialize browser: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract raw content from the target URL
   */
  private async extractContent(scrapingConfig: ScrapingConfig): Promise<string> {
    if (!this.browser) {
      throw new ScrapingError('Browser not initialized');
    }

    const page = await this.browser.newPage();
    
    try {
      // Set user agent to avoid bot detection
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );

      // Navigate to the target URL
      logger.debug('Navigating to target URL', { url: scrapingConfig.targetUrl });
      
      await page.goto(scrapingConfig.targetUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Extract HTML content
      const content = await page.content();
      
      if (!content || content.length < 100) {
        throw new ScrapingError('Extracted content is too short or empty');
      }

      logger.debug('Content extracted successfully', {
        contentLength: content.length,
      });

      return content;
    } finally {
      await page.close();
      
      // Rate limiting
      if (scrapingConfig.rateLimit || config.scraping.rateLimitMs) {
        await new Promise(resolve => 
          setTimeout(resolve, scrapingConfig.rateLimit || config.scraping.rateLimitMs)
        );
      }
    }
  }

  /**
   * Parse HTML content and extract DORA requirements
   */
  async parseContent(htmlContent: string, framework: string): Promise<Requirement[]> {
    const $ = cheerio.load(htmlContent);
    const requirements: Requirement[] = [];
    const parsingErrors: string[] = [];

    logger.debug('Starting content parsing', { framework });

    try {
      // DORA-specific selectors for EU legal documents
      const selectors = this.getFrameworkSelectors(framework);
      
      // Extract articles and requirements
      $(selectors.articleSelector).each((index, element) => {
        try {
          const requirement = this.extractRequirementFromElement($, element, framework, index);
          if (requirement) {
            requirements.push(requirement);
          }
        } catch (error) {
          const errorMsg = `Failed to parse article ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          parsingErrors.push(errorMsg);
          logger.warn('Article parsing error', { index, error: errorMsg });
        }
      });

      // If no articles found with primary selector, try alternative approaches
      if (requirements.length === 0) {
        logger.warn('No requirements found with primary selectors, trying alternative extraction');
        const alternativeRequirements = this.extractWithAlternativeSelectors($, framework);
        requirements.push(...alternativeRequirements);
      }

      logger.info('Content parsing completed', {
        framework,
        requirementsFound: requirements.length,
        parsingErrors: parsingErrors.length,
      });

      return requirements;
    } catch (error) {
      throw new ScrapingError(`Content parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get framework-specific CSS selectors
   */
  private getFrameworkSelectors(framework: string): ContentSelectors {
    switch (framework.toUpperCase()) {
      case 'DORA':
        return {
          articleSelector: 'div.eli-subdivision[data-eli-subdivision-type="art"], .article, div[id*="art"], div[class*="article"]',
          titleSelector: '.eli-title, .article-title, h1, h2, h3, .title',
          contentSelector: '.eli-content, .article-content, p, .content',
          sectionSelector: '.eli-subdivision[data-eli-subdivision-type="par"], .paragraph, .section',
        };
      default:
        return {
          articleSelector: '.article, div[class*="article"], section',
          titleSelector: 'h1, h2, h3, .title, .heading',
          contentSelector: 'p, .content, .text',
        };
    }
  }

  /**
   * Extract requirement from a single HTML element
   */
  private extractRequirementFromElement(
    $: cheerio.CheerioAPI,
    element: cheerio.Element,
    framework: string,
    index: number
  ): Requirement | null {
    const $element = $(element);
    
    // Extract title
    const titleElement = $element.find('.eli-title, .article-title, h1, h2, h3').first();
    let title = titleElement.text().trim();
    
    if (!title) {
      // Fallback: use the first text content as title
      title = $element.contents().first().text().trim();
    }

    // Extract section number from title or element attributes
    const sectionNumber = this.extractSectionNumber(title, $element);
    
    // Extract content/description
    const contentElements = $element.find('p, .content, .eli-content').not('.eli-title, .article-title');
    let description = '';
    
    contentElements.each((_, contentEl) => {
      const text = $(contentEl).text().trim();
      if (text && text.length > 10) {
        description += text + ' ';
      }
    });

    description = description.trim();

    // Skip if no meaningful content
    if (!title && !description) {
      return null;
    }

    // Clean up title and description
    title = this.cleanText(title);
    description = this.cleanText(description);

    // Determine category and severity based on content
    const category = this.categorizeRequirement(title, description);
    const severity = this.assessSeverity(title, description, category);
    
    // Extract keywords
    const keywords = this.extractKeywords(title, description);

    const requirement: Requirement = {
      id: uuidv4(),
      frameworkId: framework,
      sectionNumber: sectionNumber || `Article ${index + 1}`,
      title: title || `Requirement ${index + 1}`,
      description: description || 'No description available',
      category,
      mandatory: this.isMandatory(title, description),
      severity,
      keywords,
      relatedRequirements: [],
    };

    return requirement;
  }

  /**
   * Alternative extraction method for different document structures
   */
  private extractWithAlternativeSelectors($: cheerio.CheerioAPI, framework: string): Requirement[] {
    const requirements: Requirement[] = [];
    
    // Try extracting from paragraphs with specific patterns
    $('p, div').each((index, element) => {
      const $element = $(element);
      const text = $element.text().trim();
      
      // Look for article patterns
      if (text.match(/^(Article|Art\.?)\s+\d+/i) && text.length > 50) {
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length >= 2) {
          const title = lines[0].trim();
          const description = lines.slice(1).join(' ').trim();
          
          const requirement: Requirement = {
            id: uuidv4(),
            frameworkId: framework,
            sectionNumber: this.extractSectionNumber(title, $element) || `Alt-${index + 1}`,
            title: this.cleanText(title),
            description: this.cleanText(description),
            category: this.categorizeRequirement(title, description),
            mandatory: this.isMandatory(title, description),
            severity: this.assessSeverity(title, description, RequirementCategory.OPERATIONAL_RESILIENCE),
            keywords: this.extractKeywords(title, description),
            relatedRequirements: [],
          };
          
          requirements.push(requirement);
        }
      }
    });

    return requirements;
  }

  /**
   * Extract section number from title or element
   */
  private extractSectionNumber(title: string, $element: cheerio.Cheerio<cheerio.Element>): string | null {
    // Try to extract from title
    const titleMatch = title.match(/(?:Article|Art\.?)\s+(\d+(?:\.\d+)*)/i);
    if (titleMatch) {
      return `Article ${titleMatch[1]}`;
    }

    // Try to extract from element attributes
    const id = $element.attr('id');
    if (id) {
      const idMatch = id.match(/art[_-]?(\d+(?:[_.-]\d+)*)/i);
      if (idMatch) {
        return `Article ${idMatch[1].replace(/[_-]/g, '.')}`;
      }
    }

    return null;
  }

  /**
   * Categorize requirement based on content
   */
  private categorizeRequirement(title: string, description: string): RequirementCategory {
    const content = (title + ' ' + description).toLowerCase();
    
    if (content.includes('ict risk') || content.includes('information technology') || content.includes('cyber')) {
      return RequirementCategory.ICT_RISK_MANAGEMENT;
    }
    
    if (content.includes('governance') || content.includes('management') || content.includes('oversight')) {
      return RequirementCategory.GOVERNANCE;
    }
    
    if (content.includes('incident') || content.includes('reporting') || content.includes('notification')) {
      return RequirementCategory.INCIDENT_REPORTING;
    }
    
    if (content.includes('third party') || content.includes('outsourcing') || content.includes('service provider')) {
      return RequirementCategory.THIRD_PARTY_RISK;
    }
    
    if (content.includes('testing') || content.includes('assessment') || content.includes('audit')) {
      return RequirementCategory.TESTING;
    }
    
    return RequirementCategory.OPERATIONAL_RESILIENCE;
  }

  /**
   * Assess severity level based on content
   */
  private assessSeverity(title: string, description: string, category: RequirementCategory): SeverityLevel {
    const content = (title + ' ' + description).toLowerCase();
    
    // Critical indicators
    if (content.includes('shall') || content.includes('must') || content.includes('required')) {
      if (content.includes('critical') || content.includes('essential') || content.includes('vital')) {
        return SeverityLevel.CRITICAL;
      }
      return SeverityLevel.HIGH;
    }
    
    // High severity categories
    if (category === RequirementCategory.ICT_RISK_MANAGEMENT || 
        category === RequirementCategory.INCIDENT_REPORTING) {
      return SeverityLevel.HIGH;
    }
    
    // Medium for governance and testing
    if (category === RequirementCategory.GOVERNANCE || 
        category === RequirementCategory.TESTING) {
      return SeverityLevel.MEDIUM;
    }
    
    return SeverityLevel.MEDIUM;
  }

  /**
   * Check if requirement is mandatory
   */
  private isMandatory(title: string, description: string): boolean {
    const content = (title + ' ' + description).toLowerCase();
    return content.includes('shall') || content.includes('must') || content.includes('required');
  }

  /**
   * Extract keywords from content
   */
  private extractKeywords(title: string, description: string): string[] {
    const content = (title + ' ' + description).toLowerCase();
    const keywords: string[] = [];
    
    const keywordPatterns = [
      'ict risk', 'operational resilience', 'cyber security', 'incident reporting',
      'third party', 'outsourcing', 'testing', 'governance', 'management',
      'notification', 'assessment', 'audit', 'monitoring', 'compliance'
    ];
    
    keywordPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        keywords.push(pattern);
      }
    });
    
    return keywords;
  }

  /**
   * Clean and normalize text content
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, ' ')
      .trim();
  }

  /**
   * Close the browser instance
   */
  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.debug('Puppeteer browser closed');
    }
  }

  /**
   * Validate extracted content for completeness
   */
  validateExtraction(content: RegulatoryContent): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!content.requirements || content.requirements.length === 0) {
      errors.push('No requirements extracted');
    }
    
    if (!content.sourceUrl) {
      errors.push('Missing source URL');
    }
    
    if (!content.framework) {
      errors.push('Missing framework identifier');
    }
    
    // Validate individual requirements
    content.requirements.forEach((req, index) => {
      if (!req.title || req.title.trim().length === 0) {
        errors.push(`Requirement ${index + 1}: Missing title`);
      }
      
      if (!req.description || req.description.trim().length < 10) {
        errors.push(`Requirement ${index + 1}: Description too short or missing`);
      }
      
      if (!req.sectionNumber) {
        errors.push(`Requirement ${index + 1}: Missing section number`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const webScrapingAgent = new WebScrapingAgent();