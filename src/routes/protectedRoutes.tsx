import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DuoSearch from "@/pages/DuoSearch";
import MyDuos from "@/pages/MyDuos";
import Profile from "@/pages/Profile";
import TournamentRegistration from "@/pages/TournamentRegistration";
import MyLeagues from "@/pages/MyLeagues";

const CreateLeagueType = lazy(() => import("@/pages/CreateLeagueType"));
const CreateLeague = lazy(() => import("@/pages/CreateLeague"));

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute>
      <div>
        {/* Outlet will render child routes */}
      </div>
    </ProtectedRoute>,
    children: [
      {
        path: "/create-league",
        element: <CreateLeagueType />,
      },
      {
        path: "/create-league/single",
        element: <CreateLeague />,
      },
      {
        path: "/create-league/duo",
        element: <CreateLeague type="duo" />,
      },
      {
        path: "/duo-search",
        element: <DuoSearch />,
      },
      {
        path: "/my-duos",
        element: <MyDuos />,
      },
      {
        path: "/my-leagues",
        element: <MyLeagues />,
      },
      {
        path: "/tournament/:id/register",
        element: <TournamentRegistration />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];