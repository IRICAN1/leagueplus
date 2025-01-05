import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface SetScoreInputProps {
  setNumber: number;
  winnerScore: string;
  loserScore: string;
  isTiebreak: boolean;
  onWinnerScoreChange: (value: string) => void;
  onLoserScoreChange: (value: string) => void;
  onTiebreakChange: (checked: boolean) => void;
}

export const SetScoreInput = ({
  setNumber,
  winnerScore,
  loserScore,
  isTiebreak,
  onWinnerScoreChange,
  onLoserScoreChange,
  onTiebreakChange,
}: SetScoreInputProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Set {setNumber}</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor={`tiebreak${setNumber}`}>Tiebreak</Label>
          <Switch
            id={`tiebreak${setNumber}`}
            checked={isTiebreak}
            onCheckedChange={onTiebreakChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Winner Score</Label>
          <Input
            placeholder={isTiebreak ? "7" : "6"}
            value={winnerScore}
            onChange={(e) => onWinnerScoreChange(e.target.value)}
            maxLength={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Loser Score</Label>
          <Input
            placeholder={isTiebreak ? "6" : "4"}
            value={loserScore}
            onChange={(e) => onLoserScoreChange(e.target.value)}
            maxLength={1}
          />
        </div>
      </div>
    </div>
  );
};