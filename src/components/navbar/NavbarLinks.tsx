
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface NavbarLinksProps {
  isAuthenticated: boolean;
}

export const NavbarLinks = ({ isAuthenticated }: NavbarLinksProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="hidden md:flex space-x-4">
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
        {t('nav.home')}
      </Link>
      {isAuthenticated && (
        <>
          <Link to="/my-leagues" className="text-sm text-gray-500 hover:text-gray-900">
            {t('nav.leagues')}
          </Link>
          <Link to="/my-matches" className="text-sm text-gray-500 hover:text-gray-900">
            {t('nav.matches')}
          </Link>
          <Link to="/history" className="text-sm text-gray-500 hover:text-gray-900">
            {t('nav.history')}
          </Link>
          <Link to="/my-duos" className="text-sm text-gray-500 hover:text-gray-900">
            {t('nav.duos')}
          </Link>
        </>
      )}
    </div>
  );
};
