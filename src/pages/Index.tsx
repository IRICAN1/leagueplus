import { SearchHeader } from "@/components/SearchHeader";
import { FilterBar } from "@/components/FilterBar";
import { ResultCard } from "@/components/ResultCard";

const Index = () => {
  const mockResults = [
    {
      title: "Tennis Tournament 2024",
      location: "Tennis Club Paris",
      distance: 3.5,
      date: "January 15, 2024",
      type: "Tournament",
    },
    {
      title: "Regional League Championship",
      location: "Sports Complex Lyon",
      distance: 5.2,
      date: "January 20, 2024",
      type: "League",
    },
    {
      title: "Amateur Tennis Cup",
      location: "Municipal Courts Marseille",
      distance: 7.8,
      date: "February 1, 2024",
      type: "Tournament",
    },
  ];

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
          {mockResults.map((result, index) => (
            <ResultCard key={index} {...result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;