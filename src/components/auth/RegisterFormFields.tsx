import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, User, Lock } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { UseFormReturn } from "react-hook-form";

interface RegisterFormFieldsProps {
  form: UseFormReturn<any>;
  setAvatarFile: (file: File | null) => void;
}

export const RegisterFormFields = ({ form, setAvatarFile }: RegisterFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="avatarUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                onFileChange={(file) => setAvatarFile(file)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="John Doe" 
                  className="pl-10 bg-white" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="your.email@example.com" 
                  className="pl-10 bg-white" 
                  type="email"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  type="password" 
                  placeholder="Create a strong password" 
                  className="pl-10 bg-white" 
                  {...field} 
                />
              </div>
            </FormControl>
            <PasswordStrengthMeter password={field.value} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  className="pl-10 bg-white" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};