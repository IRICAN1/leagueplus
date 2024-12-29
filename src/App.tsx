import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import TournamentDetails from "./pages/TournamentDetails";
import TournamentRegistration from "./pages/TournamentRegistration";
import PlayerChallenge from "./pages/PlayerChallenge";
import CreateLeague from "./pages/CreateLeague";
import MyLeagues from "./pages/MyLeagues";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen pb-16 md:pb-0 md:pt-16">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/tournament/:id" element={<TournamentDetails />} />
            <Route path="/leagues" element={<Navigate to="/" replace />} />
            {/* Protected routes */}
            <Route
              path="/my-leagues"
              element={
                <ProtectedRoute>
                  <MyLeagues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-league"
              element={
                <ProtectedRoute>
                  <CreateLeague />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tournament/:id/register"
              element={
                <ProtectedRoute>
                  <TournamentRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/player-challenge/:playerId"
              element={
                <ProtectedRoute>
                  <PlayerChallenge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <div>Friends Page (Coming Soon)</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <div>Match History (Coming Soon)</div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;