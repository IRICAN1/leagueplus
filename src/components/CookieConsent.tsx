
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { Cookie } from "lucide-react";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    // Check if the user has already made a choice
    const hasConsent = localStorage.getItem("cookieConsent");
    
    // If no choice has been made yet, show the consent dialog
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
  };
  
  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowConsent(false);
  };
  
  if (!showConsent) return null;
  
  return (
    <>
      {/* Mobile banner */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 border-t">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <Cookie className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">{t('cookies.title')}</h3>
          </div>
          <p className="text-sm text-gray-600">{t('cookies.description')}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDecline}
              className="flex-1"
            >
              {t('cookies.decline')}
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {t('cookies.accept')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop dialog - using fixed positioning instead of Dialog component */}
      <div className="hidden md:block fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50 max-w-md">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">{t('cookies.title')}</h3>
          </div>
          <p className="text-sm text-gray-600">
            {t('cookies.description')}
          </p>
          <div className="text-xs bg-gray-50 p-3 rounded-md border border-gray-100">
            {t('cookies.policy')}
          </div>
          <div className="flex justify-between gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleDecline}
              size="sm"
            >
              {t('cookies.decline')}
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              {t('cookies.accept')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
