import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LoginFormValues } from "@/components/auth/LoginForm";
import { AuthError } from "@supabase/supabase-js";
import { EmailConfirmationToast } from "@/components/auth/EmailConfirmationToast";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = (error: AuthError) => {
    if (error.message.includes("Invalid login credentials")) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  };

  const handleEmailConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      toast({
        title: "Confirmation Email Sent",
        description: "Please check your inbox for the confirmation link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend confirmation email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signIn = async (values: LoginFormValues): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Confirmed",
            description: <EmailConfirmationToast 
              email={values.email} 
              onResend={() => handleEmailConfirmation(values.email)} 
            />,
            duration: 10000,
          });
          navigate("/");
          return;
        }
        handleAuthError(error);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user?.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Error",
          description: "Profile not found. Please try again or contact support.",
          variant: "destructive",
        });
        return;
      }

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
  };
};