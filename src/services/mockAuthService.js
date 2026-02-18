// Mock Authentication Service for Development without Django Backend
// This allows testing the frontend without waiting for backend implementation

const MOCK_USERS = {
  'admin@funkidz.fr': {
    id: 1,
    email: 'admin@funkidz.fr',
    firstName: 'Admin',
    lastName: 'Funkidz',
    password: 'admin123',
    role: 'admin',
    token: 'mock_admin_token_12345',
  },
  'user@funkidz.fr': {
    id: 2,
    email: 'user@funkidz.fr',
    firstName: 'Client',
    lastName: 'Test',
    password: 'user123',
    role: 'user',
    token: 'mock_user_token_67890',
  },
};

const mockAuthService = {
  // Login with mock credentials
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS[email];
        if (user && user.password === password) {
          // Simulate successful login
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          }));
          
          resolve({
            data: {
              token: user.token,
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
              },
            },
          });
        } else {
          reject({
            response: {
              status: 401,
              data: { detail: 'Email ou mot de passe incorrect' },
            },
          });
        }
      }, 500); // Simulate network delay
    });
  },

  // Signup with mock registration
  signup: async (firstName, lastName, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (MOCK_USERS[email]) {
          reject({
            response: {
              status: 400,
              data: { detail: 'Email déjà utilisé' },
            },
          });
        } else {
          // Create new mock user
          const newUser = {
            id: Object.keys(MOCK_USERS).length + 1,
            email,
            firstName,
            lastName,
            password,
            role: 'user',
            token: `mock_token_${Math.random().toString(36).substr(2, 9)}`,
          };
          
          MOCK_USERS[email] = newUser;
          
          localStorage.setItem('token', newUser.token);
          localStorage.setItem('user', JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
          }));
          
          resolve({
            data: {
              token: newUser.token,
              user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
              },
            },
          });
        }
      }, 500);
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = localStorage.getItem('user');
        if (user) {
          resolve({ data: JSON.parse(user) });
        } else {
          reject({ response: { status: 401, data: { detail: 'Not authenticated' } } });
        }
      }, 200);
    });
  },

  // Logout
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        resolve({ data: { message: 'Logged out' } });
      }, 200);
    });
  },
};

export default mockAuthService;
