import { Button } from "@/components/ui/button";

interface EmailConfirmationToastProps {
  email: string;
  onResend: () => void;
}

export const EmailConfirmationToast = ({ email, onResend }: EmailConfirmationToastProps) => {
  return (
    <div className="space-y-2">
      <p>You can continue using the app, but please confirm your email to access all features.</p>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onResend}
      >
        Resend Confirmation Email
      </Button>
    </div>
  );
};