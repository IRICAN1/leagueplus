import Profile from "@/pages/Profile";
import TournamentRegistration from "@/pages/TournamentRegistration";
import PlayerChallenge from "@/pages/PlayerChallenge";
import CreateLeague from "@/pages/CreateLeague";
import MyLeagues from "@/pages/MyLeagues";
import MatchRequests from "@/pages/MatchRequests";
import Messages from "@/pages/Messages";
import MyDuos from "@/pages/MyDuos";
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
    path: "/create-league",
    element: (
      <ProtectedRoute>
        <CreateLeague />
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
    path: "/messages",
    element: (
      <ProtectedRoute>
        <Messages />
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
  }
];
