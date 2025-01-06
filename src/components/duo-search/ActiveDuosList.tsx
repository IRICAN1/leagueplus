import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MessageSquare, Trophy, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ActiveDuosListProps {
  duos: any[];
  isLoading: boolean;
  onDuoUpdated: () => void;
}

export const ActiveDuosList = ({ duos, isLoading, onDuoUpdated }: ActiveDuosListProps) => {
  const [dissolvingDuoId, setDissolvingDuoId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const handleDissolveDuo = async (duoId: string) => {
    try {
      const { error } = await supabase
        .from('duo_partnerships')
        .update({ active: false })
        .eq('id', duoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Duo partnership has been dissolved",
      });
      onDuoUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to dissolve duo partnership",
        variant: "destructive",
      });
    }
    setDissolvingDuoId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (duos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          You don't have any active duo partnerships yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {duos.map((duo) => {
        const partner = duo.player1.id === currentUserId ? duo.player2 : duo.player1;
        const stats = duo.duo_statistics[0];

        return (
          <Card key={duo.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={partner.avatar_url || "/placeholder.svg"}
                  alt={partner.username}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{partner.username}</h3>
                  <p className="text-sm text-gray-500">
                    Partners since {format(new Date(duo.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-2" />
                      Dissolve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Dissolve Duo Partnership</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to dissolve this duo partnership? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDissolveDuo(duo.id)}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <Trophy className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">{stats?.wins || 0}</div>
                  <div className="text-sm text-gray-500">Wins</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-lg font-semibold">{stats?.losses || 0}</div>
                  <div className="text-sm text-gray-500">Losses</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-lg font-semibold">
                    {stats ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Win Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};