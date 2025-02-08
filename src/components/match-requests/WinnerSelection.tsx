
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Challenge, DuoChallenge } from "@/types/match";

interface WinnerSelectionProps {
  challenge: Challenge | DuoChallenge;
  winnerId: string;
  setWinnerId: (id: string) => void;
  isDuo?: boolean;
}

export const WinnerSelection = ({ 
  challenge, 
  winnerId, 
  setWinnerId,
  isDuo = false 
}: WinnerSelectionProps) => {
  if (isDuo) {
    const duoChallenge = challenge as DuoChallenge;
    return (
      <RadioGroup
        value={winnerId}
        onValueChange={setWinnerId}
        className="flex flex-col space-y-2"
      >
        <Label>Winner</Label>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={duoChallenge.challenger_partnership.id} id="challenger_partnership" />
          <Label htmlFor="challenger_partnership">
            {duoChallenge.challenger_partnership.player1.full_name} & {duoChallenge.challenger_partnership.player2.full_name}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={duoChallenge.challenged_partnership.id} id="challenged_partnership" />
          <Label htmlFor="challenged_partnership">
            {duoChallenge.challenged_partnership.player1.full_name} & {duoChallenge.challenged_partnership.player2.full_name}
          </Label>
        </div>
      </RadioGroup>
    );
  }

  const individualChallenge = challenge as Challenge;
  return (
    <RadioGroup
      value={winnerId}
      onValueChange={setWinnerId}
      className="flex flex-col space-y-2"
    >
      <Label>Winner</Label>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={individualChallenge.challenger_id} id="challenger" />
        <Label htmlFor="challenger">{individualChallenge.challenger.username}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={individualChallenge.challenged_id} id="challenged" />
        <Label htmlFor="challenged">{individualChallenge.challenged.username}</Label>
      </div>
    </RadioGroup>
  );
};
