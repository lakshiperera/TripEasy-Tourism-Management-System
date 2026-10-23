import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const HARDCODED_ADMIN = {
  id: '662652000000000000000001',
  username: 'admin',
  email: 'admin@tripeasy.lk',
  role: 'superadmin',
};

export const HARDCODED_PASSWORD = 'Admin@2024';

/**
 * AuthProvider — manages admin authentication state
 */
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedAdmin = localStorage.getItem('tripeasy_admin');
      const token = localStorage.getItem('tripeasy_token');

      if (savedAdmin) {
        try {
          const parsed = JSON.parse(savedAdmin);
          setAdmin(parsed);
        } catch {
          // Ignore parse errors
        }
      }

      if (token && token !== 'tripeasy_hardcoded_admin_jwt_token') {
        try {
          const res = await authService.getMe();
          if (res?.data?.admin) {
            setAdmin(res.data.admin);
          }
        } catch {
          if (!savedAdmin) {
            localStorage.removeItem('tripeasy_token');
            localStorage.removeItem('tripeasy_admin');
            setAdmin(null);
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const username = (credentials?.username || '').trim().toLowerCase();
    const password = credentials?.password || '';

    // If hardcoded credentials match, allow immediate entry without needing DB/backend
    if (username === HARDCODED_ADMIN.username.toLowerCase() && password === HARDCODED_PASSWORD) {
      const token = 'tripeasy_hardcoded_admin_jwt_token';
      localStorage.setItem('tripeasy_token', token);
      localStorage.setItem('tripeasy_admin', JSON.stringify(HARDCODED_ADMIN));
      setAdmin(HARDCODED_ADMIN);

      // Opportunistically sync with backend if online, but ignore failures
      try {
        const res = await authService.login(credentials);
        if (res?.data?.token) {
          localStorage.setItem('tripeasy_token', res.data.token);
        }
      } catch (err) {
        console.info('Backend DB not connected; using hardcoded admin credentials.');
      }

      return HARDCODED_ADMIN;
    }

    // Normal backend authentication
    const res = await authService.login(credentials);
    const { token, admin: adminData } = res.data;
    localStorage.setItem('tripeasy_token', token);
    localStorage.setItem('tripeasy_admin', JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    localStorage.removeItem('tripeasy_token');
    localStorage.removeItem('tripeasy_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
