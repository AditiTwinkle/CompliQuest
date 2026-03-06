import { WebScrapingAgent, ScrapingConfig, RegulatoryContent } from './webScraper';
import { logger } from '../utils/logger';
import { config } from '../config/environment';
import { Requirement, RequirementCategory, SeverityLevel } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * DORA-specific scraper with hardcoded selectors and URLs for the hackathon MVP
 * Targets the official EU DORA regulation document
 */
export class DoraScraper {
  private webScraper: WebScrapingAgent;

  // Hardcoded DORA URLs for reliable scraping
  private static readonly DORA_URLS = {
    main: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554',
    html: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2554',
    // Fallback URLs in case primary fails
    fallback: [
      'https://eur-lex.europa.eu/eli/reg/2022/2554/oj',
      'https://digital-strategy.ec.europa.eu/en/policies/dora'
    ]
  };

  // Hardcoded DORA-specific content selectors
  private static readonly DORA_SELECTORS = {
    // EU legal document structure selectors
    articleSelector: [
      'div.eli-subdivision[data-eli-subdivision-type="art"]',
      'div[id*="art"]',
      'div.article',
      '.eli-subdivision-art',
      'section[class*="article"]'
    ].join(', '),
    
    titleSelector: [
      '.eli-title',
      '.article-title', 
      'h1',
      'h2',
      'h3',
      '.title',
      '.heading'
    ].join(', '),
    
    contentSelector: [
      '.eli-content',
      '.article-content',
      'p',
      '.content',
      '.text'
    ].join(', '),
    
    sectionSelector: [
      '.eli-subdivision[data-eli-subdivision-type="par"]',
      '.paragraph',
      '.section'
    ].join(', ')
  };

  constructor() {
    this.webScraper = new WebScrapingAgent();
  }

  /**
   * Scrape DORA requirements from official EU documentation
   * FOR DEMO: Uses cached knowledge base for instant response
   */
  async scrapeDORARequirements(): Promise<RegulatoryContent> {
    logger.info('Starting DORA requirements scraping (using cached knowledge base for fast demo)');

    try {
      // Try to load from cache first for instant response
      const cachedData = await this.loadFromCache();
      if (cachedData) {
        logger.info('Loaded DORA requirements from cache', {
          requirementsCount: cachedData.requirements.length,
          cacheVersion: cachedData.metadata?.cacheVersion || 'unknown'
        });
        return cachedData;
      }
    } catch (error) {
      logger.warn('Failed to load from cache, using mock data', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Fallback to mock data if cache fails
    logger.info('Using mock DORA data as fallback');
    return this.getMockDORAData();
  }

  /**
   * Load DORA requirements from cached knowledge base
   */
  private async loadFromCache(): Promise<RegulatoryContent | null> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const cachePath = path.join(__dirname, '../../knowledge-base/dora-requirements-cache.json');
      const cacheData = await fs.readFile(cachePath, 'utf-8');
      const parsed = JSON.parse(cacheData);
      
      // Convert to RegulatoryContent format
      return {
        id: parsed.id,
        framework: parsed.framework,
        sourceUrl: parsed.sourceUrl,
        extractedAt: new Date(parsed.extractedAt),
        requirements: parsed.requirements,
        metadata: parsed.metadata
      };
    } catch (error) {
      logger.warn('Cache file not found or invalid', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  /**
   * Fallback extraction method with alternative URLs and mock data
   */
  private async fallbackExtraction(): Promise<RegulatoryContent> {
    logger.info('Attempting fallback DORA extraction');

    // Try alternative URLs
    for (const fallbackUrl of DoraScraper.DORA_URLS.fallback) {
      try {
        const scrapingConfig: ScrapingConfig = {
          targetUrl: fallbackUrl,
          framework: 'DORA',
          selectors: {
            articleSelector: DoraScraper.DORA_SELECTORS.articleSelector,
            titleSelector: DoraScraper.DORA_SELECTORS.titleSelector,
            contentSelector: DoraScraper.DORA_SELECTORS.contentSelector,
          },
        };

        const content = await this.webScraper.scrapeRegulatory(scrapingConfig);
        const validation = this.webScraper.validateExtraction(content);
        
        if (validation.isValid) {
          logger.info('Fallback DORA extraction successful', { url: fallbackUrl });
          return this.enhanceDORARequirements(content);
        }
      } catch (error) {
        logger.warn('Fallback URL failed', { 
          url: fallbackUrl, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        continue;
      }
    }

    // If all URLs fail, return mock DORA data for demo purposes
    logger.warn('All DORA URLs failed, returning mock data for demo');
    return this.getMockDORAData();
  }

  /**
   * Enhance DORA requirements with specific categorization and metadata
   */
  private enhanceDORARequirements(content: RegulatoryContent): RegulatoryContent {
    const enhancedRequirements = content.requirements.map(req => {
      // Enhanced DORA-specific categorization
      const category = this.categorizeDORARequirement(req.title, req.description);
      const severity = this.assessDORASeverity(req.title, req.description, category);
      const keywords = this.extractDORAKeywords(req.title, req.description);

      return {
        ...req,
        category,
        severity,
        keywords: [...new Set([...req.keywords, ...keywords])], // Merge and deduplicate
        mandatory: this.isDORAMandatory(req.title, req.description),
      };
    });

    return {
      ...content,
      requirements: enhancedRequirements,
      metadata: {
        ...content.metadata,
        totalArticles: enhancedRequirements.length,
      }
    };
  }

  /**
   * DORA-specific requirement categorization
   */
  private categorizeDORARequirement(title: string, description: string): RequirementCategory {
    const content = (title + ' ' + description).toLowerCase();

    // ICT Risk Management (Articles 5-15)
    if (content.match(/ict.*risk|information.*technology.*risk|cyber.*risk|digital.*risk/)) {
      return RequirementCategory.ICT_RISK_MANAGEMENT;
    }

    // Governance (Articles 5-7)
    if (content.match(/governance|management.*framework|oversight|board|senior.*management/)) {
      return RequirementCategory.GOVERNANCE;
    }

    // Incident Reporting (Articles 17-23)
    if (content.match(/incident|notification|reporting|major.*ict|disruption/)) {
      return RequirementCategory.INCIDENT_REPORTING;
    }

    // Third Party Risk (Articles 28-44)
    if (content.match(/third.*party|outsourcing|service.*provider|contractual|supplier/)) {
      return RequirementCategory.THIRD_PARTY_RISK;
    }

    // Testing (Articles 24-27)
    if (content.match(/testing|assessment|penetration|vulnerability|threat.*led/)) {
      return RequirementCategory.TESTING;
    }

    return RequirementCategory.OPERATIONAL_RESILIENCE;
  }

  /**
   * DORA-specific severity assessment
   */
  private assessDORASeverity(title: string, description: string, category: RequirementCategory): SeverityLevel {
    const content = (title + ' ' + description).toLowerCase();

    // Critical for core ICT risk management and incident reporting
    if ((category === RequirementCategory.ICT_RISK_MANAGEMENT || 
         category === RequirementCategory.INCIDENT_REPORTING) &&
        (content.includes('shall') || content.includes('must'))) {
      return SeverityLevel.CRITICAL;
    }

    // High for mandatory requirements
    if (content.includes('shall') || content.includes('must') || content.includes('required')) {
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
   * Extract DORA-specific keywords
   */
  private extractDORAKeywords(title: string, description: string): string[] {
    const content = (title + ' ' + description).toLowerCase();
    const keywords: string[] = [];

    const doraKeywords = [
      'operational resilience',
      'ict risk management',
      'digital operational resilience',
      'incident reporting',
      'third party risk',
      'outsourcing',
      'penetration testing',
      'vulnerability assessment',
      'threat intelligence',
      'business continuity',
      'disaster recovery',
      'cyber security',
      'information security',
      'risk tolerance',
      'risk appetite',
      'governance framework',
      'senior management',
      'board oversight',
      'contractual arrangements',
      'service level agreements',
      'exit strategies',
      'concentration risk',
      'critical functions',
      'important business services'
    ];

    doraKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    return keywords;
  }

  /**
   * Check if DORA requirement is mandatory
   */
  private isDORAMandatory(title: string, description: string): boolean {
    const content = (title + ' ' + description).toLowerCase();
    
    // DORA uses specific mandatory language
    return content.includes('shall') || 
           content.includes('must') || 
           content.includes('required') ||
           content.includes('obligation') ||
           content.includes('ensure that');
  }

  /**
   * Mock DORA data for demo purposes when scraping fails
   */
  private getMockDORAData(): RegulatoryContent {
    logger.info('Generating mock DORA data for demo');

    const mockRequirements: Requirement[] = [
      {
        id: uuidv4(),
        frameworkId: 'DORA',
        sectionNumber: 'Article 5',
        title: 'ICT risk management framework',
        description: 'Financial entities shall have a sound, comprehensive and well-documented ICT risk management framework as part of their overall risk management system, which enables them to address ICT risk quickly, efficiently and comprehensively and to ensure a high level of digital operational resilience.',
        category: RequirementCategory.ICT_RISK_MANAGEMENT,
        mandatory: true,
        severity: SeverityLevel.CRITICAL,
        keywords: ['ict risk management', 'operational resilience', 'risk management framework'],
        relatedRequirements: [],
      },
      {
        id: uuidv4(),
        frameworkId: 'DORA',
        sectionNumber: 'Article 6',
        title: 'Governance and organisation',
        description: 'Financial entities shall have in place an internal governance and control framework that ensures an effective and prudent management of ICT risk in accordance with the three lines of defence model or an internal risk management and control model.',
        category: RequirementCategory.GOVERNANCE,
        mandatory: true,
        severity: SeverityLevel.HIGH,
        keywords: ['governance', 'internal control', 'three lines of defence'],
        relatedRequirements: [],
      },
      {
        id: uuidv4(),
        frameworkId: 'DORA',
        sectionNumber: 'Article 17',
        title: 'Classification of ICT-related incidents',
        description: 'Financial entities shall classify ICT-related incidents and shall determine the relevant materiality threshold for major ICT-related incidents based on criteria set out in regulatory technical standards.',
        category: RequirementCategory.INCIDENT_REPORTING,
        mandatory: true,
        severity: SeverityLevel.CRITICAL,
        keywords: ['incident classification', 'materiality threshold', 'major incidents'],
        relatedRequirements: [],
      },
      {
        id: uuidv4(),
        frameworkId: 'DORA',
        sectionNumber: 'Article 28',
        title: 'General principles for ICT third-party risk',
        description: 'Financial entities shall manage ICT third-party risk as an integral component of ICT risk within their ICT risk management framework and shall ensure that their use of ICT services supporting critical or important functions does not impair their ability to deliver services continuously.',
        category: RequirementCategory.THIRD_PARTY_RISK,
        mandatory: true,
        severity: SeverityLevel.HIGH,
        keywords: ['third party risk', 'ict services', 'critical functions', 'important functions'],
        relatedRequirements: [],
      },
      {
        id: uuidv4(),
        frameworkId: 'DORA',
        sectionNumber: 'Article 24',
        title: 'General requirements for digital operational resilience testing',
        description: 'Financial entities shall establish, maintain and review a comprehensive digital operational resilience testing programme as an integral part of the ICT risk management framework.',
        category: RequirementCategory.TESTING,
        mandatory: true,
        severity: SeverityLevel.MEDIUM,
        keywords: ['resilience testing', 'testing programme', 'ict risk management'],
        relatedRequirements: [],
      }
    ];

    return {
      id: uuidv4(),
      framework: 'DORA',
      sourceUrl: 'mock://dora-requirements',
      extractedAt: new Date(),
      requirements: mockRequirements,
      metadata: {
        totalArticles: mockRequirements.length,
        extractionDuration: 0,
        parsingErrors: ['Using mock data - scraping failed'],
      }
    };
  }
}

export const doraScraper = new DoraScraper();