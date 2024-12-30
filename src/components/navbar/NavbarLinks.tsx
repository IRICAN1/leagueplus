import { Link } from "react-router-dom";
import { Trophy, Plus, Medal } from "lucide-react";

interface NavbarLinksProps {
  isAuthenticated: boolean;
}

export const NavbarLinks = ({ isAuthenticated }: NavbarLinksProps) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link 
        to="/leagues" 
        className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
      >
        <Trophy className="h-4 w-4" />
        <span>Leagues</span>
      </Link>
      
      {isAuthenticated && (
        <>
          <Link 
            to="/my-leagues"
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Medal className="h-4 w-4" />
            <span>My Leagues</span>
          </Link>
          <Link 
            to="/create-league"
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create League</span>
          </Link>
        </>
      )}
    </div>
  );
};