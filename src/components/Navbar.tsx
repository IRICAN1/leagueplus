import { useEffect, useState } from "react";
import { Trophy, BellDot, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLinks } from "./navbar/NavbarLinks";
import { NavbarAuth } from "./navbar/NavbarAuth";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pendingChallenges, setPendingChallenges] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session) {
        // Fetch initial pending challenges
        const { data: challenges } = await supabase
          .from('match_challenges')
          .select(`
            *,
            challenger:profiles!match_challenges_challenger_id_fkey(username),
            league:leagues(name)
          `)
          .eq('challenged_id', session.user.id)
          .eq('status', 'pending');
        
        setPendingChallenges(challenges || []);

        // Fetch unread messages count
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select('conversation_id, last_read_at')
          .eq('profile_id', session.user.id);

        if (participants) {
          let unreadCount = 0;
          for (const participant of participants) {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', participant.conversation_id)
              .gt('created_at', participant.last_read_at);
            
            unreadCount += count || 0;
          }
          setUnreadMessages(unreadCount);
        }

        // Subscribe to real-time updates
        const challengeChannel = supabase
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
              const { data: updatedChallenges } = await supabase
                .from('match_challenges')
                .select(`
                  *,
                  challenger:profiles!match_challenges_challenger_id_fkey(username),
                  league:leagues(name)
                `)
                .eq('challenged_id', session.user.id)
                .eq('status', 'pending');
              
              setPendingChallenges(updatedChallenges || []);
            }
          )
          .subscribe();

        // Subscribe to new messages
        const messageChannel = supabase
          .channel('message-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages'
            },
            async (payload) => {
              if (payload.new.sender_id !== session.user.id) {
                setUnreadMessages(prev => prev + 1);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(challengeChannel);
          supabase.removeChannel(messageChannel);
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
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-xl text-purple-600">LeaguePlus</span>
            </Link>

            <NavbarLinks isAuthenticated={isAuthenticated} />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                {unreadMessages > 0 && (
                  <Link to="/messages" className="relative inline-flex items-center">
                    <MessageSquare className="h-6 w-6 text-blue-500 animate-pulse" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs ring-2 ring-white"
                    >
                      {unreadMessages}
                    </Badge>
                  </Link>
                )}
                {pendingChallenges.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="relative inline-flex items-center">
                        <BellDot className="h-6 w-6 text-blue-500 animate-pulse" />
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs ring-2 ring-white"
                        >
                          {pendingChallenges.length}
                        </Badge>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-t-lg border-b border-blue-200">
                    <h3 className="font-semibold text-blue-800">
                      Pending Match Challenges
                    </h3>
                    <p className="text-sm text-blue-600">
                      You have {pendingChallenges.length} pending challenge{pendingChallenges.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {pendingChallenges.map((challenge) => (
                      <Card key={challenge.id} className="m-2 p-3 bg-white hover:bg-blue-50 transition-colors border-blue-100">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-900">
                            {challenge.challenger.username} challenged you
                          </p>
                          <p className="text-xs text-blue-600">
                            League: {challenge.league.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(challenge.proposed_time), 'PPp')}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-b-lg border-t border-blue-200">
                    <Link to="/match-requests">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        View All Challenges
                      </Button>
                    </Link>
                  </div>
                    </PopoverContent>
                  </Popover>
                )}
              </>
            )}
            <NavbarAuth isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </nav>
  );
};
