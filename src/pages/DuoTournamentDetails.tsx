
import { useParams, useNavigate } from "react-router-dom";
import { TournamentStats } from "@/components/tournament/TournamentStats";
import { DuoTournamentAlert } from "@/components/tournament/duo/DuoTournamentAlert";
import { DuoTournamentHeader } from "@/components/tournament/duo/DuoTournamentHeader";
import { DuoTournamentTabs } from "@/components/tournament/duo/DuoTournamentTabs";
import { DuoTournamentStatus } from "@/components/tournament/duo/DuoTournamentStatus";
import { useLeagueAuth } from "@/hooks/useLeagueAuth";
import { useDuoLeague } from "@/hooks/useDuoLeague";
import { useDuoRankings } from "@/hooks/useDuoRankings";
import { useUserRegistration } from "@/hooks/useUserRegistration";
import { Alert } from "@/components/ui/alert";

const DuoTournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useLeagueAuth();
  
  const { 
    data: league, 
    isLoading: isLoadingLeague, 
    error: leagueError 
  } = useDuoLeague(id);
  
  const { processedRankings } = useDuoRankings(id);
  const { data: isUserRegistered } = useUserRegistration(id, userId);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/duo-tournament/${id}` } });
      return;
    }
    navigate(`/duo-tournament/${id}/register`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6 sm:mt-0 mt-20">
      <DuoTournamentStatus 
        id={id} 
        isLoading={isLoadingLeague} 
        error={leagueError} 
      />

      {!league ? null : (
        <>
          {!isAuthenticated && <DuoTournamentAlert tournamentId={id} />}
          
          <div className="flex flex-col gap-4">
            <DuoTournamentHeader
              name={league.name}
              creatorName={league.creator?.full_name || league.creator?.username}
              isAuthenticated={isAuthenticated}
              isUserRegistered={isUserRegistered}
              onRegisterClick={handleRegisterClick}
            />
            
            <TournamentStats leagueId={id} isDuo={true} />

            <DuoTournamentTabs 
              leagueId={id}
              processedRankings={processedRankings}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DuoTournamentDetails;
