
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavbarUserMenu } from "./NavbarUserMenu";

interface NavbarAuthProps {
  isAuthenticated: boolean;
}

export const NavbarAuth = ({ isAuthenticated }: NavbarAuthProps) => {
  if (isAuthenticated) {
    return <NavbarUserMenu />;
  }

  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <Button 
        variant="ghost" 
        asChild 
        size="sm"
        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 sm:px-4"
      >
        <Link to="/login">Login</Link>
      </Button>
      <Button 
        asChild 
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-4"
      >
        <Link to="/register">Register</Link>
      </Button>
    </div>
  );
};
