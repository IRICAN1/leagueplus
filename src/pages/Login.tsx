import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        toast({
          title: "Error checking authentication status",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      if (session) {
        navigate(returnTo);
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          // Ensure profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session?.user?.id)
            .single();

          if (profileError && !profile) {
            // Create profile if it doesn't exist
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: session?.user?.id,
                  username: session?.user?.email?.split('@')[0],
                  full_name: session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0]
                }
              ]);

            if (insertError) {
              toast({
                title: "Error creating profile",
                description: insertError.message,
                variant: "destructive",
              });
              return;
            }
          }

          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate(returnTo);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, returnTo, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to LeaguePlus</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#7c3aed',
                    brandAccent: '#6d28d9',
                  },
                },
              },
              className: {
                container: 'flex flex-col gap-4',
                button: 'bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors',
                input: 'border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500',
                label: 'block text-sm font-medium text-gray-700 mb-1',
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}${returnTo}`}
            additionalSignUpFields={{
              full_name: {
                required: true,
                label: 'Full Name',
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;