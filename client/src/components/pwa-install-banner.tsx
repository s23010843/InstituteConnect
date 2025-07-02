import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-institute-blue text-white p-4 rounded-lg material-shadow-lg z-50 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Download className="h-6 w-6 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-sm">Install Excellence Institute</p>
            <p className="text-blue-100 text-xs">Get quick access to your courses and campus resources</p>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <Button 
            onClick={handleInstall}
            size="sm"
            className="bg-institute-orange hover:bg-orange-600 text-white font-medium"
          >
            Install
          </Button>
          <Button 
            onClick={handleDismiss}
            variant="ghost" 
            size="sm"
            className="text-blue-200 hover:text-white hover:bg-white/10 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
