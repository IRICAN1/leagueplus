import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NavbarLinksProps {
  isAuthenticated: boolean;
}

export const NavbarLinks = ({ isAuthenticated }: NavbarLinksProps) => {
  const location = useLocation();

  const links = [
    { href: "/", label: "Home" },
    ...(isAuthenticated
      ? [
          { href: "/my-leagues", label: "My Leagues" },
          { href: "/my-matches", label: "My Matches" },
          { href: "/duo-search", label: "My DUOs" },
        ]
      : [])
  ];

  const NavLinks = () => (
    <>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          to={href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-purple-600",
            location.pathname === href
              ? "text-purple-600"
              : "text-gray-600"
          )}
        >
          {label}
        </Link>
      ))}
    </>
  );

  return (
    <>
      <div className="hidden md:flex space-x-6">
        <NavLinks />
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-6">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-purple-600 py-2",
                    location.pathname === href
                      ? "text-purple-600"
                      : "text-gray-600"
                  )}
                  onClick={(e) => {
                    const closeButton = document.querySelector('[data-radix-collection-item]') as HTMLButtonElement;
                    if (closeButton) closeButton.click();
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};