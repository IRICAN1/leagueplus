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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container py-8 space-y-6">
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Find Competitions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover sports competitions near you and join the excitement
          </p>
        </div>

        <SearchHeader />
        <FilterBar />

        <div className="space-y-4 max-w-3xl mx-auto animate-slide-in">
          {mockResults.map((result, index) => (
            <ResultCard key={index} {...result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;