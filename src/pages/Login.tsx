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
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication Error",
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        if (event === 'SIGNED_IN' && session) {
          try {
            // Check if profile exists
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError && !profile) {
              // Create profile if it doesn't exist
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([
                  { 
                    id: session.user.id,
                    username: session.user.email?.split('@')[0],
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
                  }
                ]);

              if (insertError) {
                console.error("Profile creation error:", insertError);
                toast({
                  title: "Error Creating Profile",
                  description: insertError.message,
                  variant: "destructive",
                });
                return;
              }
            }

            toast({
              title: "Welcome!",
              description: "Successfully signed in",
            });
            navigate(returnTo);
          } catch (error) {
            console.error("Profile handling error:", error);
            toast({
              title: "Error",
              description: "An error occurred while setting up your profile",
              variant: "destructive",
            });
          }
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed Out",
            description: "You have been successfully signed out",
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, returnTo, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">Welcome to LeaguePlus</CardTitle>
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
                anchor: 'text-purple-600 hover:text-purple-700 font-medium',
                divider: 'my-4 border-t border-gray-200',
                message: 'text-sm text-gray-600 mt-2',
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}${returnTo}`}
            localization={{
              variables: {
                sign_up: {
                  email_label: "Email",
                  password_label: "Password",
                  email_input_placeholder: "Your email address",
                  password_input_placeholder: "Your password",
                  button_label: "Sign up",
                  link_text: "Already have an account? Sign in",
                },
                sign_in: {
                  email_label: "Email",
                  password_label: "Password",
                  email_input_placeholder: "Your email address",
                  password_input_placeholder: "Your password",
                  button_label: "Sign in",
                  link_text: "Don't have an account? Sign up",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;