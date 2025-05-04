import { Link, useLocation } from "react-router-dom"
import { BookOpen, Calendar, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from "react-redux"
import LogoutButton from "./LogoutButton"

const Navbar = () => {
    const location = useLocation()
    const path = location.pathname
    const data = useSelector(state => state.auth);
    const user = data.user;
    let navItems = [];
    const isUserLoggedIn = !!user

    if (user?.role === 'student') {
        navItems = [
          { label: "Dashboard", path: "/dashboard", icon: User },
          { label: "Notes", path: '/notes', icon: BookOpen },
          { label: "Doubts", path: '/doubts', icon: MessageCircle },
          { label: "Events", path: '/events', icon: Calendar },
        ];
      } else if (user?.role === 'teacher') {
        navItems = [
          { label: "Dashboard", path: "/dashboard", icon: User },
        //   { label: "Events", path: '/events', icon: Calendar }, 
        ];
      }

    return (
        <div className="sticky top-0 bg-card border-b border-border z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link to={isUserLoggedIn ? "/" : "/auth"}>
                            <h1 className="text-xl font-bold">
                                VidyaVerse
                            </h1>
                        </Link>
                    </div>

                    {/* Nav Links */}
                    {isUserLoggedIn && (
                        <div className="hidden md:flex items-center space-x-4">
                            {navItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${path === item.path
                                        ? 'bg-gray-800 text-gray-50 dark:bg-scholar-900/60 dark:text-scholar-300 font-bold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-4">
                        {/* Auth Buttons / Profile */}
                        {isUserLoggedIn ? (
                            <>
                                {/* Notifications */}
                                {/* <Link to="/notifications">
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {user?.role === 'admin'
                                                ? 5
                                                : user?.role === 'teacher'
                                                    ? 2
                                                    : 3}
                                        </span>
                                    </Button>
                                </Link> */}

                                {/* Profile Avatar */}
                                {/* <Link to="/" className="flex items-center gap-2"> */}
                                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-scholar-200 transition-all">
                                    <AvatarImage src="" alt={user?.username} />
                                    <AvatarFallback className="bg-scholar-200 text-scholar-700 dark:bg-scholar-700 dark:text-scholar-200">
                                        {user?.username
                                            ? user.username
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()
                                            : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block text-sm">
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-xs text-gray-500 capitalize">
                                        {user.role}
                                    </div>
                                </div>
                                    <LogoutButton/>
                                {/* </Link> */}
                            </>
                        ) : (
                            path !== "/auth" && (
                                <Button
                                    size="sm"
                                    className="bg-scholar-600 hover:bg-scholar-700"
                                    asChild
                                >
                                    <Link to="/auth">
                                        <User className="mr-2 h-4 w-4" />
                                        Sign In
                                    </Link>
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
