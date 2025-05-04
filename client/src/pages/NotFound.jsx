import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4 border-gray-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">404 - Page Not Found</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            The page you’re looking for doesn’t exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Let’s get you back on track. Try one of the options below.
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild className="bg-gray-800 hover:bg-gray-600 text-white">
              <Link to="/dashboard">Go to Home</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100">
              <Link to="/signup">Create an Account</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:bg-gray-100"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="justify-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default NotFound;