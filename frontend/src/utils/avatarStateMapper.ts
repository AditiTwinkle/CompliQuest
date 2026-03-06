import { AvatarState } from '../components/LSEGlingAvatar';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
}

/**
 * Get all applicable states for the duck (supports multi-state)
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

  // Check for each state type
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
