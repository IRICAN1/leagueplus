import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WinnerSelectionProps {
  challenge: any;
  winnerId: string;
  setWinnerId: (id: string) => void;
}

export const WinnerSelection = ({ challenge, winnerId, setWinnerId }: WinnerSelectionProps) => {
  return (
    <RadioGroup
      value={winnerId}
      onValueChange={setWinnerId}
      className="flex flex-col space-y-2"
    >
      <Label>Winner</Label>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={challenge.challenger_id} id="challenger" />
        <Label htmlFor="challenger">{challenge.challenger.username}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={challenge.challenged_id} id="challenged" />
        <Label htmlFor="challenged">{challenge.challenged.username}</Label>
      </div>
    </RadioGroup>
  );
};