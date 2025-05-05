
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import SignInSignUp from './SignInSignUp';

// Define test accounts for easy login
const testAccounts = [
  { email: 'admin@gmail.com', password: '123', role: 'admin', name: 'Admin User' },
  { email: 'teacher@gmail.com', password: '123', role: 'teacher', name: 'Teacher User' },
  { email: 'student@gmail.com', password: '123', role: 'student', name: 'Student User' }
];

// Handle successful authentication
interface User {
  id: string;
  email: string;
  name: string;
  role: string | null;
}

// Handle sign in
interface SignInValues {
  email: string;
  password: string;
  role?: string;
}


const Auth = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, login, signup } = useAuth();
  const { translate } = useLanguage();

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      console.log("Redirecting authenticated user:", user);
      redirectBasedOnRole(user.role);
    }
  }, [user, navigate]);

  const redirectBasedOnRole = (role: string | null) => {
    switch (role) {
      case 'teacher':
        navigate('/');
        break;
      case 'admin':
        navigate('/');
        break;
      case 'student':
        navigate('/');
        break;
      default:
        navigate('/'); // Default fallback
    }
  };

  // Handle pre-filling test account credentials
  const handleTestAccountLogin = (account: typeof testAccounts[0]) => {
    // Create a test user and store in localStorage
    const testUser = {
      id: `test-${account.role}-${Date.now()}`,
      email: account.email,
      name: account.name,
      role: account.role
    };

    localStorage.setItem('VidyaVerse_testUser', JSON.stringify(testUser));
    toast.success(`${translate('welcome')}, ${account.name}!`);

    // Redirect based on role
    redirectBasedOnRole(account.role);
  };



  const handleSignIn = async (values: SignInValues) => {
    try {
      // Check if this is one of our test accounts
      const testAccount = testAccounts.find(
        account => account.email === values.email && account.password === values.password
      );

      if (testAccount) {
        console.log("Using test account:", testAccount.email);
        // Create a test user
        const testUser = {
          id: `test-${testAccount.role}-${Date.now()}`,
          email: testAccount.email,
          name: testAccount.name,
          role: testAccount.role
        };

        // Store the test user in localStorage to persist the session
        localStorage.setItem('VidyaVerse_testUser', JSON.stringify(testUser));
        toast.success(`${translate('welcome')}, ${testAccount.name}!`);

        return testUser;
      } else {
        // Regular Supabase authentication
        const user = await login(values.email, values.password, values.role);
        console.log("Sign in successful, user:", user);
        toast.success(`${translate('welcome')} ${user.name || values.email}!`);
        return user;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Sign in failed. Please check your credentials.");
      throw error;
    }
  };

  // Handle sign up
  const handleSignUp = async (values: any) => {
    try {
      const user = await signup(values.name, values.email, values.password, values.role);
      console.log("Sign up successful, user:", user);
      toast.success("Account created successfully!");
      return user;
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Sign up failed. Please try again.");
      throw error;
    }
  };

  const handleAuthSuccess = (user: User) => {
    console.log("Authentication successful, user:", user);
    redirectBasedOnRole(user.role);
  };

  return (
    <>
      <div className={`min-h-screen flex flex-col ${isMobile ? 'px-4' : ''} bg-background text-foreground`}>
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <div className="mb-8 flex flex-col items-center">
            {/* <VidyaVerseLogo size="lg" /> */}
            <p className="mt-2 text-muted-foreground text-center max-w-md">
              {translate('connect_learn_grow')}
            </p>
          </div>

          <SignInSignUp
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onSuccess={handleAuthSuccess}
          />

          <div className="mt-8 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-medium text-center mb-3">{translate('quick_access')}</h3>
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start text-left"
                onClick={() => handleTestAccountLogin(testAccounts[0])}
              >
                <span className="font-bold mr-2">{translate('admin')}:</span> admin@gmail.com (Pass: 123)
              </Button>
              <Button
                variant="outline"
                className="justify-start text-left"
                onClick={() => handleTestAccountLogin(testAccounts[1])}
              >
                <span className="font-bold mr-2">{translate('teacher')}:</span> teacher@gmail.com (Pass: 123)
              </Button>
              <Button
                variant="outline"
                className="justify-start text-left"
                onClick={() => handleTestAccountLogin(testAccounts[2])}
              >
                <span className="font-bold mr-2">{translate('student')}:</span> student@gmail.com (Pass: 123)
              </Button>
            </div>
          </div>
        </div>

        <footer className="py-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} VidyaVerse. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Auth;
