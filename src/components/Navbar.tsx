import { useEffect, useState } from "react";
import { Trophy, BellDot } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLinks } from "./navbar/NavbarLinks";
import { NavbarAuth } from "./navbar/NavbarAuth";
import { Badge } from "./ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setIsAuthenticated(true);
      }
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">Sports League</span>
            </Link>
            <NavbarLinks isAuthenticated={isAuthenticated} />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && pendingChallenges > 0 && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link 
                    to="/match-requests" 
                    className="relative inline-flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <BellDot className="h-6 w-6 text-red-500 animate-pulse" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full ring-2 ring-white animate-bounce"
                    >
                      {pendingChallenges}
                    </Badge>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-t-lg border-b border-red-200">
                    <h4 className="text-sm font-semibold text-red-700">Pending Match Challenges</h4>
                    <p className="text-xs text-red-600 mt-1">
                      You have {pendingChallenges} pending match {pendingChallenges === 1 ? 'request' : 'requests'}
                    </p>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-sm text-gray-600">
                      Click to view and respond to your match challenges
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
            <NavbarAuth isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </nav>
  );
};