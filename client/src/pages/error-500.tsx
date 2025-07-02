import { Button } from "@/components/ui/button";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function Error500() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-red-600 mb-4">500</div>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Server Error</h1>
          <p className="text-gray-600 mb-8">
            Something went wrong on our end. We're working to fix this issue. Please try again in a few moments.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleRefresh}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-red-100 rounded-lg text-sm text-red-700">
          <p className="font-medium mb-2">What can you do?</p>
          <ul className="text-left space-y-1">
            <li>• Wait a few minutes and try again</li>
            <li>• Check your internet connection</li>
            <li>• Contact our support team if the problem persists</li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Error Code: 500 | {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}