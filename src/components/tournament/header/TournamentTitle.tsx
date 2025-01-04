import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface TournamentTitleProps {
  league: Tables<"leagues", never> & {
    creator: {
      username: string | null;
      full_name: string | null;
    } | null;
  };
  isAuthenticated: boolean;
  isUserRegistered: boolean | undefined;
}

export const TournamentTitle = ({ league, isAuthenticated, isUserRegistered }: TournamentTitleProps) => {
  const creatorName = league.creator?.full_name || league.creator?.username || 'Unknown';
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLeaveLeague = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('league_participants')
      .delete()
      .eq('league_id', league.id)
      .eq('user_id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to leave the league. Please try again.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "You have successfully left the league.",
    });
    
    // Redirect to my leagues page
    navigate('/my-leagues');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 break-words">
          {league.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Created by {creatorName}
        </p>
      </div>
      <div className="w-full flex flex-wrap gap-2">
        {isAuthenticated && !isUserRegistered && (
          <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            <Link to={`/tournament/${league.id}/register`}>Register Now</Link>
          </Button>
        )}
        {isUserRegistered && (
          <>
            <Badge variant="secondary" className="px-4 py-2 w-full sm:w-auto text-center">
              Already Registered
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave League
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. You will no longer be able to challenge other players
                    or participate in this league.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLeaveLeague}>
                    Leave League
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
};