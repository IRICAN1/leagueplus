import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleResendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to resend confirmation email. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Confirmation Email Sent",
          description: "Please check your inbox for the confirmation link.",
        });
      }
    } catch (error: any) {
      console.error('Error resending confirmation:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // Check if the error is due to unconfirmed email
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: (
              <div className="space-y-2">
                <p>Please check your email inbox and confirm your email address before logging in.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleResendConfirmation(values.email)}
                >
                  Resend Confirmation Email
                </Button>
              </div>
            ),
            duration: 10000, // Keep the toast visible longer
          });
          return;
        }

        // Handle invalid credentials specifically
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Profile Not Found",
          description: "It seems you don't have a profile yet. Please register first.",
          duration: 5000,
        });
        navigate('/register');
        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-purple-700">
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;