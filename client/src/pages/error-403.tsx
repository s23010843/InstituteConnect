import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Home, 
  LogIn, 
  Shield, 
  User,
  Clock,
  Key,
  AlertCircle,
  RefreshCcw,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function Error403() {
  const [userStatus, setUserStatus] = useState<'checking' | 'guest' | 'expired' | 'insufficient'>('checking');
  const [sessionInfo, setSessionInfo] = useState<{
    lastLogin?: Date;
    role?: string;
    expiresAt?: Date;
  }>({});

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      // Check authentication status
      const authCheck = await fetch('/api/auth/status', { 
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache'
      });

      if (authCheck.status === 401) {
        setUserStatus('guest');
      } else if (authCheck.status === 403) {
        const data = await authCheck.json();
        setUserStatus('insufficient');
        setSessionInfo({
          role: data.role || 'student',
          lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
        });
      } else if (authCheck.status === 419) {
        setUserStatus('expired');
      } else {
        setUserStatus('guest');
      }
    } catch (error) {
      setUserStatus('guest');
    }
  };

  const getStatusMessage = () => {
    switch (userStatus) {
      case 'guest':
        return {
          title: "Authentication Required",
          description: "You need to sign in to access this resource.",
          action: "Please log in with your credentials."
        };
      case 'expired':
        return {
          title: "Session Expired", 
          description: "Your session has expired for security reasons.",
          action: "Please log in again to continue."
        };
      case 'insufficient':
        return {
          title: "Access Denied",
          description: "Your account doesn't have permission to access this resource.",
          action: "Contact an administrator if you believe this is incorrect."
        };
      default:
        return {
          title: "Checking Access...",
          description: "Verifying your permissions.",
          action: "Please wait while we check your access level."
        };
    }
  };

  const accessRequirements = [
    {
      title: "Valid Account",
      description: "An active account with appropriate credentials",
      status: userStatus !== 'guest' ? 'met' : 'unmet'
    },
    {
      title: "Active Session",
      description: "A current, non-expired authentication session",
      status: userStatus !== 'expired' ? 'met' : 'unmet'
    },
    {
      title: "Sufficient Permissions",
      description: "The required role or permission level for this resource",
      status: userStatus !== 'insufficient' ? 'met' : 'unmet'
    }
  ];

  const quickActions = [
    {
      title: "Sign In",
      description: "Access your account",
      icon: LogIn,
      href: "/login",
      show: userStatus === 'guest' || userStatus === 'expired'
    },
    {
      title: "Contact Admin",
      description: "Request access permissions",
      icon: MessageCircle,
      href: "/contact",
      show: userStatus === 'insufficient'
    },
    {
      title: "Refresh Session",
      description: "Try to renew your session",
      icon: RefreshCcw,
      action: () => window.location.reload(),
      show: userStatus === 'expired'
    }
  ];

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-yellow-100 rounded-full"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Shield className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-6xl font-bold text-yellow-600">403</div>
            <h1 className="text-3xl font-bold text-gray-900">{statusInfo.title}</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              {statusInfo.description}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-yellow-600" />
              Access Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Current Status</span>
              <Badge variant={userStatus === 'checking' ? 'secondary' : 'destructive'}>
                {userStatus === 'checking' ? 'Checking...' : 'Access Denied'}
              </Badge>
            </div>

            {sessionInfo.role && (
              <div className="flex items-center justify-between">
                <span>Your Role</span>
                <Badge variant="outline" className="capitalize">
                  {sessionInfo.role}
                </Badge>
              </div>
            )}

            {sessionInfo.lastLogin && (
              <div className="flex items-center justify-between">
                <span>Last Login</span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {sessionInfo.lastLogin.toLocaleString()}
                </div>
              </div>
            )}

            {sessionInfo.expiresAt && (
              <div className="flex items-center justify-between">
                <span>Session Expires</span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {sessionInfo.expiresAt.toLocaleString()}
                </div>
              </div>
            )}

            <Button 
              onClick={checkUserSession}
              variant="outline"
              className="w-full"
              disabled={userStatus === 'checking'}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${userStatus === 'checking' ? 'animate-spin' : ''}`} />
              Check Status
            </Button>
          </CardContent>
        </Card>

        {/* Access Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Access Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accessRequirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-white">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  requirement.status === 'met' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{requirement.title}</h3>
                    <Badge 
                      variant={requirement.status === 'met' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {requirement.status === 'met' ? 'Met' : 'Not Met'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.filter(action => action.show).map((action, index) => (
              action.href ? (
                <Link key={index} href={action.href}>
                  <div className="w-full flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <action.icon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <action.icon className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              )
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button className="w-full" variant="default">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
          
          {(userStatus === 'guest' || userStatus === 'expired') && (
            <Link href="/login" className="flex-1">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Help Section */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Need Help?</AlertTitle>
              <AlertDescription className="mt-2">
                {statusInfo.action} If you continue to experience issues, 
                please contact our support team for assistance.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
