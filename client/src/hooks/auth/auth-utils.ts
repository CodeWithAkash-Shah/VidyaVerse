
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from './types';

export const fetchUserProfile = async (authUser: User): Promise<UserProfile | null> => {
  try {
    // Fetch the user's profile from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        avatar_url: data.avatar_url
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Define test accounts for easy login
export const testAccounts = [
  { email: 'admin@gmail.com', password: '123456', role: 'admin', name: 'Admin User' },
  { email: 'teacher@gmail.com', password: '123456', role: 'teacher', name: 'Teacher User' },
  { email: 'student@gmail.com', password: '123456', role: 'student', name: 'Student User' }
];

export const getTestUser = (email: string, password: string) => {
  return testAccounts.find(
    account => account.email === email && account.password === password
  );
};

export const createTestUserSession = (testAccount: typeof testAccounts[0]) => {
  const testUser = {
    id: `test-${testAccount.role}-${Date.now()}`,
    email: testAccount.email,
    name: testAccount.name,
    role: testAccount.role as UserRole
  };

  localStorage.setItem('VidyaVerse_testUser', JSON.stringify(testUser));
  return testUser;
};
