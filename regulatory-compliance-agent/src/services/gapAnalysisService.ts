import {
  Requirement,
  OrganizationalControl,
  ComplianceGap,
  GapType,
  SeverityLevel,
  ImplementationStatus,
  RequirementCategory,
} from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Gap Analysis Service for comparing regulatory requirements against organizational controls
 * Implements basic string matching and keyword-based severity assignment for hackathon MVP
 */
export class GapAnalysisService {
  
  /**
   * Analyze compliance gaps between requirements and organizational controls
   */
  async analyzeCompliance(
    requirements: Requirement[],
    organizationalControls: OrganizationalControl[],
    organizationId: string
  ): Promise<{
    gaps: ComplianceGap[];
    compliancePercentage: number;
    summary: {
      totalRequirements: number;
      fullyCompliant: number;
      partiallyCompliant: number;
      nonCompliant: number;
      gapsByCategory: Record<RequirementCategory, number>;
      gapsBySeverity: Record<SeverityLevel, number>;
    };
  }> {
    logger.info('Starting gap analysis', {
      requirementsCount: requirements.length,
      controlsCount: organizationalControls.length,
      organizationId,
    });

    const gaps: ComplianceGap[] = [];
    let fullyCompliant = 0;
    let partiallyCompliant = 0;
    let nonCompliant = 0;

    // Initialize category and severity counters
    const gapsByCategory: Record<RequirementCategory, number> = {
      [RequirementCategory.ICT_RISK_MANAGEMENT]: 0,
      [RequirementCategory.GOVERNANCE]: 0,
      [RequirementCategory.INCIDENT_REPORTING]: 0,
      [RequirementCategory.THIRD_PARTY_RISK]: 0,
      [RequirementCategory.TESTING]: 0,
      [RequirementCategory.OPERATIONAL_RESILIENCE]: 0,
    };

    const gapsBySeverity: Record<SeverityLevel, number> = {
      [SeverityLevel.CRITICAL]: 0,
      [SeverityLevel.HIGH]: 0,
      [SeverityLevel.MEDIUM]: 0,
      [SeverityLevel.LOW]: 0,
    };

    // Analyze each requirement against organizational controls
    for (const requirement of requirements) {
      const matchingControls = this.findMatchingControls(requirement, organizationalControls);
      const complianceStatus = this.assessComplianceStatus(requirement, matchingControls);

      if (complianceStatus.status === 'fully_compliant') {
        fullyCompliant++;
      } else if (complianceStatus.status === 'partially_compliant') {
        partiallyCompliant++;
        
        // Create gap for partial compliance
        const gap = this.createComplianceGap(
          requirement,
          complianceStatus.bestMatchControl,
          organizationId,
          GapType.INADEQUATE_IMPLEMENTATION,
          this.calculateGapSeverity(requirement, complianceStatus.bestMatchControl)
        );
        gaps.push(gap);
        gapsByCategory[requirement.category]++;
        gapsBySeverity[gap.severity]++;
      } else {
        nonCompliant++;
        
        // Create gap for non-compliance
        const gap = this.createComplianceGap(
          requirement,
          complianceStatus.bestMatchControl,
          organizationId,
          GapType.MISSING_CONTROL,
          this.calculateGapSeverity(requirement, complianceStatus.bestMatchControl)
        );
        gaps.push(gap);
        gapsByCategory[requirement.category]++;
        gapsBySeverity[gap.severity]++;
      }
    }

    // Calculate overall compliance percentage
    const totalRequirements = requirements.length;
    const compliancePercentage = totalRequirements > 0 
      ? Math.round(((fullyCompliant * 100) + (partiallyCompliant * 50)) / (totalRequirements * 100) * 100)
      : 0;

    const result = {
      gaps,
      compliancePercentage,
      summary: {
        totalRequirements,
        fullyCompliant,
        partiallyCompliant,
        nonCompliant,
        gapsByCategory,
        gapsBySeverity,
      },
    };

    logger.info('Gap analysis completed', {
      gapsIdentified: gaps.length,
      compliancePercentage,
      organizationId,
    });

    return result;
  }

  /**
   * Find organizational controls that match a requirement using simple string matching
   */
  private findMatchingControls(
    requirement: Requirement,
    controls: OrganizationalControl[]
  ): OrganizationalControl[] {
    const matchingControls: OrganizationalControl[] = [];
    
    // Extract keywords from requirement for matching
    const requirementKeywords = this.extractKeywords(requirement.title + ' ' + requirement.description);
    const categoryKeywords = this.getCategoryKeywords(requirement.category);
    
    for (const control of controls) {
      const controlText = control.name + ' ' + control.description;
      const controlKeywords = this.extractKeywords(controlText);
      
      // Calculate match score based on keyword overlap
      const matchScore = this.calculateMatchScore(
        [...requirementKeywords, ...categoryKeywords],
        controlKeywords,
        controlText
      );
      
      // Consider it a match if score is above threshold
      if (matchScore > 0.3) {
        matchingControls.push(control);
      }
    }
    
    // Sort by implementation status (fully implemented first)
    return matchingControls.sort((a, b) => {
      const statusOrder = {
        [ImplementationStatus.FULLY_IMPLEMENTED]: 3,
        [ImplementationStatus.PARTIALLY_IMPLEMENTED]: 2,
        [ImplementationStatus.NOT_IMPLEMENTED]: 1,
        [ImplementationStatus.NOT_APPLICABLE]: 0,
      };
      return statusOrder[b.implementationStatus] - statusOrder[a.implementationStatus];
    });
  }

  /**
   * Extract keywords from text for matching
   */
  private extractKeywords(text: string): string[] {
    const cleanText = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'shall', 'should', 'must', 'may', 'will', 'would', 'could', 'can', 'is', 'are', 'was', 'were',
      'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'this', 'that', 'these', 'those'
    ]);
    
    return cleanText
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 20); // Limit to top 20 keywords
  }

  /**
   * Get category-specific keywords for better matching
   */
  private getCategoryKeywords(category: RequirementCategory): string[] {
    const categoryKeywords: Record<RequirementCategory, string[]> = {
      [RequirementCategory.ICT_RISK_MANAGEMENT]: [
        'ict', 'risk', 'management', 'framework', 'assessment', 'monitoring', 'controls'
      ],
      [RequirementCategory.GOVERNANCE]: [
        'governance', 'oversight', 'board', 'management', 'structure', 'responsibility', 'accountability'
      ],
      [RequirementCategory.INCIDENT_REPORTING]: [
        'incident', 'reporting', 'notification', 'classification', 'response', 'escalation', 'detection'
      ],
      [RequirementCategory.THIRD_PARTY_RISK]: [
        'third', 'party', 'vendor', 'supplier', 'outsourcing', 'contractor', 'service', 'provider'
      ],
      [RequirementCategory.TESTING]: [
        'testing', 'assessment', 'penetration', 'vulnerability', 'audit', 'validation', 'verification'
      ],
      [RequirementCategory.OPERATIONAL_RESILIENCE]: [
        'resilience', 'continuity', 'recovery', 'backup', 'disaster', 'business', 'operational'
      ],
    };
    
    return categoryKeywords[category] || [];
  }

  /**
   * Calculate match score between requirement and control keywords
   */
  private calculateMatchScore(
    requirementKeywords: string[],
    controlKeywords: string[],
    controlText: string
  ): number {
    if (requirementKeywords.length === 0 || controlKeywords.length === 0) {
      return 0;
    }
    
    let matches = 0;
    let exactMatches = 0;
    
    for (const reqKeyword of requirementKeywords) {
      // Check for exact keyword matches
      if (controlKeywords.includes(reqKeyword)) {
        matches++;
        exactMatches++;
      } else {
        // Check for partial matches (substring)
        const partialMatch = controlKeywords.some(controlKeyword => 
          controlKeyword.includes(reqKeyword) || reqKeyword.includes(controlKeyword)
        );
        if (partialMatch) {
          matches += 0.5;
        }
        
        // Check if keyword appears in control text
        if (controlText.toLowerCase().includes(reqKeyword)) {
          matches += 0.3;
        }
      }
    }
    
    // Calculate score with bonus for exact matches
    const baseScore = matches / requirementKeywords.length;
    const exactMatchBonus = (exactMatches / requirementKeywords.length) * 0.2;
    
    return Math.min(baseScore + exactMatchBonus, 1.0);
  }

  /**
   * Assess compliance status based on matching controls
   */
  private assessComplianceStatus(
    requirement: Requirement,
    matchingControls: OrganizationalControl[]
  ): {
    status: 'fully_compliant' | 'partially_compliant' | 'non_compliant';
    bestMatchControl?: OrganizationalControl;
  } {
    if (matchingControls.length === 0) {
      return { status: 'non_compliant' };
    }
    
    const bestMatch = matchingControls[0];
    
    // Check implementation status of best matching control
    switch (bestMatch.implementationStatus) {
      case ImplementationStatus.FULLY_IMPLEMENTED:
        return { status: 'fully_compliant', bestMatchControl: bestMatch };
      case ImplementationStatus.PARTIALLY_IMPLEMENTED:
        return { status: 'partially_compliant', bestMatchControl: bestMatch };
      case ImplementationStatus.NOT_IMPLEMENTED:
      case ImplementationStatus.NOT_APPLICABLE:
      default:
        return { status: 'non_compliant', bestMatchControl: bestMatch };
    }
  }

  /**
   * Calculate gap severity based on requirement and control characteristics
   */
  private calculateGapSeverity(
    requirement: Requirement,
    control?: OrganizationalControl
  ): SeverityLevel {
    // Start with requirement's base severity
    let severity = requirement.severity;
    
    // Adjust based on requirement characteristics
    if (requirement.mandatory && requirement.category === RequirementCategory.INCIDENT_REPORTING) {
      // Incident reporting gaps are critical for regulatory compliance
      severity = SeverityLevel.CRITICAL;
    } else if (requirement.mandatory && requirement.category === RequirementCategory.ICT_RISK_MANAGEMENT) {
      // ICT risk management gaps are high priority
      severity = severity === SeverityLevel.LOW ? SeverityLevel.MEDIUM : severity;
    }
    
    // Adjust based on control status
    if (control) {
      if (control.implementationStatus === ImplementationStatus.PARTIALLY_IMPLEMENTED) {
        // Reduce severity for partial implementation
        if (severity === SeverityLevel.CRITICAL) severity = SeverityLevel.HIGH;
        else if (severity === SeverityLevel.HIGH) severity = SeverityLevel.MEDIUM;
      }
    } else {
      // No matching control found - increase severity
      if (severity === SeverityLevel.LOW) severity = SeverityLevel.MEDIUM;
      else if (severity === SeverityLevel.MEDIUM) severity = SeverityLevel.HIGH;
    }
    
    return severity;
  }

  /**
   * Create a compliance gap record
   */
  private createComplianceGap(
    requirement: Requirement,
    control: OrganizationalControl | undefined,
    organizationId: string,
    gapType: GapType,
    severity: SeverityLevel
  ): ComplianceGap {
    const gap: ComplianceGap = {
      id: uuidv4(),
      requirementId: requirement.id,
      controlId: control?.id,
      organizationId,
      gapType,
      severity,
      description: this.generateGapDescription(requirement, control, gapType),
      businessImpact: this.generateBusinessImpact(requirement, severity),
      technicalImpact: this.generateTechnicalImpact(requirement, control),
      estimatedEffort: this.estimateRemediationEffort(requirement, control, gapType),
      recommendedActions: this.generateRecommendedActions(requirement, control, gapType),
      identifiedAt: new Date(),
      status: 'IDENTIFIED' as any, // Using string literal to match GapStatus enum
    };
    
    return gap;
  }

  /**
   * Generate human-readable gap description
   */
  private generateGapDescription(
    requirement: Requirement,
    control: OrganizationalControl | undefined,
    gapType: GapType
  ): string {
    const reqTitle = requirement.title;
    
    switch (gapType) {
      case GapType.MISSING_CONTROL:
        return control 
          ? `Requirement "${reqTitle}" is not adequately addressed by existing control "${control.name}"`
          : `No organizational control found to address requirement "${reqTitle}"`;
      
      case GapType.INADEQUATE_IMPLEMENTATION:
        return `Control "${control?.name}" partially addresses requirement "${reqTitle}" but needs enhancement`;
      
      case GapType.OUTDATED_CONTROL:
        return `Control "${control?.name}" for requirement "${reqTitle}" may be outdated and needs review`;
      
      case GapType.INSUFFICIENT_EVIDENCE:
        return `Control "${control?.name}" lacks sufficient evidence to demonstrate compliance with "${reqTitle}"`;
      
      default:
        return `Gap identified for requirement "${reqTitle}"`;
    }
  }

  /**
   * Generate business impact description
   */
  private generateBusinessImpact(requirement: Requirement, severity: SeverityLevel): string {
    const impacts: Record<SeverityLevel, string> = {
      [SeverityLevel.CRITICAL]: 'Potential regulatory sanctions, significant operational disruption, and reputational damage',
      [SeverityLevel.HIGH]: 'Regulatory compliance risk, operational inefficiencies, and potential customer impact',
      [SeverityLevel.MEDIUM]: 'Moderate compliance risk and operational challenges',
      [SeverityLevel.LOW]: 'Minor compliance gaps with limited business impact',
    };
    
    return impacts[severity];
  }

  /**
   * Generate technical impact description
   */
  private generateTechnicalImpact(
    requirement: Requirement,
    control: OrganizationalControl | undefined
  ): string {
    const categoryImpacts: Record<RequirementCategory, string> = {
      [RequirementCategory.ICT_RISK_MANAGEMENT]: 'Inadequate risk monitoring and control effectiveness',
      [RequirementCategory.GOVERNANCE]: 'Lack of proper oversight and decision-making processes',
      [RequirementCategory.INCIDENT_REPORTING]: 'Delayed incident detection and regulatory reporting',
      [RequirementCategory.THIRD_PARTY_RISK]: 'Unmanaged vendor risks and service dependencies',
      [RequirementCategory.TESTING]: 'Insufficient validation of security controls and resilience',
      [RequirementCategory.OPERATIONAL_RESILIENCE]: 'Reduced ability to maintain operations during disruptions',
    };
    
    return categoryImpacts[requirement.category] || 'Technical control gaps affecting system reliability';
  }

  /**
   * Estimate remediation effort
   */
  private estimateRemediationEffort(
    requirement: Requirement,
    control: OrganizationalControl | undefined,
    gapType: GapType
  ): any {
    // Simple effort estimation based on gap type and requirement complexity
    const baseHours: Record<GapType, number> = {
      [GapType.MISSING_CONTROL]: 80,
      [GapType.INADEQUATE_IMPLEMENTATION]: 40,
      [GapType.OUTDATED_CONTROL]: 24,
      [GapType.INSUFFICIENT_EVIDENCE]: 16,
    };
    
    const categoryMultiplier: Record<RequirementCategory, number> = {
      [RequirementCategory.ICT_RISK_MANAGEMENT]: 1.5,
      [RequirementCategory.GOVERNANCE]: 1.2,
      [RequirementCategory.INCIDENT_REPORTING]: 1.3,
      [RequirementCategory.THIRD_PARTY_RISK]: 1.4,
      [RequirementCategory.TESTING]: 1.1,
      [RequirementCategory.OPERATIONAL_RESILIENCE]: 1.3,
    };
    
    const hours = Math.round(baseHours[gapType] * categoryMultiplier[requirement.category]);
    
    return {
      hours,
      complexity: hours > 60 ? 'HIGH' : hours > 30 ? 'MEDIUM' : 'LOW',
      skillsRequired: this.getRequiredSkills(requirement.category),
    };
  }

  /**
   * Get required skills for remediation
   */
  private getRequiredSkills(category: RequirementCategory): string[] {
    const skillsMap: Record<RequirementCategory, string[]> = {
      [RequirementCategory.ICT_RISK_MANAGEMENT]: ['Risk Management', 'IT Governance', 'Compliance'],
      [RequirementCategory.GOVERNANCE]: ['Governance', 'Policy Development', 'Management'],
      [RequirementCategory.INCIDENT_REPORTING]: ['Incident Response', 'Compliance', 'Communication'],
      [RequirementCategory.THIRD_PARTY_RISK]: ['Vendor Management', 'Contract Management', 'Risk Assessment'],
      [RequirementCategory.TESTING]: ['Security Testing', 'Penetration Testing', 'Audit'],
      [RequirementCategory.OPERATIONAL_RESILIENCE]: ['Business Continuity', 'Disaster Recovery', 'Operations'],
    };
    
    return skillsMap[category] || ['General IT', 'Compliance'];
  }

  /**
   * Generate recommended actions for gap remediation
   */
  private generateRecommendedActions(
    requirement: Requirement,
    control: OrganizationalControl | undefined,
    gapType: GapType
  ): string[] {
    const actions: string[] = [];
    
    switch (gapType) {
      case GapType.MISSING_CONTROL:
        actions.push(`Develop and implement control to address "${requirement.title}"`);
        actions.push('Assign responsible owner and establish implementation timeline');
        actions.push('Define success criteria and monitoring procedures');
        break;
        
      case GapType.INADEQUATE_IMPLEMENTATION:
        actions.push(`Enhance existing control "${control?.name}" to fully meet requirements`);
        actions.push('Review and update control procedures and documentation');
        actions.push('Provide additional training to responsible personnel');
        break;
        
      case GapType.OUTDATED_CONTROL:
        actions.push(`Review and update control "${control?.name}" to current standards`);
        actions.push('Validate control effectiveness against current requirements');
        actions.push('Update documentation and procedures as needed');
        break;
        
      case GapType.INSUFFICIENT_EVIDENCE:
        actions.push(`Collect and document evidence for control "${control?.name}"`);
        actions.push('Establish regular evidence collection and review processes');
        actions.push('Train personnel on evidence requirements and documentation');
        break;
    }
    
    // Add category-specific actions
    const categoryActions = this.getCategorySpecificActions(requirement.category);
    actions.push(...categoryActions);
    
    return actions;
  }

  /**
   * Get category-specific recommended actions
   */
  private getCategorySpecificActions(category: RequirementCategory): string[] {
    const categoryActions: Record<RequirementCategory, string[]> = {
      [RequirementCategory.ICT_RISK_MANAGEMENT]: [
        'Integrate with overall risk management framework',
        'Establish regular risk assessment schedule'
      ],
      [RequirementCategory.GOVERNANCE]: [
        'Ensure board and senior management oversight',
        'Define clear roles and responsibilities'
      ],
      [RequirementCategory.INCIDENT_REPORTING]: [
        'Establish incident classification criteria',
        'Define regulatory reporting procedures'
      ],
      [RequirementCategory.THIRD_PARTY_RISK]: [
        'Implement vendor risk assessment process',
        'Establish ongoing monitoring procedures'
      ],
      [RequirementCategory.TESTING]: [
        'Develop comprehensive testing program',
        'Schedule regular testing activities'
      ],
      [RequirementCategory.OPERATIONAL_RESILIENCE]: [
        'Test business continuity procedures',
        'Validate recovery capabilities'
      ],
    };
    
    return categoryActions[category] || [];
  }
}

// Export singleton instance
export const gapAnalysisService = new GapAnalysisService();