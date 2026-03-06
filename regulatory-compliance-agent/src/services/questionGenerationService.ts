import {
  ComplianceGap,
  ComplianceQuestion,
  QuestionType,
  DifficultyLevel,
  SeverityLevel,
  RequirementCategory,
  AnswerOption,
  RemediationGuidance,
  Resource,
  ResourceType,
  PriorityLevel,
  CompliQuestMetadata,
} from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * CompliQuest-compatible question format
 */
export interface CompliQuestQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'scenario';
  options: string[];
  correctAnswer: number;
  points: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  metadata: {
    framework: string;
    requirementId: string;
    gapSeverity: string;
    remediationLinks: string[];
    achievements?: string[];
    prerequisites?: string[];
  };
}

/**
 * Question Generation Service for transforming compliance gaps into CompliQuest-compatible questions
 * Implements template-based question generation prioritizing high severity gaps
 */
export class QuestionGenerationService {
  
  /**
   * Generate exactly 4 CompliQuest-compatible questions from gap analysis results
   */
  async generateQuestions(
    gaps: ComplianceGap[],
    frameworkId: string = 'dora-2022'
  ): Promise<CompliQuestQuestion[]> {
    logger.info('Starting question generation', {
      totalGaps: gaps.length,
      frameworkId,
    });

    // Prioritize gaps by severity (High and Medium first)
    const prioritizedGaps = this.prioritizeGaps(gaps);
    
    // Select top 4 gaps for question generation
    const selectedGaps = prioritizedGaps.slice(0, 4);
    
    // If we don't have enough high-priority gaps, fill with remaining gaps
    if (selectedGaps.length < 4) {
      const remainingGaps = prioritizedGaps.slice(4);
      selectedGaps.push(...remainingGaps.slice(0, 4 - selectedGaps.length));
    }
    
    // Generate questions for selected gaps
    const questions: CompliQuestQuestion[] = [];
    
    for (let i = 0; i < Math.min(4, selectedGaps.length); i++) {
      const gap = selectedGaps[i];
      const question = await this.generateQuestionFromGap(gap, frameworkId, i + 1);
      questions.push(question);
    }
    
    // If we still don't have 4 questions, generate generic ones
    while (questions.length < 4) {
      const genericQuestion = this.generateGenericQuestion(
        frameworkId,
        questions.length + 1,
        selectedGaps[0] || gaps[0] // Use first available gap for context
      );
      questions.push(genericQuestion);
    }

    logger.info('Question generation completed', {
      questionsGenerated: questions.length,
      frameworkId,
    });

    return questions;
  }

  /**
   * Prioritize gaps by severity level (High and Medium first)
   */
  private prioritizeGaps(gaps: ComplianceGap[]): ComplianceGap[] {
    const severityOrder = {
      [SeverityLevel.CRITICAL]: 4,
      [SeverityLevel.HIGH]: 3,
      [SeverityLevel.MEDIUM]: 2,
      [SeverityLevel.LOW]: 1,
    };

    return gaps.sort((a, b) => {
      // First sort by severity
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      
      // Then by gap type (missing controls are higher priority)
      const gapTypeOrder = {
        'MISSING_CONTROL': 4,
        'INADEQUATE_IMPLEMENTATION': 3,
        'OUTDATED_CONTROL': 2,
        'INSUFFICIENT_EVIDENCE': 1,
      };
      
      return gapTypeOrder[b.gapType] - gapTypeOrder[a.gapType];
    });
  }

  /**
   * Generate a question from a specific compliance gap
   */
  private async generateQuestionFromGap(
    gap: ComplianceGap,
    frameworkId: string,
    questionNumber: number
  ): Promise<CompliQuestQuestion> {
    
    // Get question template based on gap characteristics
    const template = this.getQuestionTemplate(gap);
    
    // Generate question text
    const questionText = this.generateQuestionText(gap, template);
    
    // Generate answer options
    const answerOptions = this.generateAnswerOptions(gap, template);
    
    // Determine correct answer (always first option in our templates)
    const correctAnswer = 0;
    
    // Calculate points based on difficulty and severity
    const points = this.calculatePoints(gap.severity, template.difficulty);
    
    // Generate remediation guidance
    const remediationGuidance = this.generateRemediationGuidance(gap);
    
    return {
      id: uuidv4(),
      text: questionText,
      type: template.type,
      options: answerOptions.map(opt => opt.text),
      correctAnswer,
      points,
      category: this.mapCategoryToCompliQuest(gap),
      difficulty: template.difficulty,
      metadata: {
        framework: frameworkId,
        requirementId: gap.requirementId,
        gapSeverity: gap.severity,
        remediationLinks: remediationGuidance.resources.map(r => r.url),
        achievements: this.generateAchievements(gap),
        prerequisites: this.generatePrerequisites(gap),
      },
    };
  }

  /**
   * Get question template based on gap characteristics
   */
  private getQuestionTemplate(gap: ComplianceGap): QuestionTemplate {
    const templates = this.getQuestionTemplates();
    
    // Select template based on gap type and severity
    if (gap.gapType === 'MISSING_CONTROL') {
      return gap.severity === SeverityLevel.CRITICAL || gap.severity === SeverityLevel.HIGH
        ? templates.missingControlHigh
        : templates.missingControlMedium;
    } else if (gap.gapType === 'INADEQUATE_IMPLEMENTATION') {
      return templates.inadequateImplementation;
    } else if (gap.gapType === 'OUTDATED_CONTROL') {
      return templates.outdatedControl;
    } else {
      return templates.insufficientEvidence;
    }
  }

  /**
   * Generate question text from gap and template
   */
  private generateQuestionText(gap: ComplianceGap, template: QuestionTemplate): string {
    const categoryContext = this.getCategoryContext(gap);
    
    return template.questionPattern
      .replace('{category}', categoryContext.name)
      .replace('{description}', gap.description)
      .replace('{impact}', gap.businessImpact);
  }

  /**
   * Generate answer options for the question
   */
  private generateAnswerOptions(gap: ComplianceGap, template: QuestionTemplate): AnswerOption[] {
    const categoryContext = this.getCategoryContext(gap);
    
    return template.answerOptions.map(optionTemplate => ({
      text: optionTemplate
        .replace('{category}', categoryContext.name)
        .replace('{action}', categoryContext.primaryAction),
      isCorrect: template.answerOptions.indexOf(optionTemplate) === 0, // First option is correct
    }));
  }

  /**
   * Calculate points based on difficulty and severity
   */
  private calculatePoints(severity: SeverityLevel, difficulty: DifficultyLevel): number {
    const basePoints = {
      [DifficultyLevel.EASY]: 10,
      [DifficultyLevel.MEDIUM]: 20,
      [DifficultyLevel.HARD]: 30,
    };

    const severityMultiplier = {
      [SeverityLevel.CRITICAL]: 2.0,
      [SeverityLevel.HIGH]: 1.5,
      [SeverityLevel.MEDIUM]: 1.2,
      [SeverityLevel.LOW]: 1.0,
    };

    return Math.round(basePoints[difficulty] * severityMultiplier[severity]);
  }

  /**
   * Generate remediation guidance for the question
   */
  private generateRemediationGuidance(gap: ComplianceGap): RemediationGuidance {
    const categoryResources = this.getCategoryResources(gap);
    
    return {
      steps: gap.recommendedActions.slice(0, 3), // Top 3 actions
      resources: categoryResources,
      estimatedEffort: `${gap.estimatedEffort.hours} hours`,
      priority: this.mapSeverityToPriority(gap.severity),
    };
  }

  /**
   * Map severity to priority level
   */
  private mapSeverityToPriority(severity: SeverityLevel): PriorityLevel {
    const mapping = {
      [SeverityLevel.CRITICAL]: PriorityLevel.CRITICAL,
      [SeverityLevel.HIGH]: PriorityLevel.HIGH,
      [SeverityLevel.MEDIUM]: PriorityLevel.MEDIUM,
      [SeverityLevel.LOW]: PriorityLevel.LOW,
    };
    return mapping[severity];
  }

  /**
   * Map gap category to CompliQuest category
   */
  private mapCategoryToCompliQuest(gap: ComplianceGap): string {
    // This would typically come from a requirement lookup, but for MVP we'll infer from gap
    const categoryMapping = {
      'ICT_RISK_MANAGEMENT': 'Risk Management',
      'GOVERNANCE': 'Governance & Oversight',
      'INCIDENT_REPORTING': 'Incident Management',
      'THIRD_PARTY_RISK': 'Vendor Management',
      'TESTING': 'Security Testing',
      'OPERATIONAL_RESILIENCE': 'Business Continuity',
    };
    
    // Default mapping based on common patterns in gap descriptions
    if (gap.description.toLowerCase().includes('risk')) return 'Risk Management';
    if (gap.description.toLowerCase().includes('incident')) return 'Incident Management';
    if (gap.description.toLowerCase().includes('governance')) return 'Governance & Oversight';
    if (gap.description.toLowerCase().includes('vendor') || gap.description.toLowerCase().includes('third')) return 'Vendor Management';
    if (gap.description.toLowerCase().includes('test')) return 'Security Testing';
    
    return 'Operational Resilience'; // Default category
  }

  /**
   * Generate achievements for gamification
   */
  private generateAchievements(gap: ComplianceGap): string[] {
    const achievements: string[] = [];
    
    if (gap.severity === SeverityLevel.CRITICAL) {
      achievements.push('Critical Risk Resolver');
    }
    if (gap.severity === SeverityLevel.HIGH) {
      achievements.push('High Priority Champion');
    }
    if (gap.gapType === 'MISSING_CONTROL') {
      achievements.push('Control Builder');
    }
    
    return achievements;
  }

  /**
   * Generate prerequisites for the question
   */
  private generatePrerequisites(gap: ComplianceGap): string[] {
    const prerequisites: string[] = [];
    
    if (gap.gapType === 'INADEQUATE_IMPLEMENTATION') {
      prerequisites.push('Basic Control Understanding');
    }
    if (gap.severity === SeverityLevel.CRITICAL || gap.severity === SeverityLevel.HIGH) {
      prerequisites.push('Risk Assessment Fundamentals');
    }
    
    return prerequisites;
  }

  /**
   * Get category context for question generation
   */
  private getCategoryContext(gap: ComplianceGap): CategoryContext {
    // Infer category from gap description for MVP
    const description = gap.description.toLowerCase();
    
    if (description.includes('risk')) {
      return {
        name: 'ICT Risk Management',
        primaryAction: 'implement risk assessment procedures',
      };
    } else if (description.includes('incident')) {
      return {
        name: 'Incident Reporting',
        primaryAction: 'establish incident response procedures',
      };
    } else if (description.includes('governance')) {
      return {
        name: 'Governance',
        primaryAction: 'define governance framework',
      };
    } else if (description.includes('vendor') || description.includes('third')) {
      return {
        name: 'Third-Party Risk Management',
        primaryAction: 'implement vendor risk assessment',
      };
    } else if (description.includes('test')) {
      return {
        name: 'Testing',
        primaryAction: 'establish testing procedures',
      };
    } else {
      return {
        name: 'Operational Resilience',
        primaryAction: 'implement resilience measures',
      };
    }
  }

  /**
   * Get category-specific resources
   */
  private getCategoryResources(gap: ComplianceGap): Resource[] {
    const baseResources: Resource[] = [
      {
        title: 'DORA Compliance Guide',
        url: 'https://www.eba.europa.eu/regulation-and-policy/digital-operational-resilience',
        type: ResourceType.DOCUMENTATION,
      },
    ];

    // Add category-specific resources based on gap description
    const description = gap.description.toLowerCase();
    
    if (description.includes('risk')) {
      baseResources.push({
        title: 'ICT Risk Management Framework',
        url: 'https://www.eba.europa.eu/ict-risk-management',
        type: ResourceType.TEMPLATE,
      });
    } else if (description.includes('incident')) {
      baseResources.push({
        title: 'Incident Reporting Guidelines',
        url: 'https://www.eba.europa.eu/incident-reporting',
        type: ResourceType.DOCUMENTATION,
      });
    }

    return baseResources;
  }

  /**
   * Generate a generic question when specific gaps are insufficient
   */
  private generateGenericQuestion(
    frameworkId: string,
    questionNumber: number,
    contextGap?: ComplianceGap
  ): CompliQuestQuestion {
    const genericQuestions = [
      {
        text: 'What is the primary objective of DORA (Digital Operational Resilience Act)?',
        options: [
          'To enhance the operational resilience of financial entities',
          'To regulate cryptocurrency transactions',
          'To establish new banking licenses',
          'To control interest rates'
        ],
        category: 'DORA Fundamentals',
        difficulty: 'easy' as DifficultyLevel,
      },
      {
        text: 'Which entities are subject to DORA requirements?',
        options: [
          'Credit institutions, investment firms, and insurance companies',
          'Only central banks',
          'Only cryptocurrency exchanges',
          'Only payment service providers'
        ],
        category: 'DORA Scope',
        difficulty: 'medium' as DifficultyLevel,
      },
      {
        text: 'What is required for ICT third-party risk management under DORA?',
        options: [
          'Due diligence, monitoring, and contractual arrangements',
          'Only basic vendor contracts',
          'No specific requirements',
          'Annual vendor meetings only'
        ],
        category: 'Third-Party Risk',
        difficulty: 'medium' as DifficultyLevel,
      },
      {
        text: 'How often should DORA compliance testing be performed?',
        options: [
          'At least annually with risk-based frequency',
          'Only when incidents occur',
          'Every five years',
          'Monthly for all systems'
        ],
        category: 'Testing Requirements',
        difficulty: 'hard' as DifficultyLevel,
      },
    ];

    const questionIndex = (questionNumber - 1) % genericQuestions.length;
    const template = genericQuestions[questionIndex];

    return {
      id: uuidv4(),
      text: template.text,
      type: 'multiple-choice',
      options: template.options,
      correctAnswer: 0,
      points: this.calculatePoints(SeverityLevel.MEDIUM, template.difficulty),
      category: template.category,
      difficulty: template.difficulty,
      metadata: {
        framework: frameworkId,
        requirementId: contextGap?.requirementId || 'generic',
        gapSeverity: contextGap?.severity || SeverityLevel.MEDIUM,
        remediationLinks: [
          'https://www.eba.europa.eu/regulation-and-policy/digital-operational-resilience'
        ],
        achievements: ['DORA Knowledge Builder'],
        prerequisites: [],
      },
    };
  }

  /**
   * Get question templates for different gap types
   */
  private getQuestionTemplates(): Record<string, QuestionTemplate> {
    return {
      missingControlHigh: {
        type: 'multiple-choice',
        difficulty: DifficultyLevel.HARD,
        questionPattern: 'Your organization lacks adequate {category} controls. {description} What should be your immediate priority?',
        answerOptions: [
          'Implement comprehensive {action} with executive oversight',
          'Schedule a meeting to discuss the issue',
          'Document the gap for future consideration',
          'Ignore the requirement as non-critical'
        ],
      },
      missingControlMedium: {
        type: 'multiple-choice',
        difficulty: DifficultyLevel.MEDIUM,
        questionPattern: 'A gap has been identified in {category}. {description} What is the most appropriate next step?',
        answerOptions: [
          'Develop and {action} following best practices',
          'Wait for regulatory guidance',
          'Assign to junior staff without oversight',
          'Consider it a low priority item'
        ],
      },
      inadequateImplementation: {
        type: 'multiple-choice',
        difficulty: DifficultyLevel.MEDIUM,
        questionPattern: 'Your current {category} implementation is insufficient. {description} How should you address this?',
        answerOptions: [
          'Enhance existing controls and {action}',
          'Replace all existing controls immediately',
          'Continue with current implementation',
          'Reduce the scope of controls'
        ],
      },
      outdatedControl: {
        type: 'multiple-choice',
        difficulty: DifficultyLevel.EASY,
        questionPattern: 'Your {category} controls may be outdated. {description} What should you do?',
        answerOptions: [
          'Review and update controls to {action}',
          'Keep existing controls unchanged',
          'Remove outdated controls entirely',
          'Wait for controls to become compliant naturally'
        ],
      },
      insufficientEvidence: {
        type: 'multiple-choice',
        difficulty: DifficultyLevel.EASY,
        questionPattern: 'There is insufficient evidence for {category} compliance. {description} What is needed?',
        answerOptions: [
          'Collect comprehensive documentation and {action}',
          'Assume compliance without evidence',
          'Reduce documentation requirements',
          'Rely on verbal confirmations only'
        ],
      },
    };
  }
}

// Supporting interfaces and types
interface QuestionTemplate {
  type: 'multiple-choice' | 'true-false' | 'scenario';
  difficulty: DifficultyLevel;
  questionPattern: string;
  answerOptions: string[];
}

interface CategoryContext {
  name: string;
  primaryAction: string;
}

// Export singleton instance
export const questionGenerationService = new QuestionGenerationService();