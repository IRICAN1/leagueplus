import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResultCard } from "@/components/ResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MyLeagues = () => {
  const { data: createdLeagues, isLoading: isLoadingCreated } = useQuery({
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

  const { data: joinedLeagues, isLoading: isLoadingJoined } = useQuery({
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

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Leagues</h1>
      
      <Tabs defaultValue="created" className="space-y-6">
        <TabsList>
          <TabsTrigger value="created">Leagues I Created</TabsTrigger>
          <TabsTrigger value="joined">Leagues I Joined</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-4 items-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="volleyball">Volleyball</SelectItem>
              <SelectItem value="badminton">Badminton</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
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

        <TabsContent value="created" className="space-y-4">
          {isLoadingCreated ? (
            <div>Loading...</div>
          ) : createdLeagues?.length === 0 ? (
            <div>You haven't created any leagues yet.</div>
          ) : (
            createdLeagues?.map((league) => (
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
            ))
          )}
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          {isLoadingJoined ? (
            <div>Loading...</div>
          ) : joinedLeagues?.length === 0 ? (
            <div>You haven't joined any leagues yet.</div>
          ) : (
            joinedLeagues?.map((league) => (
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
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyLeagues;