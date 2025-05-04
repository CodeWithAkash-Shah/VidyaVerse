import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Lock } from 'lucide-react';

function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4 border-gray-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Unauthorized Access</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            You don’t have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Please sign in with an authorized account or return to the home page.
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild className="bg-gray-800 hover:bg-gray-600 text-white">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100">
              <Link to="/signup">Create an Account</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-600 hover:bg-gray-100">
              <Link to="/dashboard">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="justify-center">
          <p className="text-xs text-gray-500">
            If you believe this is an error, contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Unauthorized;