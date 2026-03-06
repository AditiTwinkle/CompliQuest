import {
  OrganizationalChecklist,
  Organization,
  OrganizationalControl,
  ComplianceStatus,
  ImplementationStatus,
  MaturityLevel,
} from '../types';
import { mockOrganizationalData } from './mockOrganizationalData';

/**
 * Service for managing organizational checklists and compliance data
 * For hackathon MVP, uses mock data. Can be extended with real data sources.
 */
export class OrganizationalChecklistService {
  
  /**
   * Get organizational checklist by organization and framework
   */
  async getOrganizationalChecklist(
    organizationId: string,
    frameworkId: string
  ): Promise<OrganizationalChecklist | null> {
    // For MVP, return mock data for demo organization
    if (organizationId === 'org-demo-bank-001' && frameworkId === 'dora-2022') {
      return mockOrganizationalData.getMockOrganizationalChecklist();
    }
    
    // In real implementation, would query database
    return null;
  }

  /**
   * Get organization details
   */
  async getOrganization(organizationId: string): Promise<Organization | null> {
    if (organizationId === 'org-demo-bank-001') {
      return mockOrganizationalData.getMockOrganization();
    }
    
    return null;
  }

  /**
   * Get all controls for an organization
   */
  async getOrganizationalControls(organizationId: string): Promise<OrganizationalControl[]> {
    if (organizationId === 'org-demo-bank-001') {
      return mockOrganizationalData.getMockOrganizationalControls();
    }
    
    return [];
  }

  /**
   * Calculate compliance status for an organization and framework
   */
  async calculateComplianceStatus(
    organizationId: string,
    frameworkId: string
  ): Promise<ComplianceStatus> {
    const controls = await this.getOrganizationalControls(organizationId);
    
    const totalControls = controls.length;
    const implementedControls = controls.filter(
      c => c.implementationStatus === ImplementationStatus.FULLY_IMPLEMENTED
    ).length;
    const partiallyImplementedControls = controls.filter(
      c => c.implementationStatus === ImplementationStatus.PARTIALLY_IMPLEMENTED
    ).length;
    const notImplementedControls = controls.filter(
      c => c.implementationStatus === ImplementationStatus.NOT_IMPLEMENTED
    ).length;

    // Calculate weighted compliance percentage
    // Fully implemented = 100%, Partially = 50%, Not implemented = 0%
    const compliancePercentage = totalControls > 0 
      ? Math.round(((implementedControls * 100) + (partiallyImplementedControls * 50)) / (totalControls * 100) * 100)
      : 0;

    return {
      organizationId,
      frameworkId,
      totalControls,
      implementedControls,
      partiallyImplementedControls,
      notImplementedControls,
      compliancePercentage,
      lastAssessment: new Date(),
      nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    };
  }

  /**
   * Get controls by implementation status
   */
  async getControlsByStatus(
    organizationId: string,
    status: ImplementationStatus
  ): Promise<OrganizationalControl[]> {
    const controls = await this.getOrganizationalControls(organizationId);
    return controls.filter(control => control.implementationStatus === status);
  }

  /**
   * Get controls by maturity level
   */
  async getControlsByMaturity(
    organizationId: string,
    maturityLevel: MaturityLevel
  ): Promise<OrganizationalControl[]> {
    const controls = await this.getOrganizationalControls(organizationId);
    return controls.filter(control => control.maturityLevel === maturityLevel);
  }

  /**
   * Get compliance summary for dashboard/reporting
   */
  async getComplianceSummary(organizationId: string) {
    if (organizationId === 'org-demo-bank-001') {
      return mockOrganizationalData.getMockComplianceSummary();
    }
    
    return {
      totalControls: 0,
      fullyImplemented: 0,
      partiallyImplemented: 0,
      notImplemented: 0,
      byCategory: {},
    };
  }

  /**
   * Update control implementation status
   * For MVP, this would just log the change. In real implementation, would update database.
   */
  async updateControlStatus(
    controlId: string,
    newStatus: ImplementationStatus,
    notes?: string
  ): Promise<boolean> {
    console.log(`Updating control ${controlId} to status ${newStatus}`, { notes });
    
    // In real implementation:
    // - Validate the control exists
    // - Update database
    // - Log the change for audit trail
    // - Recalculate compliance percentages
    
    return true;
  }

  /**
   * Get available demo organizations for hackathon
   */
  getDemoOrganizations(): Organization[] {
    return [mockOrganizationalData.getMockOrganization()];
  }

  /**
   * Validate checklist completeness
   */
  validateChecklist(checklist: OrganizationalChecklist): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
  } {
    const missingFields: string[] = [];
    const warnings: string[] = [];

    if (!checklist.organizationId) missingFields.push('organizationId');
    if (!checklist.framework) missingFields.push('framework');
    if (!checklist.controls || checklist.controls.length === 0) {
      missingFields.push('controls');
    }

    // Check for controls without evidence
    const controlsWithoutEvidence = checklist.controls.filter(
      control => control.implementationStatus === ImplementationStatus.FULLY_IMPLEMENTED && 
                 (!control.evidence || control.evidence.length === 0)
    );

    if (controlsWithoutEvidence.length > 0) {
      warnings.push(`${controlsWithoutEvidence.length} fully implemented controls lack evidence`);
    }

    // Check for overdue reviews
    const now = new Date();
    const overdueControls = checklist.controls.filter(
      control => control.nextReview < now
    );

    if (overdueControls.length > 0) {
      warnings.push(`${overdueControls.length} controls have overdue reviews`);
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings,
    };
  }
}

// Export singleton instance
export const organizationalChecklistService = new OrganizationalChecklistService();