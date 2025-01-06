import { Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import TournamentDetails from "@/pages/TournamentDetails";

export const publicRoutes = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/tournament/:id",
    element: <TournamentDetails />
  },
  {
    path: "/leagues",
    element: <Navigate to="/" replace />
  }
];