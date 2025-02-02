import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DuoSearch } from "@/pages/DuoSearch";
import { DuoPartnerships } from "@/pages/DuoPartnerships";
import { DuoInvites } from "@/pages/DuoInvites";
import { Tournament } from "@/pages/Tournament";
import { TournamentRegistration } from "@/pages/TournamentRegistration";
import { Profile } from "@/pages/Profile";

const CreateLeagueType = lazy(() => import("@/pages/CreateLeagueType"));
const CreateLeague = lazy(() => import("@/pages/CreateLeague"));

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
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
        path: "/duo-partnerships",
        element: <DuoPartnerships />,
      },
      {
        path: "/duo-invites",
        element: <DuoInvites />,
      },
      {
        path: "/tournament/:id",
        element: <Tournament />,
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