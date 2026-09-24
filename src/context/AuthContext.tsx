import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../types';
import { api, getToken, setToken, removeToken } from '../services/api';

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateAdmin: (admin: AdminUser) => void;
  refreshMe: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res.success && res.data) {
        setAdmin(res.data);
      } else {
        removeToken();
        setAdmin(null);
      }
    } catch {
      removeToken();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.auth.login(credentials);
    if (res.success && res.token && res.admin) {
      setToken(res.token);
      setAdmin(res.admin);
    } else {
      throw new Error(res.message || 'Login failed.');
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network errors during logout
    } finally {
      removeToken();
      setAdmin(null);
    }
  };

  const updateAdmin = (updated: AdminUser) => {
    setAdmin(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        updateAdmin,
        refreshMe,
        refreshAdmin: refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
