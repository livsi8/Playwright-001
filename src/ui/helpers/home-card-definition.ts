export interface HomeCardDefinition {
  title: string;
  expectedPath: string;
}

export const HOME_CARD_DEFINITIONS: readonly HomeCardDefinition[] = [
  { title: 'Elements', expectedPath: '/elements' },
  { title: 'Forms', expectedPath: '/forms' },
  { title: 'Alerts, Frame & Windows', expectedPath: '/alertsWindows' },
  { title: 'Widgets', expectedPath: '/widgets' },
  { title: 'Interactions', expectedPath: '/interaction' },
  { title: 'Book Store Application', expectedPath: '/books' }
] as const;
