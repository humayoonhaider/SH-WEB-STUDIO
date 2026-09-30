import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PublicUser } from '../types';
import { api, getUserToken, setUserToken, removeUserToken } from '../services/api';

interface UserAuthContextType {
  user: PublicUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
    referralCode?: string;
  }) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: PublicUser) => void;
  refreshUser: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getUserToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.userAuth.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        removeUserToken();
        setUser(null);
      }
    } catch {
      removeUserToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
    referralCode?: string;
  }) => {
    const res = await api.userAuth.register(data);
    if (res.success && res.token && res.user) {
      setUserToken(res.token, true);
      setUser(res.user);
    } else {
      throw new Error(res.message || 'Registration failed.');
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.userAuth.login(credentials);
    if (res.success && res.token && res.user) {
      setUserToken(res.token, true);
      setUser(res.user);
    } else {
      throw new Error(res.message || 'Invalid email or password.');
    }
  };

  const logout = () => {
    removeUserToken();
    setUser(null);
  };

  const updateUser = (updated: PublicUser) => {
    setUser(updated);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
