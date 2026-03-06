import { AvatarState } from '../components/LSEGlingAvatar';

/**
 * Policy State Mapping Configuration
 * 
 * This file defines how compliance questions/policies map to duck avatar states.
 * Each policy type corresponds to a specific duck state and remediation action.
 * 
 * Usage: When real compliance data is available, use these mappings to determine
 * which duck state(s) to display based on non-compliant questions.
 */

export interface PolicyMapping {
  policyType: string;
  duckState: AvatarState;
  alertTitle: string;
  alertMessage: string;
  remediationAction: string;
  icon: string;
}

/**
 * Core policy mappings
 * 
 * To add new policy types:
 * 1. Add new entry to this array
 * 2. Ensure duckState is one of: 'happy' | 'hungry' | 'thirsty' | 'tired' | 'wet'
 * 3. Update getPolicyMapping() if needed
 */
export const policyStateMappings: PolicyMapping[] = [
  {
    policyType: 'food',
    duckState: 'hungry',
    alertTitle: 'Malnutrition',
    alertMessage: 'Food policy compliance required - Dilly needs to be fed',
    remediationAction: 'Provide food resources documentation',
    icon: '🍔'
  },
  {
    policyType: 'water',
    duckState: 'thirsty',
    alertTitle: 'Water Access',
    alertMessage: 'Water policy compliance required - Dilly is thirsty',
    remediationAction: 'Provide water access documentation',
    icon: '💧'
  },
  {
    policyType: 'shelter',
    duckState: 'wet',
    alertTitle: 'Shelter',
    alertMessage: 'Shelter policy compliance required - Dilly needs housing',
    remediationAction: 'Provide housing documentation',
    icon: '🏠'
  },
  {
    policyType: 'rest',
    duckState: 'tired',
    alertTitle: 'Rest/Workload',
    alertMessage: 'Rest policy compliance required - Dilly is exhausted',
    remediationAction: 'Provide workload documentation',
    icon: '😴'
  }
];

/**
 * Get policy mapping by policy type
 */
export function getPolicyMapping(policyType: string): PolicyMapping | undefined {
  return policyStateMappings.find(m => m.policyType === policyType);
}

/**
 * Get duck state for a policy type
 */
export function getDuckStateForPolicy(policyType: string): AvatarState | undefined {
  const mapping = getPolicyMapping(policyType);
  return mapping?.duckState;
}

/**
 * Get all duck states from compliance questions
 * 
 * @param questions - Array of compliance questions with compliant status
 * @returns Array of duck states for non-compliant questions
 * 
 * Example:
 * ```typescript
 * const questions = [
 *   { policyType: 'food', compliant: false },
 *   { policyType: 'shelter', compliant: false },
 *   { policyType: 'water', compliant: true }
 * ];
 * 
 * const states = getDuckStatesFromQuestions(questions);
 * // Returns: ['hungry', 'wet']
 * ```
 */
export function getDuckStatesFromQuestions(
  questions: Array<{ policyType: string; compliant: boolean; requiresRemediation?: boolean }>
): AvatarState[] {
  const states = questions
    .filter(q => !q.compliant && (q.requiresRemediation === undefined || q.requiresRemediation))
    .map(q => getDuckStateForPolicy(q.policyType))
    .filter((state): state is AvatarState => state !== undefined);

  return states.length > 0 ? states : ['happy'];
}

/**
 * Create alerts from non-compliant questions
 * 
 * @param questions - Array of compliance questions
 * @returns Array of alert objects for display
 */
export function createAlertsFromQuestions(
  questions: Array<{ 
    id: string;
    policyType: string;
    compliant: boolean;
    severity?: 'critical' | 'high' | 'medium' | 'low';
  }>
) {
  return questions
    .filter(q => !q.compliant)
    .map(q => {
      const mapping = getPolicyMapping(q.policyType);
      if (!mapping) return null;

      return {
        id: q.id,
        title: mapping.alertTitle,
        message: mapping.alertMessage,
        severity: q.severity || 'high',
        status: 'active',
        icon: mapping.icon,
        remediationAction: mapping.remediationAction
      };
    })
    .filter(alert => alert !== null);
}

/**
 * Example usage for future integration:
 * 
 * ```typescript
 * // In your component or service:
 * import { getDuckStatesFromQuestions, createAlertsFromQuestions } from './config/policyStateMappings';
 * 
 * // Fetch compliance data from API
 * const complianceQuestions = await fetchComplianceQuestions();
 * 
 * // Determine duck states
 * const duckStates = getDuckStatesFromQuestions(complianceQuestions);
 * 
 * // Create alerts for display
 * const alerts = createAlertsFromQuestions(complianceQuestions);
 * 
 * // Render duck with states
 * <LSEGlingAvatar states={duckStates} />
 * ```
 */
