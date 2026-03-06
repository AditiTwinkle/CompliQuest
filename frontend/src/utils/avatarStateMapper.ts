import { AvatarState } from '../components/LSEGlingAvatar';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
}

/**
 * DUCK STATE WORKFLOW LOGIC:
 * 
 * Default State: happy
 * - All questions are compliant = true
 * - No actions or remediation needed
 * 
 * Non-Compliant States: hungry, thirsty, wet, tired
 * - When compliant = false, duck enters distress state(s)
 * - Each policy type maps to a specific state
 * - Multiple non-compliant questions = multiple states (e.g., hungry + wet)
 * 
 * State Resolution:
 * - User resolves question → compliant = true
 * - Duck state updates (removes resolved state)
 * - When all resolved → duck returns to happy
 * 
 * Future Implementation:
 * - Policy type mappings will be configured based on real data
 * - Each policy change maps to a different duck state
 * - System will accept compliance question data with compliant boolean
 */

/**
 * Get all applicable states for the duck (supports multi-state)
 * 
 * Current: Uses alert keywords to determine states
 * Future: Will use question.compliant and question.policyType
 */
export function determineAvatarStates(alerts: Alert[]): AvatarState[] {
  if (!alerts || alerts.length === 0) {
    return ['happy'];
  }

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  
  if (activeAlerts.length === 0) {
    return ['happy'];
  }

  const states: AvatarState[] = [];
  const alertTitles = activeAlerts.map(a => a.title.toLowerCase());
  const alertMessages = activeAlerts.map(a => a.message.toLowerCase());
  const allText = [...alertTitles, ...alertMessages].join(' ');

  // TODO: Replace with policy type mapping when real data is available
  // Example future implementation:
  // const policyToStateMap = {
  //   food: 'hungry',
  //   water: 'thirsty',
  //   shelter: 'wet',
  //   rest: 'tired'
  // };
  // return questions
  //   .filter(q => !q.compliant && q.requiresRemediation)
  //   .map(q => policyToStateMap[q.policyType]);

  // Check for each state type based on keywords
  if (allText.includes('malnutrition') || allText.includes('food') || allText.includes('hungry') || allText.includes('nutrition')) {
    states.push('hungry');
  }
  
  if (allText.includes('shelter') || allText.includes('housing') || allText.includes('wet') || allText.includes('homeless')) {
    states.push('wet');
  }
  
  if (allText.includes('thirst') || allText.includes('water') || allText.includes('hydration') || allText.includes('drink')) {
    states.push('thirsty');
  }
  
  if (allText.includes('tired') || allText.includes('fatigue') || allText.includes('exhausted') || allText.includes('sleep')) {
    states.push('tired');
  }

  return states.length > 0 ? states : ['happy'];
}

/**
 * Maps compliance alerts to duck avatar states (single state - for backward compatibility)
 * Priority order: hungry > wet > thirsty > tired > happy
 */
export function determineAvatarState(alerts: Alert[]): AvatarState {
  const states = determineAvatarStates(alerts);
  return states[0] || 'happy';
}
