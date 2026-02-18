// Development Mode Configuration
// Set VITE_DEV_MODE=true in .env to use mock authentication and data

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

export const isDevMode = () => DEV_MODE;

export const getAuthService = async () => {
  if (DEV_MODE) {
    // Use mock authentication
    const module = await import('../services/mockAuthService.js');
    return module.default;
  }
  // Use real authentication
  const module = await import('../services/api');
  return module.authService;
};

export const getDataService = async () => {
  if (DEV_MODE) {
    // Use mock data
    const module = await import('../services/mockDataService.js');
    return module.default;
  }
  // Use real API
  const module = await import('../services/api');
  return module.default;
};

export const quickLogin = {
  admin: () => ({
    email: 'admin@funkidz.fr',
    password: 'admin123',
  }),
  user: () => ({
    email: 'user@funkidz.fr',
    password: 'user123',
  }),
};
