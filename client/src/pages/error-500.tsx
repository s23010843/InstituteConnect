import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Home, 
  RefreshCcw, 
  AlertTriangle, 
  Clock,
  Server,
  MessageCircle,
  Bug,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "wouter";

export default function Error500() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [systemStatus, setSystemStatus] = useState({
    database: 'unknown',
    api: 'unknown', 
    cache: 'unknown'
  });

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    const services = ['database', 'api', 'cache'];
    const newStatus = { ...systemStatus };
    
    for (const service of services) {
      try {
        // Simulate health check (replace with actual health endpoints)
        const response = await fetch(`/api/health/${service}`, { 
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000)
        });
        newStatus[service as keyof typeof systemStatus] = response.ok ? 'healthy' : 'unhealthy';
      } catch (error) {
        newStatus[service as keyof typeof systemStatus] = 'unhealthy';
      }
    }
    
    setSystemStatus(newStatus);
  };

  const handleRefresh = async () => {
    setIsRetrying(true);
    setProgress(0);
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    try {
      // Check if server has recovered
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        setProgress(100);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error('Server still experiencing issues');
      }
    } catch (error) {
      setRetryCount(prev => prev + 1);
      setProgress(0);
      // Re-check system health after failure
      await checkSystemHealth();
    } finally {
      clearInterval(progressInterval);
      setIsRetrying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'unhealthy':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const troubleshootingSteps = [
    {
      step: 1,
      title: "Wait and Retry",
      description: "Server issues often resolve automatically within a few minutes",
      action: "Wait 2-3 minutes then refresh"
    },
    {
      step: 2,
      title: "Check Your Connection",
      description: "Ensure your internet connection is stable and working",
      action: "Test other websites"
    },
    {
      step: 3,
      title: "Clear Browser Cache",
      description: "Cached data might be causing conflicts",
      action: "Clear cache and cookies"
    },
    {
      step: 4,
      title: "Contact Support",
      description: "If the issue persists, our support team can help",
      action: "Report this error"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-6xl font-bold text-red-600">500</div>
            <h1 className="text-3xl font-bold text-gray-900">Internal Server Error</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Something went wrong on our end. We're working to fix this issue as quickly as possible.
            </p>
          </div>
        </div>

        {/* Error Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-600" />
              Error Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Error ID:</span>
                <p className="text-gray-600 font-mono">{errorId}</p>
              </div>
              <div>
                <span className="font-medium">Timestamp:</span>
                <p className="text-gray-600">{new Date().toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Retry Attempts</span>
              <Badge variant="outline">{retryCount}/3</Badge>
            </div>

            {isRetrying && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Checking server status...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={handleRefresh}
              disabled={isRetrying || retryCount >= 3}
              className="w-full"
              variant="outline"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="capitalize">{service}</span>
                </div>
                <Badge variant={getStatusColor(status) as any}>
                  {status === 'unknown' ? 'Checking...' : status}
                </Badge>
              </div>
            ))}
            
            <Button 
              onClick={checkSystemHealth}
              variant="outline" 
              size="sm"
              className="w-full mt-3"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {troubleshootingSteps.map((step, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-lg border bg-white">
                <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  <p className="text-xs text-red-600 mt-1 font-medium">{step.action}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button className="w-full" variant="default">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
          
          <Link href="/contact" className="flex-1">
            <Button className="w-full" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </Link>
        </div>

        {/* Support Info */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Need Immediate Help?</AlertTitle>
              <AlertDescription className="mt-2">
                If this error is preventing you from accessing critical information, 
                please contact our support team with error ID: <code className="bg-white px-1 rounded">{errorId}</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}