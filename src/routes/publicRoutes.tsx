
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DuoSearch from "@/pages/DuoSearch";
import TournamentDetails from "@/pages/TournamentDetails";
import DuoTournamentDetails from "@/pages/DuoTournamentDetails";
import AllDuoLeagues from "@/pages/AllDuoLeagues";

export const publicRoutes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/duo-leagues",
    element: <Index />,
  },
  {
    path: "/all-duo-leagues",
    element: <AllDuoLeagues />,
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
    path: "/duo-search",
    element: <DuoSearch />,
  },
  {
    path: "/tournament/:id",
    element: <TournamentDetails />,
  },
  {
    path: "/duo-tournament/:id",
    element: <DuoTournamentDetails />,
  },
];
