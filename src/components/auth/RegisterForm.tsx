import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RegisterFormFields } from "./RegisterFormFields";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  avatarUrl: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const RegisterForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatarUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      // First, register the user
      const { error: signUpError, data: { user } } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error("No user returned after registration");

      // Then, if there's an avatar file, upload it
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            upsert: true
          });

        if (uploadError) {
          console.error('Avatar upload error:', uploadError);
          // Don't throw here, just show a warning toast
          toast({
            title: "Avatar Upload Failed",
            description: "Your account was created, but we couldn't upload your profile picture. You can try again later.",
            variant: "warning",
          });
        } else {
          // Get public URL and update profile
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);

          if (updateError) {
            console.error('Profile update error:', updateError);
            // Don't throw here either, just show a warning toast
            toast({
              title: "Profile Update Warning",
              description: "Your account was created, but we couldn't update your profile picture. You can try again later.",
              variant: "warning",
            });
          }
        }
      }

      toast({
        title: "Registration Successful",
        description: "Welcome to LeaguePlus!",
      });

      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RegisterFormFields form={form} setAvatarFile={setAvatarFile} />
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
          Create Account
        </Button>
      </form>
    </Form>
  );
};