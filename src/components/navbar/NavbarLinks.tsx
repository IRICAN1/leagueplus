import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

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
          { href: "/match-requests", label: "Match Requests" },
          { href: "/friends", label: "Friends" },
          { href: "/history", label: "History" },
        ]
      : [])
  ];

  return (
    <div className="hidden md:flex space-x-6">
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
    </div>
  );
};