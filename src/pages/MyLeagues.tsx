import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResultCard } from "@/components/ResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const MyLeagues = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sportFilter, setSportFilter] = useState<string>("all");

  const { data: createdLeagues, isLoading: isLoadingCreated, error: createdError } = useQuery({
    queryKey: ['created-leagues'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];
      
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('creator_id', session.session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: joinedLeagues, isLoading: isLoadingJoined, error: joinedError } = useQuery({
    queryKey: ['joined-leagues'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];
      
      const { data, error } = await supabase
        .from('league_participants')
        .select(`
          league_id,
          leagues:leagues (*)
        `)
        .eq('user_id', session.session.user.id)
        .order('joined_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(item => item.leagues) || [];
    },
  });

  const getLeagueStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'Upcoming';
    if (now > end) return 'Ended';
    return 'Active';
  };

  // Show error toast if either query fails
  if (createdError || joinedError) {
    toast({
      title: "Error loading leagues",
      description: "There was a problem loading your leagues. Please try again.",
      variant: "destructive",
    });
  }

  const filterLeagues = (leagues: any[] = []) => {
    return leagues.filter(league => {
      const status = getLeagueStatus(league.start_date, league.end_date);
      const statusMatch = statusFilter === "all" || status.toLowerCase() === statusFilter.toLowerCase();
      const sportMatch = sportFilter === "all" || league.sport_type.toLowerCase() === sportFilter.toLowerCase();
      return statusMatch && sportMatch;
    });
  };

  const filteredCreatedLeagues = filterLeagues(createdLeagues);
  const filteredJoinedLeagues = filterLeagues(joinedLeagues);

  const LoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );

  const EmptyState = ({ type, onCreateClick }: { type: string; onCreateClick: () => void }) => (
    <div className="text-center py-8">
      <h3 className="text-lg font-semibold mb-2">No {type} leagues found</h3>
      <p className="text-gray-600 mb-4">
        {type === 'created' 
          ? "You haven't created any leagues yet. Start organizing your first league!"
          : "You haven't joined any leagues yet. Find a league to participate in!"}
      </p>
      <Button onClick={onCreateClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {type === 'created' ? 'Create League' : 'Find Leagues'}
      </Button>
    </div>
  );

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Leagues</h1>
        <Button 
          onClick={() => navigate('/create-league')}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create League
        </Button>
      </div>
      
      <Tabs defaultValue="created" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="created" className="flex-1 sm:flex-none">Leagues I Created</TabsTrigger>
          <TabsTrigger value="joined" className="flex-1 sm:flex-none">Leagues I Joined</TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="volleyball">Volleyball</SelectItem>
              <SelectItem value="badminton">Badminton</SelectItem>
              <SelectItem value="padel">Padel</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !Date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Filter by date range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <TabsContent value="created" className="space-y-4 min-h-[200px]">
          {isLoadingCreated ? (
            <LoadingState />
          ) : filteredCreatedLeagues?.length === 0 ? (
            <EmptyState type="created" onCreateClick={() => navigate('/create-league')} />
          ) : (
            <div className="grid gap-4">
              {filteredCreatedLeagues?.map((league) => (
                <ResultCard
                  key={league.id}
                  id={league.id}
                  title={league.name}
                  location={league.location}
                  distance={0}
                  date={`${format(new Date(league.start_date), 'PP')} - ${format(new Date(league.end_date), 'PP')}`}
                  type={getLeagueStatus(league.start_date, league.end_date)}
                  sportType={league.sport_type}
                  skillLevel={`${league.skill_level_min}-${league.skill_level_max}`}
                  genderCategory={league.gender_category}
                  participants={league.max_participants}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="joined" className="space-y-4 min-h-[200px]">
          {isLoadingJoined ? (
            <LoadingState />
          ) : filteredJoinedLeagues?.length === 0 ? (
            <EmptyState type="joined" onCreateClick={() => navigate('/')} />
          ) : (
            <div className="grid gap-4">
              {filteredJoinedLeagues?.map((league) => (
                <ResultCard
                  key={league.id}
                  id={league.id}
                  title={league.name}
                  location={league.location}
                  distance={0}
                  date={`${format(new Date(league.start_date), 'PP')} - ${format(new Date(league.end_date), 'PP')}`}
                  type={getLeagueStatus(league.start_date, league.end_date)}
                  sportType={league.sport_type}
                  skillLevel={`${league.skill_level_min}-${league.skill_level_max}`}
                  genderCategory={league.gender_category}
                  participants={league.max_participants}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyLeagues;