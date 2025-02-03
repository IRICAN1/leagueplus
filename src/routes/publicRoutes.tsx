import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DuoSearch from "@/pages/DuoSearch";
import TournamentDetails from "@/pages/TournamentDetails";

export const publicRoutes = [
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
    path: "/duo-search",
    element: <DuoSearch />,
  },
  {
    path: "/tournament/:id",
    element: <TournamentDetails />,
  },
];