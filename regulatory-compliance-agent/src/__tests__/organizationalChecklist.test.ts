import { 
  mockOrganizationalData,
  MockOrganizationalDataService 
} from '../services/mockOrganizationalData';
import { 
  organizationalChecklistService,
  OrganizationalChecklistService 
} from '../services/organizationalChecklistService';
import { 
  ImplementationStatus, 
  MaturityLevel, 
  IndustryType,
  OrganizationSize,
  CompletionStatus 
} from '../types';

describe('Organizational Checklist Model', () => {
  let mockDataService: MockOrganizationalDataService;
  let checklistService: OrganizationalChecklistService;

  beforeEach(() => {
    mockDataService = new MockOrganizationalDataService();
    checklistService = new OrganizationalChecklistService();
  });

  describe('Mock Organization Data', () => {
    it('should provide a valid mock organization', () => {
      const organization = mockDataService.getMockOrganization();
      
      expect(organization).toBeDefined();
      expect(organization.id).toBe('org-demo-bank-001');
      expect(organization.name).toBe('Demo Financial Services Ltd');
      expect(organization.industry).toBe(IndustryType.BANKING);
      expect(organization.size).toBe(OrganizationSize.MEDIUM);
      expect(organization.jurisdiction).toBe('EU');
      expect(organization.regulatoryFrameworks).toContain('dora-2022');
    });

    it('should provide a valid DORA framework', () => {
      const framework = mockDataService.getMockDORAFramework();
      
      expect(framework).toBeDefined();
      expect(framework.id).toBe('dora-2022');
      expect(framework.name).toBe('Digital Operational Resilience Act');
      expect(framework.jurisdiction).toBe('EU');
      expect(framework.effectiveDate).toBeInstanceOf(Date);
    });

    it('should provide organizational controls with various implementation statuses', () => {
      const controls = mockDataService.getMockOrganizationalControls();
      
      expect(controls).toBeDefined();
      expect(controls.length).toBeGreaterThan(0);
      
      // Should have controls in different implementation states
      const fullyImplemented = controls.filter(c => c.implementationStatus === ImplementationStatus.FULLY_IMPLEMENTED);
      const partiallyImplemented = controls.filter(c => c.implementationStatus === ImplementationStatus.PARTIALLY_IMPLEMENTED);
      const notImplemented = controls.filter(c => c.implementationStatus === ImplementationStatus.NOT_IMPLEMENTED);
      
      expect(fullyImplemented.length).toBeGreaterThan(0);
      expect(partiallyImplemented.length).toBeGreaterThan(0);
      expect(notImplemented.length).toBeGreaterThan(0);
      
      // Each control should have required fields
      controls.forEach(control => {
        expect(control.id).toBeTruthy();
        expect(control.name).toBeTruthy();
        expect(control.description).toBeTruthy();
        expect(control.owner).toBeTruthy();
        expect(control.organizationId).toBe('org-demo-bank-001');
      });
    });

    it('should provide a complete organizational checklist', () => {
      const checklist = mockDataService.getMockOrganizationalChecklist();
      
      expect(checklist).toBeDefined();
      expect(checklist.id).toBeTruthy();
      expect(checklist.organizationId).toBe('org-demo-bank-001');
      expect(checklist.organizationName).toBe('Demo Financial Services Ltd');
      expect(checklist.framework).toBeDefined();
      expect(checklist.controls).toBeDefined();
      expect(checklist.controls.length).toBeGreaterThan(0);
      expect(checklist.completionStatus).toBe(CompletionStatus.IN_PROGRESS);
      expect(checklist.overallMaturity).toBe(MaturityLevel.MANAGED);
      expect(checklist.compliancePercentage).toBeGreaterThanOrEqual(0);
      expect(checklist.compliancePercentage).toBeLessThanOrEqual(100);
    });

    it('should provide realistic compliance gaps', () => {
      const gaps = mockDataService.getMockIdentifiedGaps();
      
      expect(gaps).toBeDefined();
      expect(gaps.length).toBeGreaterThan(0);
      
      gaps.forEach(gap => {
        expect(gap.category).toBeTruthy();
        expect(gap.severity).toBeTruthy();
        expect(gap.description).toBeTruthy();
        expect(gap.controlId).toBeTruthy();
      });
    });
  });

  describe('Organizational Checklist Service', () => {
    it('should retrieve organizational checklist for demo organization', async () => {
      const checklist = await checklistService.getOrganizationalChecklist('org-demo-bank-001', 'dora-2022');
      
      expect(checklist).toBeDefined();
      expect(checklist?.organizationId).toBe('org-demo-bank-001');
      expect(checklist?.framework.id).toBe('dora-2022');
    });

    it('should return null for unknown organization', async () => {
      const checklist = await checklistService.getOrganizationalChecklist('unknown-org', 'dora-2022');
      expect(checklist).toBeNull();
    });

    it('should calculate compliance status correctly', async () => {
      const status = await checklistService.calculateComplianceStatus('org-demo-bank-001', 'dora-2022');
      
      expect(status).toBeDefined();
      expect(status.organizationId).toBe('org-demo-bank-001');
      expect(status.frameworkId).toBe('dora-2022');
      expect(status.totalControls).toBeGreaterThan(0);
      expect(status.compliancePercentage).toBeGreaterThanOrEqual(0);
      expect(status.compliancePercentage).toBeLessThanOrEqual(100);
      expect(status.lastAssessment).toBeInstanceOf(Date);
      expect(status.nextAssessment).toBeInstanceOf(Date);
      
      // Verify the math
      const expectedTotal = status.implementedControls + status.partiallyImplementedControls + status.notImplementedControls;
      expect(status.totalControls).toBe(expectedTotal);
    });

    it('should filter controls by implementation status', async () => {
      const notImplementedControls = await checklistService.getControlsByStatus(
        'org-demo-bank-001', 
        ImplementationStatus.NOT_IMPLEMENTED
      );
      
      expect(notImplementedControls).toBeDefined();
      notImplementedControls.forEach(control => {
        expect(control.implementationStatus).toBe(ImplementationStatus.NOT_IMPLEMENTED);
      });
    });

    it('should filter controls by maturity level', async () => {
      const managedControls = await checklistService.getControlsByMaturity(
        'org-demo-bank-001',
        MaturityLevel.MANAGED
      );
      
      expect(managedControls).toBeDefined();
      managedControls.forEach(control => {
        expect(control.maturityLevel).toBe(MaturityLevel.MANAGED);
      });
    });

    it('should provide compliance summary', async () => {
      const summary = await checklistService.getComplianceSummary('org-demo-bank-001');
      
      expect(summary).toBeDefined();
      expect(summary.totalControls).toBeGreaterThan(0);
      expect(summary.fullyImplemented).toBeGreaterThanOrEqual(0);
      expect(summary.partiallyImplemented).toBeGreaterThanOrEqual(0);
      expect(summary.notImplemented).toBeGreaterThanOrEqual(0);
      expect(summary.byCategory).toBeDefined();
      
      // Verify the math
      const total = summary.fullyImplemented + summary.partiallyImplemented + summary.notImplemented;
      expect(summary.totalControls).toBe(total);
    });

    it('should validate checklist completeness', () => {
      const checklist = mockDataService.getMockOrganizationalChecklist();
      const validation = checklistService.validateChecklist(checklist);
      
      expect(validation).toBeDefined();
      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toEqual([]);
      expect(Array.isArray(validation.warnings)).toBe(true);
    });

    it('should identify missing fields in invalid checklist', () => {
      const invalidChecklist = {
        id: 'test',
        organizationId: '',
        organizationName: 'Test',
        framework: null as any,
        controls: [],
        lastUpdated: new Date(),
        completionStatus: CompletionStatus.NOT_STARTED,
        overallMaturity: MaturityLevel.INITIAL,
        compliancePercentage: 0,
      };
      
      const validation = checklistService.validateChecklist(invalidChecklist);
      
      expect(validation.isValid).toBe(false);
      expect(validation.missingFields).toContain('organizationId');
      expect(validation.missingFields).toContain('framework');
      expect(validation.missingFields).toContain('controls');
    });

    it('should provide demo organizations', () => {
      const demoOrgs = checklistService.getDemoOrganizations();
      
      expect(demoOrgs).toBeDefined();
      expect(demoOrgs.length).toBeGreaterThan(0);
      expect(demoOrgs[0].id).toBe('org-demo-bank-001');
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent data across services', async () => {
      const mockOrg = mockDataService.getMockOrganization();
      const serviceOrg = await checklistService.getOrganization('org-demo-bank-001');
      
      expect(serviceOrg).toEqual(mockOrg);
    });

    it('should have controls that match DORA categories', () => {
      const controls = mockDataService.getMockOrganizationalControls();
      
      // Should have controls covering key DORA areas
      const hasICTRisk = controls.some(c => c.name.toLowerCase().includes('ict risk'));
      const hasGovernance = controls.some(c => c.name.toLowerCase().includes('governance'));
      const hasIncident = controls.some(c => c.name.toLowerCase().includes('incident'));
      const hasThirdParty = controls.some(c => c.name.toLowerCase().includes('third-party'));
      const hasTesting = controls.some(c => c.name.toLowerCase().includes('testing'));
      const hasResilience = controls.some(c => 
        c.name.toLowerCase().includes('continuity') || 
        c.name.toLowerCase().includes('backup')
      );
      
      expect(hasICTRisk).toBe(true);
      expect(hasGovernance).toBe(true);
      expect(hasIncident).toBe(true);
      expect(hasThirdParty).toBe(true);
      expect(hasTesting).toBe(true);
      expect(hasResilience).toBe(true);
    });
  });
});