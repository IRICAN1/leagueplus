import { useEffect, useState } from "react";
import { Trophy, BellDot } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLinks } from "./navbar/NavbarLinks";
import { NavbarAuth } from "./navbar/NavbarAuth";
import { Badge } from "./ui/badge";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pendingChallenges, setPendingChallenges] = useState<number>(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session) {
        // Fetch initial pending challenges
        const { data: challenges } = await supabase
          .from('match_challenges')
          .select('*')
          .eq('challenged_id', session.user.id)
          .eq('status', 'pending');
        
        setPendingChallenges(challenges?.length || 0);

        // Subscribe to real-time updates
        const channel = supabase
          .channel('schema-db-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'match_challenges',
              filter: `challenged_id=eq.${session.user.id}`
            },
            async () => {
              // Refetch challenges count on any changes
              const { data: updatedChallenges } = await supabase
                .from('match_challenges')
                .select('*')
                .eq('challenged_id', session.user.id)
                .eq('status', 'pending');
              
              setPendingChallenges(updatedChallenges?.length || 0);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
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
            {/* Logo and App Name */}
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-xl text-purple-600">LeaguePlus</span>
            </Link>

            <NavbarLinks isAuthenticated={isAuthenticated} />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && pendingChallenges > 0 && (
              <Link 
                to="/match-requests" 
                className="relative inline-flex items-center"
              >
                <BellDot className="h-6 w-6 text-red-500" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {pendingChallenges}
                </Badge>
              </Link>
            )}
            <NavbarAuth isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </nav>
  );
};