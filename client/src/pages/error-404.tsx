
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "wouter";

export default function Error404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Link href="/#contact">
            <Button variant="outline" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-100 rounded-lg text-sm text-blue-700">
          <p className="font-medium mb-2">What can you do?</p>
          <ul className="text-left space-y-1">
            <li>• Check the URL for any typos</li>
            <li>• Use the navigation menu to find what you're looking for</li>
            <li>• Return to the homepage</li>
            <li>• Contact support if you need assistance</li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Error Code: 404 | {new Date().toISOString()}</p>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
