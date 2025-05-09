
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center z-50 px-4 pb-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:p-6 max-w-md mx-auto">
        <div className="flex flex-col space-y-3 md:space-y-4">
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
              className="flex-1"
            >
              {t('cookies.decline')}
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
              size="sm"
            >
              {t('cookies.accept')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
