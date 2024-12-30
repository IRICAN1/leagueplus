import { Progress } from "@/components/ui/progress";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const calculateStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const getStrengthText = (strength: number): string => {
    if (strength === 0) return "Very Weak";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 25) return "text-red-500";
    if (strength <= 50) return "text-orange-500";
    if (strength <= 75) return "text-yellow-500";
    return "text-green-500";
  };

  const strength = calculateStrength(password);

  return (
    <div className="space-y-2">
      <Progress value={strength} className="h-2" />
      <p className={`text-xs ${getStrengthColor(strength)}`}>
        Password Strength: {getStrengthText(strength)}
      </p>
    </div>
  );
};