import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { demoUser } from '../data/demo';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    // Phase 1: Auto-login with demo user
    const timer = setTimeout(() => {
      setUser(demoUser);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 600));
    const isAdmin = email.toLowerCase().includes('admin');
    setUser({
      ...demoUser,
      email,
      full_name: isAdmin ? 'System Administrator' : (demoUser.full_name || 'Arjun Mehta'),
      role: isAdmin ? 'admin' : 'user',
    });
    setLoading(false);
    return { success: true };
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser({ ...demoUser, email, full_name: fullName });
    setLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setUser(null);
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
