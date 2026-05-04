import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';
import type { UserRole, Employee } from '@/types/types';
import { getUserRole } from '@/lib/helpers';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (data: { email: string; password: string; full_name: string; department: string; office_location: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      setUser(null);
      setEmployee(null);
      setRole(null);
      return;
    }

    setUser(currentUser);

    const userRole = await getUserRole();
    setRole(userRole);

    if (userRole === 'employee') {
      const { data: employeeData } = await supabase
        .from('employees')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();
      
      setEmployee(employeeData);
    }
  };

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          getUserRole().then(setRole);
          if (session.user.email !== 'lisa@itfix.com') {
            supabase
              .from('employees')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle()
              .then(({ data }) => setEmployee(data));
          }
        }
      })
      .catch(error => {
        toast.error(`Failed to get user session: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getUserRole().then(setRole);
        if (session.user.email !== 'lisa@itfix.com') {
          supabase
            .from('employees')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
            .then(({ data }) => setEmployee(data));
        }
      } else {
        setEmployee(null);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (data: { email: string; password: string; full_name: string; department: string; office_location: string }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: insertError } = await supabase
          .from('employees')
          .insert({
            id: authData.user.id,
            full_name: data.full_name,
            email: data.email,
            department: data.department,
            office_location: data.office_location,
          });

        if (insertError) throw insertError;
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmployee(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, employee, role, loading, signIn, signUp, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
