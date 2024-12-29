import { SearchHeader } from "@/components/SearchHeader";
import { FilterBar } from "@/components/FilterBar";
import { ResultCard } from "@/components/ResultCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { toast } from "sonner";

const Index = () => {
  const { data: leagues, isLoading, error } = useQuery({
    queryKey: ['leagues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Tables<'leagues'>[];
    },
  });

  if (error) {
    toast.error('Failed to load leagues');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="container max-w-4xl mx-auto py-4 md:py-8 space-y-6 px-4">
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text">
            Find Competitions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover sports competitions near you and join the excitement
          </p>
        </div>

        <SearchHeader />
        <FilterBar />

        <div className="space-y-4 animate-slide-in">
          {isLoading ? (
            <div className="text-center py-8 text-gray-600">Loading leagues...</div>
          ) : leagues && leagues.length > 0 ? (
            leagues.map((league) => (
              <ResultCard
                key={league.id}
                id={league.id}
                title={league.name}
                location={league.location}
                distance={0} // This would need to be calculated based on user's location
                date={format(new Date(league.start_date), 'MMMM d, yyyy')}
                type={league.format}
                sportType={league.sport_type}
                skillLevel={`${league.skill_level_min}-${league.skill_level_max}`}
                genderCategory={league.gender_category}
                participants={league.max_participants}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-600">
              No leagues found. Create one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;