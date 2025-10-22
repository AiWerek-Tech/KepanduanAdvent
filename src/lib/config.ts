// Centralized configuration for the application
export const config = {
  // Base URL - single source of truth for all URL references
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai',
  
  // API endpoints
  api: {
    auth: '/api/auth',
    users: '/api/users',
    certificates: '/api/certificates',
    events: '/api/events',
    reports: '/api/reports',
    health: '/api/health'
  },
  
  // Application routes
  routes: {
    login: '/login',
    dashboard: '/new-dashboard',
    certificates: '/certificates',
    events: '/events',
    reports: '/reports',
    users: '/users',
    profile: '/profile',
    settings: '/settings'
  },
  
  // Helper function to get full URL
  getFullUrl: (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';
    return `${baseUrl}${path}`;
  },
  
  // Helper function to get API URL
  getApiUrl: (endpoint: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';
    return `${baseUrl}/api${endpoint}`;
  }
};

// Export individual parts for convenience
export const { baseUrl, api, routes, getFullUrl, getApiUrl } = config;