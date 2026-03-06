/**
 * Mock alert scenarios for testing duck state logic
 */

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
}

export const alertScenarios = {
  // No alerts - happy duck
  allGood: [] as Alert[],

  // Single issue scenarios
  malnutritionOnly: [
    {
      id: 'alert-1',
      title: 'Malnutrition',
      message: 'Missing food resources',
      severity: 'high' as const,
      status: 'active',
    },
  ],

  shelterOnly: [
    {
      id: 'alert-2',
      title: 'Shelter',
      message: 'Missing shelter resources',
      severity: 'high' as const,
      status: 'active',
    },
  ],

  thirstOnly: [
    {
      id: 'alert-3',
      title: 'Water Access',
      message: 'Thirsty - need water resources',
      severity: 'medium' as const,
      status: 'active',
    },
  ],

  tiredOnly: [
    {
      id: 'alert-4',
      title: 'Fatigue',
      message: 'Tired - workload too high',
      severity: 'medium' as const,
      status: 'active',
    },
  ],

  // Multiple issues - will show highest priority
  malnutritionAndShelter: [
    {
      id: 'alert-1',
      title: 'Malnutrition',
      message: 'Missing food resources',
      severity: 'high' as const,
      status: 'active',
    },
    {
      id: 'alert-2',
      title: 'Shelter',
      message: 'Missing shelter resources',
      severity: 'high' as const,
      status: 'active',
    },
  ],

  allIssues: [
    {
      id: 'alert-1',
      title: 'Malnutrition',
      message: 'Missing food resources',
      severity: 'critical' as const,
      status: 'active',
    },
    {
      id: 'alert-2',
      title: 'Shelter',
      message: 'Missing shelter resources',
      severity: 'high' as const,
      status: 'active',
    },
    {
      id: 'alert-3',
      title: 'Water Access',
      message: 'Thirsty - need water resources',
      severity: 'medium' as const,
      status: 'active',
    },
    {
      id: 'alert-4',
      title: 'Fatigue',
      message: 'Tired - workload too high',
      severity: 'low' as const,
      status: 'active',
    },
  ],
};

// Helper to get a random scenario for testing
export function getRandomScenario(): Alert[] {
  const scenarios = Object.values(alertScenarios);
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}
