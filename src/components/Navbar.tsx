import { Home, Search, History, Users, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: History, label: "History", path: "/history" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:top-0 md:bottom-auto animate-slide-in">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive(path)
                  ? "text-purple-600"
                  : "text-gray-600 hover:text-purple-500"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-500 transition-colors"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};