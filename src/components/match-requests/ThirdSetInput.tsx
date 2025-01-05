import { Button } from "@/components/ui/button";
import { SetScoreInput } from "./SetScoreInput";

interface ThirdSetInputProps {
  showThirdSet: boolean;
  winnerScore: string;
  loserScore: string;
  isTiebreak: boolean;
  onWinnerScoreChange: (value: string) => void;
  onLoserScoreChange: (value: string) => void;
  onTiebreakChange: (checked: boolean) => void;
  onToggleThirdSet: () => void;
}

export const ThirdSetInput = ({
  showThirdSet,
  winnerScore,
  loserScore,
  isTiebreak,
  onWinnerScoreChange,
  onLoserScoreChange,
  onTiebreakChange,
  onToggleThirdSet,
}: ThirdSetInputProps) => {
  if (!showThirdSet) {
    return (
      <Button 
        type="button"
        variant="outline" 
        onClick={onToggleThirdSet}
        className="w-full mt-4"
      >
        Add Third Set
      </Button>
    );
  }

  return (
    <SetScoreInput
      setNumber={3}
      winnerScore={winnerScore}
      loserScore={loserScore}
      isTiebreak={isTiebreak}
      onWinnerScoreChange={onWinnerScoreChange}
      onLoserScoreChange={onLoserScoreChange}
      onTiebreakChange={onTiebreakChange}
    />
  );
};