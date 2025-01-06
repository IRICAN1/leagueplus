import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ActiveDuosList } from "@/components/duo-search/ActiveDuosList";
import { PendingInvites } from "@/components/duo-search/PendingInvites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyDuos = () => {
  const [activeDuos, setActiveDuos] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDuoData();
  }, []);

  const fetchDuoData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch active partnerships
      const { data: partnerships, error: partnershipError } = await supabase
        .from('duo_partnerships')
        .select(`
          *,
          player1:profiles!duo_partnerships_player1_id_fkey(*),
          player2:profiles!duo_partnerships_player2_id_fkey(*),
          duo_statistics(*)
        `)
        .eq('active', true)
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`);

      if (partnershipError) throw partnershipError;
      setActiveDuos(partnerships || []);

      // Fetch pending invites
      const { data: invites, error: invitesError } = await supabase
        .from('duo_invites')
        .select(`
          *,
          sender:profiles!duo_invites_sender_id_fkey(*),
          receiver:profiles!duo_invites_receiver_id_fkey(*)
        `)
        .eq('status', 'pending')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (invitesError) throw invitesError;
      setPendingInvites(invites || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load duo partnerships and invites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Duos</h1>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Duos</TabsTrigger>
          <TabsTrigger value="pending">Pending Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ActiveDuosList 
            duos={activeDuos} 
            isLoading={isLoading} 
            onDuoUpdated={fetchDuoData}
          />
        </TabsContent>

        <TabsContent value="pending">
          <PendingInvites 
            invites={pendingInvites} 
            isLoading={isLoading} 
            onInviteUpdated={fetchDuoData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyDuos;