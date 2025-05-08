
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLinks } from "./navbar/NavbarLinks";
import { NavbarAuth } from "./navbar/NavbarAuth";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{t('app.name')}</span>
            </Link>
            <NavbarLinks isAuthenticated={isAuthenticated} />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <NavbarAuth isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </nav>
  );
};
