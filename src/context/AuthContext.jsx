import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getAuthService } from '../config/devMode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authService, setAuthService] = useState(null);

  // Charger dynamiquement le service d'authentification (mock ou réel)
  useEffect(() => {
    (async () => {
      const service = await getAuthService();
      setAuthService(service);
    })();
  }, []);

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    if (!authService) return;
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authService]);

  const login = useCallback(async (email, password) => {
    if (!authService) throw new Error('Service d\'authentification non chargé');
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      const { access, user: userData, token } = response.data;
      localStorage.setItem('token', access || token);
      setUser(userData || response.data.user);
      setIsAuthenticated(true);
      return userData || response.data.user;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erreur de connexion';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const signup = useCallback(async (firstName, lastName, email, password) => {
    if (!authService) throw new Error('Service d\'authentification non chargé');
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.signup(firstName, lastName, email, password);
      const { access, user: userData, token } = response.data;
      localStorage.setItem('token', access || token);
      setUser(userData || response.data.user);
      setIsAuthenticated(true);
      return userData || response.data.user;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Erreur lors de l'inscription";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(() => {
    if (!authService) return;
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, [authService]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    authServiceLoaded: !!authService,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}
