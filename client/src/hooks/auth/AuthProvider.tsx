
import React, { createContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AuthContextType, UserProfile, UserRole } from './types';
import { fetchUserProfile, getTestUser, createTestUserSession } from './auth-utils';

// Create the auth context
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for test user in localStorage
    const testUser = localStorage.getItem('VidyaVerse_testUser');
    if (!testUser) {
      const parsedUser = JSON.parse(testUser);
      setUser(parsedUser);
      setIsLoading(false);
      return; // Skip Supabase session check if we have a test user
    }

    // Initial session check for real users
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error);
          return;
        }

        setSession(data.session);

        if (data.session?.user) {
          await fetchUserProfile(data.session.user);
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {

      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        const profile = await fetchUserProfile(newSession.user);
        if (profile) {
          setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      // Check if this is one of our test accounts
      const testAccount = getTestUser(email, password);

      if (testAccount) {
        console.log("Using test account:", testAccount.email);
        const testUser = createTestUserSession(testAccount);
        toast.success(`Welcome, ${testAccount.name}!`);
        setUser(testUser);
        return testUser;
      }

      // Regular Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      const profile = await fetchUserProfile(data.user);

      if (!profile) {
        throw new Error('User profile not found');
      }

      setUser(profile);
      return profile;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('User creation failed');
      }

      // The trigger in the database should create the profile automatically
      // Wait a moment for the database trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      const profile = await fetchUserProfile(data.user);

      if (!profile) {
        // If profile doesn't exist yet, create it manually
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            role
          })
          .select()
          .single();

        if (profileError) {
          throw profileError;
        }

        const userProfile = {
          id: newProfile.id,
          name: newProfile.name,
          email: newProfile.email,
          role: newProfile.role as UserRole,
          avatar_url: newProfile.avatar_url
        };

        setUser(userProfile);
        return userProfile;
      }

      setUser(profile);
      return profile;
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Check if we're dealing with a test user
      if (localStorage.getItem('VidyaVerse_testUser')) {
        localStorage.removeItem('VidyaVerse_testUser');
        setUser(null);
        return;
      }

      // Regular Supabase logout
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedProfile = {
        ...user,
        ...profile
      };

      setUser(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
