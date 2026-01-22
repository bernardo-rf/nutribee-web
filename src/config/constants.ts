export const APP_CONFIG = {
  name: 'NutriBee',
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
  },
  routes: {
    home: '/',
    clients: '/clients',
    appointments: '/appointments',
    reports: '/reports',
    profile: '/profile',
    settings: '/settings',
    login: '/login',
  },
} as const;

export const QUERY_KEYS = {
  clients: {
    all: ['clients'] as const,
    detail: (id: string) => ['clients', id] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    detail: (id: string) => ['appointments', id] as const,
  },
} as const; 