import { Progress } from "@/components/ui/progress";

interface PasswordStrengthMeterProps {
  strength: number;
}

export const PasswordStrengthMeter = ({ strength }: PasswordStrengthMeterProps) => {
  return (
    <div className="space-y-2">
      <Progress value={strength} className="h-1" />
      <p className="text-xs text-gray-500">
        {strength === 0 && "Very weak"}
        {strength === 25 && "Weak"}
        {strength === 50 && "Medium"}
        {strength === 75 && "Strong"}
        {strength === 100 && "Very strong"}
      </p>
    </div>
  );
};