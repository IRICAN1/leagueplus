
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X } from "lucide-react";

interface PendingInvitesProps {
  invites: any[];
  isLoading: boolean;
  onInviteUpdated: () => void;
}

export const PendingInvites = ({ invites, isLoading, onInviteUpdated }: PendingInvitesProps) => {
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const handleInviteResponse = async (inviteId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('duo_invites')
        .update({ status })
        .eq('id', inviteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Duo invite ${status}`,
      });
      onInviteUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${status} duo invite`,
        variant: "destructive",
      });
    }
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

  if (invites.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No pending duo invites.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invites.map((invite) => {
        const isReceived = invite.receiver_id === currentUserId;
        const otherUser = isReceived ? invite.sender : invite.receiver;

        return (
          <Card key={invite.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={otherUser.avatar_url || "/placeholder.svg"}
                  alt={otherUser.username}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{otherUser.username}</h3>
                  <p className="text-sm text-gray-500">
                    {isReceived ? "Sent you a duo invite" : "Pending response"}
                  </p>
                </div>
              </div>
              {isReceived && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInviteResponse(invite.id, 'accepted')}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInviteResponse(invite.id, 'rejected')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                </div>
              )}
            </CardHeader>
            {invite.message && (
              <CardContent>
                <p className="text-gray-600 italic">"{invite.message}"</p>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
