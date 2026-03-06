// Core domain types for the regulatory compliance agent system

export interface RegulatoryFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  jurisdiction: string;
  effectiveDate: Date;
  lastUpdated: Date;
}

export interface Requirement {
  id: string;
  frameworkId: string;
  sectionNumber: string;
  title: string;
  description: string;
  category: RequirementCategory;
  subcategory?: string;
  mandatory: boolean;
  deadline?: Date;
  severity: SeverityLevel;
  keywords: string[];
  relatedRequirements: string[];
}

export interface OrganizationalControl {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: ControlCategory;
  implementationStatus: ImplementationStatus;
  maturityLevel: MaturityLevel;
  evidence: Evidence[];
  owner: string;
  lastReviewed: Date;
  nextReview: Date;
}

export interface ComplianceGap {
  id: string;
  requirementId: string;
  controlId?: string;
  organizationId: string;
  gapType: GapType;
  severity: SeverityLevel;
  description: string;
  businessImpact: string;
  technicalImpact: string;
  estimatedEffort: EffortEstimate;
  recommendedActions: string[];
  identifiedAt: Date;
  status: GapStatus;
}

export interface ComplianceQuestion {
  id: string;
  gapId: string;
  frameworkId: string;
  questionText: string;
  questionType: QuestionType;
  answerOptions: AnswerOption[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: DifficultyLevel;
  points: number;
  category: string;
  tags: string[];
  remediationGuidance: RemediationGuidance;
  compliQuestMetadata: CompliQuestMetadata;
}

// Organizational Checklist Model
export interface OrganizationalChecklist {
  id: string;
  organizationId: string;
  organizationName: string;
  framework: RegulatoryFramework;
  controls: OrganizationalControl[];
  lastUpdated: Date;
  completionStatus: CompletionStatus;
  overallMaturity: MaturityLevel;
  compliancePercentage: number;
}

export interface Organization {
  id: string;
  name: string;
  industry: IndustryType;
  size: OrganizationSize;
  jurisdiction: string;
  establishedDate: Date;
  regulatoryFrameworks: string[]; // Framework IDs
}

export interface ComplianceStatus {
  organizationId: string;
  frameworkId: string;
  totalControls: number;
  implementedControls: number;
  partiallyImplementedControls: number;
  notImplementedControls: number;
  compliancePercentage: number;
  lastAssessment: Date;
  nextAssessment: Date;
}

export interface ControlImplementationDetails {
  controlId: string;
  implementationNotes: string;
  implementationDate?: Date;
  responsibleTeam: string;
  budgetAllocated?: number;
  timeline: ImplementationTimeline;
  dependencies: string[];
  risks: string[];
}

export interface ImplementationTimeline {
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: MilestoneStatus;
}

export interface AnswerOption {
  text: string;
  isCorrect: boolean;
}

export interface RemediationGuidance {
  steps: string[];
  resources: Resource[];
  estimatedEffort: string;
  priority: PriorityLevel;
}

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  description: string;
  url?: string;
  uploadedAt: Date;
}

export interface EffortEstimate {
  hours: number;
  complexity: ComplexityLevel;
  skillsRequired: string[];
}

export interface CompliQuestMetadata {
  achievements?: string[];
  prerequisites?: string[];
  gameCategory: string;
}

// Enumerations
export enum RequirementCategory {
  ICT_RISK_MANAGEMENT = 'ICT_RISK_MANAGEMENT',
  GOVERNANCE = 'GOVERNANCE',
  INCIDENT_REPORTING = 'INCIDENT_REPORTING',
  THIRD_PARTY_RISK = 'THIRD_PARTY_RISK',
  TESTING = 'TESTING',
  OPERATIONAL_RESILIENCE = 'OPERATIONAL_RESILIENCE',
}

export enum SeverityLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ImplementationStatus {
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  PARTIALLY_IMPLEMENTED = 'PARTIALLY_IMPLEMENTED',
  FULLY_IMPLEMENTED = 'FULLY_IMPLEMENTED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum GapType {
  MISSING_CONTROL = 'MISSING_CONTROL',
  INADEQUATE_IMPLEMENTATION = 'INADEQUATE_IMPLEMENTATION',
  OUTDATED_CONTROL = 'OUTDATED_CONTROL',
  INSUFFICIENT_EVIDENCE = 'INSUFFICIENT_EVIDENCE',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SCENARIO_BASED = 'SCENARIO_BASED',
  RANKING = 'RANKING',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ControlCategory {
  TECHNICAL = 'TECHNICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  PHYSICAL = 'PHYSICAL',
}

export enum MaturityLevel {
  INITIAL = 'INITIAL',
  MANAGED = 'MANAGED',
  DEFINED = 'DEFINED',
  QUANTITATIVELY_MANAGED = 'QUANTITATIVELY_MANAGED',
  OPTIMIZING = 'OPTIMIZING',
}

export enum GapStatus {
  IDENTIFIED = 'IDENTIFIED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  ACCEPTED_RISK = 'ACCEPTED_RISK',
}

export enum ComplexityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum EvidenceType {
  DOCUMENT = 'DOCUMENT',
  SCREENSHOT = 'SCREENSHOT',
  POLICY = 'POLICY',
  PROCEDURE = 'PROCEDURE',
  AUDIT_REPORT = 'AUDIT_REPORT',
}

export enum ResourceType {
  DOCUMENTATION = 'DOCUMENTATION',
  TOOL = 'TOOL',
  TRAINING = 'TRAINING',
  TEMPLATE = 'TEMPLATE',
}

// Additional enums for organizational checklist model
export enum CompletionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export enum IndustryType {
  BANKING = 'BANKING',
  INSURANCE = 'INSURANCE',
  INVESTMENT_SERVICES = 'INVESTMENT_SERVICES',
  PAYMENT_SERVICES = 'PAYMENT_SERVICES',
  CREDIT_INSTITUTIONS = 'CREDIT_INSTITUTIONS',
  FINTECH = 'FINTECH',
  OTHER_FINANCIAL = 'OTHER_FINANCIAL',
}

export enum OrganizationSize {
  SMALL = 'SMALL', // < 50 employees
  MEDIUM = 'MEDIUM', // 50-250 employees
  LARGE = 'LARGE', // 250-1000 employees
  ENTERPRISE = 'ENTERPRISE', // > 1000 employees
}

export enum MilestoneStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    bedrock: 'available' | 'unavailable';
    scraping: 'available' | 'unavailable';
  };
}