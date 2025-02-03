import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const TournamentDetails = lazy(() => import("@/pages/TournamentDetails"));
const DuoTournamentDetails = lazy(() => import("@/pages/DuoTournamentDetails"));
const TournamentRegistration = lazy(() => import("@/pages/TournamentRegistration"));
const PlayerChallenge = lazy(() => import("@/pages/PlayerChallenge"));
const DuoSearch = lazy(() => import("@/pages/DuoSearch"));

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/tournament/:id",
    element: <TournamentDetails />,
  },
  {
    path: "/duo-tournament/:id",
    element: <DuoTournamentDetails />,
  },
  {
    path: "/tournament/:id/register",
    element: <TournamentRegistration />,
  },
  {
    path: "/player-challenge/:playerId",
    element: <PlayerChallenge />,
  },
  {
    path: "/duo-search",
    element: <DuoSearch />,
  },
];