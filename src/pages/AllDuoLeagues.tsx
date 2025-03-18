
import { useAllDuoLeagues } from "@/hooks/useAllDuoLeagues";
import { PublicDuoLeaguesList } from "@/components/leagues/PublicDuoLeaguesList";

const AllDuoLeagues = () => {
  // Fetch all duo leagues - ensuring showAll is true to get everything
  const { 
    data: duoLeaguesData, 
    isLoading: duoLeaguesLoading 
  } = useAllDuoLeagues(1, 1000, true); // Set showAll to true and high limit to ensure we get all leagues

  console.log("All Duo Leagues page data:", duoLeaguesData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="container max-w-4xl mx-auto py-4 md:py-8 space-y-6 px-4 mt-16 md:mt-20">
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text">
            All Duo Tournaments
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse all available duo tournaments for Padel and Badminton
          </p>
          <p className="text-sm text-blue-600">
            Showing {duoLeaguesData?.leagues?.length || 0} tournaments in total
          </p>
        </div>

        <PublicDuoLeaguesList
          leagues={duoLeaguesData?.leagues || []}
          isLoading={duoLeaguesLoading}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          showPagination={false}
        />
      </div>
    </div>
  );
};

export default AllDuoLeagues;
