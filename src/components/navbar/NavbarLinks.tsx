
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface NavbarLinksProps {
  isAuthenticated: boolean;
}

export const NavbarLinks = ({ isAuthenticated }: NavbarLinksProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="hidden md:flex items-center space-x-1">
      <Link 
        to="/" 
        className="relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 group"
      >
        <span>{t('nav.home')}</span>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
      </Link>
      {isAuthenticated && (
        <>
          <Link 
            to="/my-leagues" 
            className="relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 group"
          >
            <span>{t('nav.leagues')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/my-matches" 
            className="relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 group"
          >
            <span>{t('nav.matches')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/history" 
            className="relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 group"
          >
            <span>{t('nav.history')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/my-duos" 
            className="relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 group"
          >
            <span>{t('nav.duos')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </>
      )}
    </div>
  );
};
