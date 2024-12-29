import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface RegistrationButtonProps {
  onClick: () => void;
}

export const RegistrationButton = ({ onClick }: RegistrationButtonProps) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onClick}
        className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
        size="lg"
      >
        <Trophy className="mr-2 h-4 w-4" />
        Complete Registration
      </Button>
    </div>
  );
};