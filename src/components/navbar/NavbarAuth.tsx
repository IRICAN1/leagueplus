
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavbarUserMenu } from "./NavbarUserMenu";
import { useTranslation } from "react-i18next";

interface NavbarAuthProps {
  isAuthenticated: boolean;
}

export const NavbarAuth = ({ isAuthenticated }: NavbarAuthProps) => {
  const { t } = useTranslation();
  
  if (isAuthenticated) {
    return <NavbarUserMenu />;
  }

  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/login">{t('nav.login')}</Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/register">{t('nav.register')}</Link>
      </Button>
    </div>
  );
};
