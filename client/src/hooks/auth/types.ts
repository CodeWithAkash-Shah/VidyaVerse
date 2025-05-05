
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'student' | 'teacher' | 'admin' | null;

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<UserProfile>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<UserProfile | null>;
}
