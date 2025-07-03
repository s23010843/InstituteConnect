import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  RefreshCcw, 
  Home, 
  AlertTriangle, 
  Clock,
  Wifi,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function Error502() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  useEffect(() => {
    // Estimate recovery time based on typical server issues
    const recoveryTimes = [
      "2-3 minutes",
      "5-10 minutes", 
      "10-15 minutes",
      "15-30 minutes"
    ];
    
    const timeIndex = Math.min(retryCount, recoveryTimes.length - 1);
    setEstimatedTime(recoveryTimes[timeIndex]);
  }, [retryCount]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setProgress(0);
    
    // Simulate progress while checking server
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      // Check server health
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        setProgress(100);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error('Server still unavailable');
      }
    } catch (error) {
      setRetryCount(prev => prev + 1);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setIsRetrying(false);
    }
  };

  const serverIssues = [
    {
      title: "Gateway Timeout",
      description: "The server is taking too long to respond",
      likelihood: retryCount < 2 ? "high" : "medium"
    },
    {
      title: "Server Overload",
      description: "High traffic may be affecting response times",
      likelihood: retryCount < 3 ? "medium" : "high"
    },
    {
      title: "Maintenance",
      description: "Scheduled or emergency server maintenance",
      likelihood: retryCount > 2 ? "medium" : "low"
    }
  ];

  const quickActions = [
    {
      title: "Check Status Page",
      description: "View current system status",
      icon: Wifi,
      action: () => window.open('#status', '_blank')
    },
    {
      title: "Contact Support",
      description: "Report the issue to our team",
      icon: MessageCircle,
      action: () => window.location.href = '#contact'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-orange-100 rounded-full"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Server className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-6xl font-bold text-orange-600">502</div>
            <h1 className="text-3xl font-bold text-gray-900">Bad Gateway</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              We're experiencing server connectivity issues. Our team is working to resolve this quickly.
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Gateway Status</span>
              <Badge variant="destructive">Unavailable</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Retry Attempts</span>
              <Badge variant="outline">{retryCount}/5</Badge>
            </div>

            {estimatedTime && (
              <div className="flex items-center justify-between">
                <span>Estimated Recovery</span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {estimatedTime}
                </div>
              </div>
            )}

            {isRetrying && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Checking server...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={handleRetry}
              disabled={isRetrying || retryCount >= 5}
              className="w-full"
              variant="outline"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Checking Server...' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>

        {/* Possible Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Possible Causes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {serverIssues.map((issue, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-white">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  issue.likelihood === 'high' ? 'bg-red-500' :
                  issue.likelihood === 'medium' ? 'bg-orange-500' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{issue.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={
                        issue.likelihood === 'high' ? 'border-red-200 text-red-700' :
                        issue.likelihood === 'medium' ? 'border-orange-200 text-orange-700' :
                        'border-gray-200 text-gray-700'
                      }
                    >
                      {issue.likelihood}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors text-left"
              >
                <div className="p-2 bg-orange-100 rounded-lg">
                  <action.icon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
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
          
          <Link href="/contact" className="flex-1">
            <Button className="w-full" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Technical Details */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-gray-900 mb-3">Technical Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Error Code:</strong> 502 Bad Gateway</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              <p><strong>Request ID:</strong> {Math.random().toString(36).substr(2, 9)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
