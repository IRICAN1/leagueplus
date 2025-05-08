
import Profile from "@/pages/Profile";
import TournamentRegistration from "@/pages/TournamentRegistration";
import DuoTournamentRegistration from "@/pages/DuoTournamentRegistration";
import PlayerChallenge from "@/pages/PlayerChallenge";
import DuoChallenge from "@/pages/DuoChallenge";
import CreateLeague from "@/pages/CreateLeague";
import CreateDuoLeague from "@/pages/CreateDuoLeague";
import MyLeagues from "@/pages/MyLeagues";
import MatchRequests from "@/pages/MatchRequests";
import MyDuos from "@/pages/MyDuos";
import History from "@/pages/History";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const protectedRoutes = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/my-leagues",
    element: (
      <ProtectedRoute>
        <MyLeagues />
      </ProtectedRoute>
    )
  },
  {
    path: "/my-matches",
    element: (
      <ProtectedRoute>
        <MatchRequests />
      </ProtectedRoute>
    )
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    )
  },
  {
    path: "/create-league",
    element: (
      <ProtectedRoute>
        <CreateLeague />
      </ProtectedRoute>
    )
  },
  {
    path: "/create-duo-league",
    element: (
      <ProtectedRoute>
        <CreateDuoLeague />
      </ProtectedRoute>
    )
  },
  {
    path: "/tournament/:id/register",
    element: (
      <ProtectedRoute>
        <TournamentRegistration />
      </ProtectedRoute>
    )
  },
  {
    path: "/player-challenge/:playerId",
    element: (
      <ProtectedRoute>
        <PlayerChallenge />
      </ProtectedRoute>
    )
  },
  {
    path: "/duo-tournament/:id/register",
    element: (
      <ProtectedRoute>
        <DuoTournamentRegistration />
      </ProtectedRoute>
    )
  },
  {
    path: "/my-duos",
    element: (
      <ProtectedRoute>
        <MyDuos />
      </ProtectedRoute>
    )
  },
  {
    path: "/duo-challenge/:partnershipId",
    element: (
      <ProtectedRoute>
        <DuoChallenge />
      </ProtectedRoute>
    )
  }
];
