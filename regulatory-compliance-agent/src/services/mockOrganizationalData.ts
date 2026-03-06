import {
  Organization,
  OrganizationalChecklist,
  OrganizationalControl,
  RegulatoryFramework,
  IndustryType,
  OrganizationSize,
  ImplementationStatus,
  MaturityLevel,
  ControlCategory,
  EvidenceType,
  CompletionStatus,
  RequirementCategory,
  SeverityLevel,
} from '../types';

/**
 * Mock organizational data service for hackathon demo
 * Provides realistic financial institution compliance data
 */
export class MockOrganizationalDataService {
  
  /**
   * Get mock organization representing a typical mid-size bank
   */
  getMockOrganization(): Organization {
    return {
      id: 'org-demo-bank-001',
      name: 'Demo Financial Services Ltd',
      industry: IndustryType.BANKING,
      size: OrganizationSize.MEDIUM,
      jurisdiction: 'EU',
      establishedDate: new Date('2010-03-15'),
      regulatoryFrameworks: ['dora-2022', 'gdpr-2018'],
    };
  }

  /**
   * Get mock DORA regulatory framework
   */
  getMockDORAFramework(): RegulatoryFramework {
    return {
      id: 'dora-2022',
      name: 'Digital Operational Resilience Act',
      version: '2022/2554',
      description: 'EU regulation on digital operational resilience for the financial services sector',
      jurisdiction: 'EU',
      effectiveDate: new Date('2025-01-17'),
      lastUpdated: new Date('2024-01-01'),
    };
  }

  /**
   * Get mock organizational controls for DORA compliance
   * Represents a typical financial institution's current state
   */
  getMockOrganizationalControls(): OrganizationalControl[] {
    const baseDate = new Date('2024-01-01');
    const reviewDate = new Date('2024-12-31');
    
    return [
      // ICT Risk Management Controls
      {
        id: 'ctrl-ict-001',
        organizationId: 'org-demo-bank-001',
        name: 'ICT Risk Management Framework',
        description: 'Comprehensive framework for managing ICT risks across the organization',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.PARTIALLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.MANAGED,
        evidence: [
          {
            id: 'ev-001',
            type: EvidenceType.POLICY,
            description: 'ICT Risk Management Policy v2.1',
            url: '/documents/ict-risk-policy.pdf',
            uploadedAt: baseDate,
          },
        ],
        owner: 'Chief Information Security Officer',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },
      {
        id: 'ctrl-ict-002',
        organizationId: 'org-demo-bank-001',
        name: 'ICT Risk Assessment Process',
        description: 'Regular assessment and monitoring of ICT risks',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.FULLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.DEFINED,
        evidence: [
          {
            id: 'ev-002',
            type: EvidenceType.PROCEDURE,
            description: 'ICT Risk Assessment Procedure',
            uploadedAt: baseDate,
          },
          {
            id: 'ev-003',
            type: EvidenceType.AUDIT_REPORT,
            description: 'Q3 2024 ICT Risk Assessment Report',
            uploadedAt: new Date('2024-09-30'),
          },
        ],
        owner: 'IT Risk Manager',
        lastReviewed: new Date('2024-09-30'),
        nextReview: reviewDate,
      },

      // Governance Controls
      {
        id: 'ctrl-gov-001',
        organizationId: 'org-demo-bank-001',
        name: 'ICT Governance Structure',
        description: 'Clear governance structure for ICT decision-making and oversight',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.FULLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.DEFINED,
        evidence: [
          {
            id: 'ev-004',
            type: EvidenceType.DOCUMENT,
            description: 'ICT Governance Charter',
            uploadedAt: baseDate,
          },
        ],
        owner: 'Chief Technology Officer',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },
      {
        id: 'ctrl-gov-002',
        organizationId: 'org-demo-bank-001',
        name: 'ICT Strategy Alignment',
        description: 'ICT strategy aligned with business objectives and risk appetite',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.PARTIALLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.MANAGED,
        evidence: [
          {
            id: 'ev-005',
            type: EvidenceType.DOCUMENT,
            description: 'ICT Strategy Document 2024-2026',
            uploadedAt: baseDate,
          },
        ],
        owner: 'Chief Technology Officer',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },

      // Incident Reporting Controls
      {
        id: 'ctrl-inc-001',
        organizationId: 'org-demo-bank-001',
        name: 'ICT Incident Detection',
        description: 'Automated systems for detecting ICT-related incidents',
        category: ControlCategory.TECHNICAL,
        implementationStatus: ImplementationStatus.PARTIALLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.MANAGED,
        evidence: [
          {
            id: 'ev-006',
            type: EvidenceType.DOCUMENT,
            description: 'SIEM Configuration Documentation',
            uploadedAt: baseDate,
          },
        ],
        owner: 'Security Operations Center',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },
      {
        id: 'ctrl-inc-002',
        organizationId: 'org-demo-bank-001',
        name: 'Incident Classification Process',
        description: 'Standardized process for classifying and prioritizing incidents',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.NOT_IMPLEMENTED,
        maturityLevel: MaturityLevel.INITIAL,
        evidence: [],
        owner: 'Incident Response Team',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },
      {
        id: 'ctrl-inc-003',
        organizationId: 'org-demo-bank-001',
        name: 'Regulatory Incident Reporting',
        description: 'Process for reporting major incidents to regulatory authorities',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.NOT_IMPLEMENTED,
        maturityLevel: MaturityLevel.INITIAL,
        evidence: [],
        owner: 'Compliance Officer',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },

      // Third-Party Risk Controls
      {
        id: 'ctrl-3p-001',
        organizationId: 'org-demo-bank-001',
        name: 'Third-Party ICT Service Provider Assessment',
        description: 'Due diligence process for evaluating ICT service providers',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.PARTIALLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.MANAGED,
        evidence: [
          {
            id: 'ev-007',
            type: EvidenceType.PROCEDURE,
            description: 'Vendor Assessment Checklist',
            uploadedAt: baseDate,
          },
        ],
        owner: 'Procurement Manager',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },
      {
        id: 'ctrl-3p-002',
        organizationId: 'org-demo-bank-001',
        name: 'Critical Third-Party Monitoring',
        description: 'Ongoing monitoring of critical ICT service providers',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.NOT_IMPLEMENTED,
        maturityLevel: MaturityLevel.INITIAL,
        evidence: [],
        owner: 'Third-Party Risk Manager',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },

      // Testing Controls
      {
        id: 'ctrl-test-001',
        organizationId: 'org-demo-bank-001',
        name: 'ICT System Testing Program',
        description: 'Regular testing of ICT systems and controls',
        category: ControlCategory.TECHNICAL,
        implementationStatus: ImplementationStatus.PARTIALLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.MANAGED,
        evidence: [
          {
            id: 'ev-008',
            type: EvidenceType.DOCUMENT,
            description: 'Annual Testing Plan 2024',
            uploadedAt: baseDate,
          },
        ],
        owner: 'IT Testing Team',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },
      {
        id: 'ctrl-test-002',
        organizationId: 'org-demo-bank-001',
        name: 'Threat-Led Penetration Testing',
        description: 'Advanced penetration testing based on threat intelligence',
        category: ControlCategory.TECHNICAL,
        implementationStatus: ImplementationStatus.NOT_IMPLEMENTED,
        maturityLevel: MaturityLevel.INITIAL,
        evidence: [],
        owner: 'Cybersecurity Team',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },

      // Operational Resilience Controls
      {
        id: 'ctrl-ops-001',
        organizationId: 'org-demo-bank-001',
        name: 'Business Continuity Planning',
        description: 'Comprehensive business continuity and disaster recovery plans',
        category: ControlCategory.ADMINISTRATIVE,
        implementationStatus: ImplementationStatus.FULLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.DEFINED,
        evidence: [
          {
            id: 'ev-009',
            type: EvidenceType.DOCUMENT,
            description: 'Business Continuity Plan v3.2',
            uploadedAt: baseDate,
          },
          {
            id: 'ev-010',
            type: EvidenceType.AUDIT_REPORT,
            description: 'BCP Testing Results Q2 2024',
            uploadedAt: new Date('2024-06-30'),
          },
        ],
        owner: 'Business Continuity Manager',
        lastReviewed: new Date('2024-06-30'),
        nextReview: reviewDate,
      },
      {
        id: 'ctrl-ops-002',
        organizationId: 'org-demo-bank-001',
        name: 'ICT System Backup and Recovery',
        description: 'Regular backup and tested recovery procedures for critical ICT systems',
        category: ControlCategory.TECHNICAL,
        implementationStatus: ImplementationStatus.PARTIALLY_IMPLEMENTED,
        maturityLevel: MaturityLevel.MANAGED,
        evidence: [
          {
            id: 'ev-011',
            type: EvidenceType.PROCEDURE,
            description: 'Backup and Recovery Procedures',
            uploadedAt: baseDate,
          },
        ],
        owner: 'Infrastructure Team',
        lastReviewed: baseDate,
        nextReview: reviewDate,
      },
    ];
  }

  /**
   * Get complete organizational checklist for DORA compliance
   */
  getMockOrganizationalChecklist(): OrganizationalChecklist {
    const organization = this.getMockOrganization();
    const framework = this.getMockDORAFramework();
    const controls = this.getMockOrganizationalControls();

    // Calculate compliance percentage
    const totalControls = controls.length;
    const fullyImplemented = controls.filter(c => c.implementationStatus === ImplementationStatus.FULLY_IMPLEMENTED).length;
    const partiallyImplemented = controls.filter(c => c.implementationStatus === ImplementationStatus.PARTIALLY_IMPLEMENTED).length;
    
    // Weight fully implemented as 100%, partially as 50%
    const compliancePercentage = Math.round(((fullyImplemented * 100) + (partiallyImplemented * 50)) / (totalControls * 100) * 100);

    return {
      id: 'checklist-demo-dora-001',
      organizationId: organization.id,
      organizationName: organization.name,
      framework,
      controls,
      lastUpdated: new Date('2024-11-01'),
      completionStatus: CompletionStatus.IN_PROGRESS,
      overallMaturity: MaturityLevel.MANAGED,
      compliancePercentage,
    };
  }

  /**
   * Get summary statistics for the mock organization
   */
  getMockComplianceSummary() {
    const controls = this.getMockOrganizationalControls();
    
    const summary = {
      totalControls: controls.length,
      fullyImplemented: controls.filter(c => c.implementationStatus === ImplementationStatus.FULLY_IMPLEMENTED).length,
      partiallyImplemented: controls.filter(c => c.implementationStatus === ImplementationStatus.PARTIALLY_IMPLEMENTED).length,
      notImplemented: controls.filter(c => c.implementationStatus === ImplementationStatus.NOT_IMPLEMENTED).length,
      byCategory: {
        [RequirementCategory.ICT_RISK_MANAGEMENT]: controls.filter(c => c.name.toLowerCase().includes('ict risk')).length,
        [RequirementCategory.GOVERNANCE]: controls.filter(c => c.name.toLowerCase().includes('governance')).length,
        [RequirementCategory.INCIDENT_REPORTING]: controls.filter(c => c.name.toLowerCase().includes('incident')).length,
        [RequirementCategory.THIRD_PARTY_RISK]: controls.filter(c => c.name.toLowerCase().includes('third-party')).length,
        [RequirementCategory.TESTING]: controls.filter(c => c.name.toLowerCase().includes('testing')).length,
        [RequirementCategory.OPERATIONAL_RESILIENCE]: controls.filter(c => c.name.toLowerCase().includes('continuity') || c.name.toLowerCase().includes('backup')).length,
      },
    };

    return summary;
  }

  /**
   * Get mock gaps that would be identified in gap analysis
   * This represents typical gaps for a mid-maturity financial institution
   */
  getMockIdentifiedGaps() {
    return [
      {
        category: RequirementCategory.INCIDENT_REPORTING,
        severity: SeverityLevel.HIGH,
        description: 'Missing standardized incident classification process',
        controlId: 'ctrl-inc-002',
      },
      {
        category: RequirementCategory.INCIDENT_REPORTING,
        severity: SeverityLevel.CRITICAL,
        description: 'No regulatory incident reporting process in place',
        controlId: 'ctrl-inc-003',
      },
      {
        category: RequirementCategory.THIRD_PARTY_RISK,
        severity: SeverityLevel.HIGH,
        description: 'Lack of ongoing monitoring for critical third-party providers',
        controlId: 'ctrl-3p-002',
      },
      {
        category: RequirementCategory.TESTING,
        severity: SeverityLevel.MEDIUM,
        description: 'Advanced threat-led penetration testing not implemented',
        controlId: 'ctrl-test-002',
      },
      {
        category: RequirementCategory.ICT_RISK_MANAGEMENT,
        severity: SeverityLevel.MEDIUM,
        description: 'ICT risk management framework needs enhancement',
        controlId: 'ctrl-ict-001',
      },
    ];
  }
}

// Export singleton instance for easy use
export const mockOrganizationalData = new MockOrganizationalDataService();