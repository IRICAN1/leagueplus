import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLinks } from "./navbar/NavbarLinks";
import { NavbarAuth } from "./navbar/NavbarAuth";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-xl text-purple-600">LeaguePlus</span>
            </Link>
            <NavbarLinks isAuthenticated={isAuthenticated} />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <NavbarAuth isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </nav>
  );
};