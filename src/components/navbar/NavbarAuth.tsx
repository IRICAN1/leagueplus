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
    <div className="flex items-center space-x-3">
      <Button 
        variant="ghost" 
        asChild 
        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
      >
        <Link to="/login">Login</Link>
      </Button>
      <Button 
        asChild 
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Link to="/register">Register</Link>
      </Button>
    </div>
  );
};