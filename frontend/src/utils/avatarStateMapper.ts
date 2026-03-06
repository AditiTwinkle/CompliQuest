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
 * Maps policy IDs to duck states:
 * - policy-1 → hungry
 * - policy-2 → wet
 * - policy-3 → tired
 * - policy-4 → thirsty
 */
export function determineAvatarStates(alerts: Alert[]): AvatarState[] {
  if (!alerts || alerts.length === 0) {
    return ['happy'];
  }

  const activeAlerts = alerts.filter(alert => alert.status === 'active' || alert.status === 'open');

  if (activeAlerts.length === 0) {
    return ['happy'];
  }

  const states: AvatarState[] = [];

  // Map policy IDs to duck states
  const policyToStateMap: Record<string, AvatarState> = {
    'policy-1': 'hungry',
    'policy-2': 'wet',
    'policy-3': 'tired',
    'policy-4': 'thirsty',
  };

  // Check each alert's ID and map to corresponding state
  activeAlerts.forEach(alert => {
    const state = policyToStateMap[alert.id];
    if (state && !states.includes(state)) {
      states.push(state);
    }
  });

  console.log('Duck state mapping:', {
    alertIds: activeAlerts.map(a => a.id),
    mappedStates: states,
    finalState: states.length > 0 ? states : ['happy']
  });

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
