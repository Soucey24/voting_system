import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string; requiresFaceEnrollment?: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserFaceEnrollment: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchUserData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserData();
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }

  async function fetchUserData() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setState({ user: null, isLoading: false, isAuthenticated: false });
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error || !userData) {
        setState({ user: null, isLoading: false, isAuthenticated: false });
        return;
      }

      setState({
        user: userData as User,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }

  async function login(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return { error: 'Authentication failed' };

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError || !userData) {
        return { error: 'User profile not found' };
      }

      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authUser.id);

      setState({
        user: userData as User,
        isLoading: false,
        isAuthenticated: true,
      });

      const user = userData as User;
      if (user.role === 'student' && !user.is_face_enrolled) {
        return { requiresFaceEnrollment: true };
      }

      return {};
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }

  async function refreshUser() {
    await fetchUserData();
  }

  function updateUserFaceEnrollment() {
    if (state.user) {
      setState({
        ...state,
        user: { ...state.user, is_face_enrolled: true },
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshUser,
        updateUserFaceEnrollment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
