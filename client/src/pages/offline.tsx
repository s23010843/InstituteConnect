import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Wifi, 
  WifiOff, 
  RefreshCcw, 
  Home, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Inbox,
  Calendar,
  BookOpen
} from "lucide-react";
import { Link } from "wouter";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [pendingActions, setPendingActions] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for cached data and pending actions
    checkOfflineStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkOfflineStatus = async () => {
    try {
      // Check last sync time from localStorage
      const lastSyncTime = localStorage.getItem('lastSync');
      if (lastSyncTime) {
        setLastSync(new Date(lastSyncTime));
      }

      // Check for pending actions in IndexedDB
      if ('indexedDB' in window) {
        const dbRequest = indexedDB.open('ExcellenceInstituteDB', 1);
        dbRequest.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (db.objectStoreNames.contains('contactForms')) {
            const transaction = db.transaction(['contactForms'], 'readonly');
            const store = transaction.objectStore('contactForms');
            const countRequest = store.count();
            countRequest.onsuccess = () => {
              setPendingActions(countRequest.result);
            };
          }
        };
      }
    } catch (error) {
      console.error('Failed to check offline status:', error);
    }
  };

  const handleRetryConnection = async () => {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache' 
      });
      if (response.ok) {
        setIsOnline(true);
        window.location.reload();
      }
    } catch (error) {
      // Still offline
      console.log('Still offline');
    }
  };

  const offlineFeatures = [
    {
      icon: BookOpen,
      title: "Browse Programs",
      description: "View cached program information and course details",
      available: true
    },
    {
      icon: Calendar,
      title: "Academic Calendar",
      description: "Check important dates and deadlines",
      available: true
    },
    {
      icon: Inbox,
      title: "Contact Forms",
      description: "Submit forms - they'll sync when you're back online",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <WifiOff className="h-12 w-12 text-slate-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900">You're Offline</h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            No internet connection detected. Don't worry - you can still access some features using cached content.
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Network Status</span>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Connected" : "Offline"}
              </Badge>
            </div>
            
            {lastSync && (
              <div className="flex items-center justify-between">
                <span>Last Sync</span>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  {lastSync.toLocaleString()}
                </div>
              </div>
            )}

            {pendingActions > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pending Actions</AlertTitle>
                <AlertDescription>
                  You have {pendingActions} action(s) that will sync when you're back online.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleRetryConnection}
              className="w-full"
              variant="outline"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Check Connection
            </Button>
          </CardContent>
        </Card>

        {/* Available Features */}
        <Card>
          <CardHeader>
            <CardTitle>Available Offline Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {offlineFeatures.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  feature.available 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  feature.available ? 'bg-green-100' : 'bg-slate-100'
                }`}>
                  <feature.icon className={`h-5 w-5 ${
                    feature.available ? 'text-green-600' : 'text-slate-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900">{feature.title}</h3>
                    {feature.available && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
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
              Browse Offline Content
            </Button>
          </Link>
          
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-blue-900 mb-3">Offline Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your form submissions will be saved and sent when connection is restored</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Previously visited pages and cached content remain accessible</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Check your internet connection and try refreshing the page</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
