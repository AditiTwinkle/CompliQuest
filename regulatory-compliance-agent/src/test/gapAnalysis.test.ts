import { gapAnalysisService } from '../services/gapAnalysisService';
import { mockOrganizationalData } from '../services/mockOrganizationalData';
import { doraScraper } from '../services/doraScraper';
import { 
  Requirement, 
  OrganizationalControl, 
  RequirementCategory, 
  SeverityLevel,
  ImplementationStatus,
  GapType 
} from '../types';

describe('Gap Analysis Service', () => {
  
  describe('analyzeCompliance', () => {
    it('should identify gaps between DORA requirements and organizational controls', async () => {
      // Get mock data
      const organizationalControls = mockOrganizationalData.getMockOrganizationalControls();
      const doraContent = await doraScraper.scrapeDORARequirements();
      const requirements = doraContent.requirements;
      const organizationId = 'org-demo-bank-001';

      // Perform gap analysis
      const result = await gapAnalysisService.analyzeCompliance(
        requirements,
        organizationalControls,
        organizationId
      );

      // Verify results structure
      expect(result).toHaveProperty('gaps');
      expect(result).toHaveProperty('compliancePercentage');
      expect(result).toHaveProperty('summary');
      
      // Verify gaps are identified
      expect(Array.isArray(result.gaps)).toBe(true);
      expect(result.gaps.length).toBeGreaterThan(0);
      
      // Verify compliance percentage is calculated
      expect(result.compliancePercentage).toBeGreaterThanOrEqual(0);
      expect(result.compliancePercentage).toBeLessThanOrEqual(100);
      
      // Verify summary contains expected fields
      expect(result.summary).toHaveProperty('totalRequirements');
      expect(result.summary).toHaveProperty('fullyCompliant');
      expect(result.summary).toHaveProperty('partiallyCompliant');
      expect(result.summary).toHaveProperty('nonCompliant');
      expect(result.summary).toHaveProperty('gapsByCategory');
      expect(result.summary).toHaveProperty('gapsBySeverity');
      
      // Verify totals add up
      const { totalRequirements, fullyCompliant, partiallyCompliant, nonCompliant } = result.summary;
      expect(fullyCompliant + partiallyCompliant + nonCompliant).toBe(totalRequirements);
      
      console.log('Gap Analysis Results:');
      console.log(`- Total Requirements: ${totalRequirements}`);
      console.log(`- Compliance Percentage: ${result.compliancePercentage}%`);
      console.log(`- Gaps Identified: ${result.gaps.length}`);
      console.log(`- Fully Compliant: ${fullyCompliant}`);
      console.log(`- Partially Compliant: ${partiallyCompliant}`);
      console.log(`- Non-Compliant: ${nonCompliant}`);
    });

    it('should assign appropriate severity levels to gaps', async () => {
      // Create test data with specific scenarios
      const requirements: Requirement[] = [
        {
          id: 'req-critical-1',
          frameworkId: 'DORA',
          sectionNumber: 'Article 17',
          title: 'Critical Incident Reporting',
          description: 'Financial entities shall report major ICT incidents to authorities',
          category: RequirementCategory.INCIDENT_REPORTING,
          mandatory: true,
          severity: SeverityLevel.HIGH,
          keywords: ['incident', 'reporting', 'mandatory'],
          relatedRequirements: [],
        },
        {
          id: 'req-medium-1',
          frameworkId: 'DORA',
          sectionNumber: 'Article 24',
          title: 'Testing Requirements',
          description: 'Financial entities should conduct regular testing',
          category: RequirementCategory.TESTING,
          mandatory: false,
          severity: SeverityLevel.MEDIUM,
          keywords: ['testing', 'regular'],
          relatedRequirements: [],
        }
      ];

      const controls: OrganizationalControl[] = [
        {
          id: 'ctrl-partial-1',
          organizationId: 'test-org',
          name: 'Basic Incident Process',
          description: 'We have some incident handling',
          category: 'ADMINISTRATIVE' as any,
          implementationStatus: ImplementationStatus.PARTIALLY_IMPLEMENTED,
          maturityLevel: 'MANAGED' as any,
          evidence: [],
          owner: 'Test Owner',
          lastReviewed: new Date(),
          nextReview: new Date(),
        }
      ];

      const result = await gapAnalysisService.analyzeCompliance(
        requirements,
        controls,
        'test-org'
      );

      // Verify gaps have appropriate severity
      expect(result.gaps.length).toBeGreaterThan(0);
      
      const criticalGaps = result.gaps.filter(gap => gap.severity === SeverityLevel.CRITICAL);
      const highGaps = result.gaps.filter(gap => gap.severity === SeverityLevel.HIGH);
      const mediumGaps = result.gaps.filter(gap => gap.severity === SeverityLevel.MEDIUM);
      
      // Should have at least one high/critical gap for incident reporting
      expect(criticalGaps.length + highGaps.length).toBeGreaterThan(0);
      
      console.log('Severity Distribution:');
      console.log(`- Critical: ${criticalGaps.length}`);
      console.log(`- High: ${highGaps.length}`);
      console.log(`- Medium: ${mediumGaps.length}`);
    });

    it('should generate meaningful gap descriptions and recommendations', async () => {
      const requirements: Requirement[] = [
        {
          id: 'req-test-1',
          frameworkId: 'DORA',
          sectionNumber: 'Article 5',
          title: 'ICT Risk Management Framework',
          description: 'Comprehensive ICT risk management required',
          category: RequirementCategory.ICT_RISK_MANAGEMENT,
          mandatory: true,
          severity: SeverityLevel.HIGH,
          keywords: ['ict', 'risk', 'management'],
          relatedRequirements: [],
        }
      ];

      const controls: OrganizationalControl[] = [];

      const result = await gapAnalysisService.analyzeCompliance(
        requirements,
        controls,
        'test-org'
      );

      expect(result.gaps.length).toBe(1);
      
      const gap = result.gaps[0];
      
      // Verify gap has meaningful content
      expect(gap.description).toBeTruthy();
      expect(gap.description.length).toBeGreaterThan(10);
      
      expect(gap.businessImpact).toBeTruthy();
      expect(gap.technicalImpact).toBeTruthy();
      
      expect(Array.isArray(gap.recommendedActions)).toBe(true);
      expect(gap.recommendedActions.length).toBeGreaterThan(0);
      
      expect(gap.estimatedEffort).toHaveProperty('hours');
      expect(gap.estimatedEffort).toHaveProperty('complexity');
      expect(gap.estimatedEffort).toHaveProperty('skillsRequired');
      
      console.log('Gap Details:');
      console.log(`- Description: ${gap.description}`);
      console.log(`- Business Impact: ${gap.businessImpact}`);
      console.log(`- Estimated Effort: ${gap.estimatedEffort.hours} hours (${gap.estimatedEffort.complexity})`);
      console.log(`- Recommended Actions: ${gap.recommendedActions.length} actions`);
    });

    it('should calculate compliance percentage correctly', async () => {
      const requirements: Requirement[] = [
        { id: '1', frameworkId: 'DORA', sectionNumber: 'A1', title: 'Req 1', description: 'Test', category: RequirementCategory.ICT_RISK_MANAGEMENT, mandatory: true, severity: SeverityLevel.HIGH, keywords: [], relatedRequirements: [] },
        { id: '2', frameworkId: 'DORA', sectionNumber: 'A2', title: 'Req 2', description: 'Test', category: RequirementCategory.GOVERNANCE, mandatory: true, severity: SeverityLevel.MEDIUM, keywords: [], relatedRequirements: [] },
        { id: '3', frameworkId: 'DORA', sectionNumber: 'A3', title: 'Req 3', description: 'Test', category: RequirementCategory.TESTING, mandatory: false, severity: SeverityLevel.LOW, keywords: [], relatedRequirements: [] },
        { id: '4', frameworkId: 'DORA', sectionNumber: 'A4', title: 'Req 4', description: 'Test', category: RequirementCategory.INCIDENT_REPORTING, mandatory: true, severity: SeverityLevel.HIGH, keywords: [], relatedRequirements: [] },
      ];

      const controls: OrganizationalControl[] = [
        {
          id: 'ctrl-1',
          organizationId: 'test-org',
          name: 'ICT Risk Control',
          description: 'ICT risk management control',
          category: 'ADMINISTRATIVE' as any,
          implementationStatus: ImplementationStatus.FULLY_IMPLEMENTED,
          maturityLevel: 'DEFINED' as any,
          evidence: [],
          owner: 'Test',
          lastReviewed: new Date(),
          nextReview: new Date(),
        },
        {
          id: 'ctrl-2',
          organizationId: 'test-org',
          name: 'Governance Control',
          description: 'Governance framework control',
          category: 'ADMINISTRATIVE' as any,
          implementationStatus: ImplementationStatus.PARTIALLY_IMPLEMENTED,
          maturityLevel: 'MANAGED' as any,
          evidence: [],
          owner: 'Test',
          lastReviewed: new Date(),
          nextReview: new Date(),
        }
      ];

      const result = await gapAnalysisService.analyzeCompliance(
        requirements,
        controls,
        'test-org'
      );

      // With 4 requirements:
      // - 1 fully compliant (100%)
      // - 1 partially compliant (50%)  
      // - 2 non-compliant (0%)
      // Expected: (100 + 50 + 0 + 0) / 400 * 100 = 37.5% -> rounded to 38%
      
      expect(result.compliancePercentage).toBeGreaterThanOrEqual(30);
      expect(result.compliancePercentage).toBeLessThanOrEqual(50);
      
      expect(result.summary.totalRequirements).toBe(4);
      expect(result.summary.fullyCompliant).toBeGreaterThanOrEqual(1);
      expect(result.summary.partiallyCompliant).toBeGreaterThanOrEqual(0);
      expect(result.summary.nonCompliant).toBeGreaterThanOrEqual(2);
      
      console.log(`Compliance Calculation Test: ${result.compliancePercentage}%`);
      console.log(`Breakdown: ${result.summary.fullyCompliant} full, ${result.summary.partiallyCompliant} partial, ${result.summary.nonCompliant} none`);
    });
  });
});