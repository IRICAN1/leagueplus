import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLinks } from "./navbar/NavbarLinks";
import { NavbarAuth } from "./navbar/NavbarAuth";
import { NavbarNotifications } from "./navbar/NavbarNotifications";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session) {
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
              .gt('created_at', participant.last_read_at || '1970-01-01');
            
            unreadCount += count || 0;
          }
          setUnreadMessages(unreadCount);
        }

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
              <NavbarNotifications unreadMessages={unreadMessages} />
            )}
            <NavbarAuth isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </nav>
  );
};