import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { demoUser } from '../data/demo';
import { supabase, isSupabaseConfigured } from '../services/supabase';

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

  // Check Supabase session on mount
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              currency: 'INR',
              role: session.user.email.includes('admin') ? 'admin' : 'user',
            });
            setIsDemo(false);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase auth session check failed, using demo fallback:', err);
        }
      }

      // Default demo user fallback
      if (mounted) {
        setUser(demoUser);
        setIsDemo(true);
        setLoading(false);
      }
    }

    checkSession();

    // Subscribe to auth state changes
    let authListener = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            currency: 'INR',
            role: session.user.email.includes('admin') ? 'admin' : 'user',
          });
          setIsDemo(false);
        }
      });
      authListener = data;
    }

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);

    // If demo credentials, allow instant login
    if (email === 'demo@livepulse.app' || email === 'admin@livepulse.app') {
      await new Promise((r) => setTimeout(r, 400));
      const isAdmin = email.includes('admin');
      setUser({
        ...demoUser,
        email,
        full_name: isAdmin ? 'System Administrator' : 'Arjun Mehta',
        role: isAdmin ? 'admin' : 'user',
      });
      setIsDemo(true);
      setLoading(false);
      return { success: true };
    }

    // Try Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
            currency: 'INR',
            role: data.user.email.includes('admin') ? 'admin' : 'user',
          });
          setIsDemo(false);
          setLoading(false);
          return { success: true };
        }
      } catch (err) {
        setLoading(false);
        throw err;
      }
    }

    // Generic fallback login
    await new Promise((r) => setTimeout(r, 500));
    setUser({ ...demoUser, email, full_name: email.split('@')[0] });
    setIsDemo(true);
    setLoading(false);
    return { success: true };
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            currency: 'INR',
            role: 'user',
          });
          setIsDemo(false);
          setLoading(false);
          return { success: true };
        }
      } catch (err) {
        setLoading(false);
        throw err;
      }
    }

    // Fallback simulation
    await new Promise((r) => setTimeout(r, 600));
    setUser({ ...demoUser, email, full_name: fullName });
    setIsDemo(true);
    setLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout warning:', err);
      }
    }
    setUser(null);
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (isSupabaseConfigured() && user?.id && !isDemo) {
      try {
        await supabase.from('profiles').update(updates).eq('id', user.id);
      } catch (err) {
        console.warn('Profile update error:', err);
      }
    }
    setUser((prev) => ({ ...prev, ...updates }));
    return { success: true };
  }, [user, isDemo]);

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
