
import { Button } from "@/components/ui/button";
import { Home, LogIn, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Error403() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-yellow-600 mb-4">403</div>
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Forbidden</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this resource. This might be because you're not logged in or don't have the required privileges.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/login">
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-yellow-100 rounded-lg text-sm text-yellow-700">
          <p className="font-medium mb-2">Possible reasons:</p>
          <ul className="text-left space-y-1">
            <li>• You're not signed in to your account</li>
            <li>• Your session has expired</li>
            <li>• You don't have permission for this content</li>
            <li>• This area is restricted to certain user roles</li>
          </ul>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>If you believe you should have access, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
