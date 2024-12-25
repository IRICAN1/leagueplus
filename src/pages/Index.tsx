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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container py-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Find Competitions</h1>
          <p className="text-gray-500">
            Discover sports competitions near you
          </p>
        </div>

        <SearchHeader />
        <FilterBar />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockResults.map((result, index) => (
            <ResultCard key={index} {...result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;