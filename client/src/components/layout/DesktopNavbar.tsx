
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, Calendar, FileText, GraduationCap, Home, MessageCircle, Search, Settings, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useAuth } from '@/hooks/auth';
// import VidyaVerseLogo from './VidyaVerseLogo';
import { useLanguage } from '@/hooks/use-language';
import LanguageSelector from '../LanguageSelector';

interface DesktopNavbarProps {
  userType?: string;
  isLoggedIn?: boolean;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  userType,
  isLoggedIn
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { user, logout } = useAuth();
  const { translate } = useLanguage();

  // If isLoggedIn is explicitly provided, use it; otherwise check for user
  const isUserLoggedIn = isLoggedIn !== undefined ? isLoggedIn : !!user;

  // Base navigation items (common for all)
  const baseNavItems = [
    { icon: Home, label: translate('home'), path: '/' },
  ];

  // Student-specific navigation items
  const studentNavItems = [
    ...baseNavItems,
    { icon: BookOpen, label: translate('notes'), path: '/notes' },
    { icon: MessageCircle, label: translate('doubts'), path: '/doubts' },
    { icon: Calendar, label: translate('events'), path: '/events' }
  ];

  // Teacher-specific navigation items
  const teacherNavItems = [
    ...baseNavItems,
    { icon: GraduationCap, label: translate('classes'), path: '/classes' },
    { icon: FileText, label: translate('assignments'), path: '/assignments' },
    { icon: Calendar, label: translate('schedule'), path: '/schedule' }
  ];

  // Admin-specific navigation items
  const adminNavItems = [
    ...baseNavItems,
    { icon: Users, label: translate('faculty'), path: '/faculty' },
    { icon: Calendar, label: translate('calendar'), path: '/calendar' }
  ];

  // Add Settings only for admin
  if (user?.role === 'admin') {
    adminNavItems.push({ icon: Settings, label: translate('settings'), path: '/settings' });
  }

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Select navigation items based on user type
  const navItems =
    userType === 'teacher' || user?.role === 'teacher' ? teacherNavItems :
      userType === 'admin' || user?.role === 'admin' ? adminNavItems :
        studentNavItems; // default to student

  return (
    <div className="sticky top-0 bg-card border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link to={isUserLoggedIn ? "/" : "/auth"}>
              {/* <VidyaVerseLogo size="sm" /> */}
            </Link>
          </div>

          {!isUserLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${path === item.path
                      ? 'bg-scholar-50 text-scholar-700 dark:bg-scholar-900/60 dark:text-scholar-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {isUserLoggedIn && (
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-8 h-9 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            )}

            {/* <LanguageSelector /> */}
            <ThemeToggle />

            {isUserLoggedIn ? (
              <>
                <Link to="/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {userType === 'admin' || user?.role === 'admin' ? 5 : userType === 'teacher' || user?.role === 'teacher' ? 2 : 3}
                    </span>
                  </Button>
                </Link>

                <Link to="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-scholar-200 transition-all">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-scholar-200 text-scholar-700 dark:bg-scholar-700 dark:text-scholar-200">
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              path !== '/auth' && (
                <Button size="sm" className="bg-scholar-600 hover:bg-scholar-700" asChild>
                  <Link to="/auth">
                    <User className="mr-2 h-4 w-4" />
                    {translate('signin')}
                  </Link>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
