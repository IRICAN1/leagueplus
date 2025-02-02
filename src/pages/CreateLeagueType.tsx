import { LeagueTypeSelector } from "@/components/league-form/LeagueTypeSelector";

const CreateLeagueType = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Choose League Type
        </h1>
        <LeagueTypeSelector />
      </div>
    </div>
  );
};

export default CreateLeagueType;