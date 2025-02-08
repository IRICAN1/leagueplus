
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WinnerSelection } from "./WinnerSelection";
import { SetScoreInput } from "./SetScoreInput";
import { ThirdSetInput } from "./ThirdSetInput";
import { validateMatchResult } from "./utils/scoreValidation";
import { Challenge, DuoChallenge } from "@/types/match";

interface ScoreSubmissionFormProps {
  challenge: Challenge | DuoChallenge;
  onSubmit: (data: {
    winnerId: string;
    winnerScore1: string;
    loserScore1: string;
    winnerScore2: string;
    loserScore2: string;
    winnerScore3?: string;
    loserScore3?: string;
    showThirdSet: boolean;
  }) => void;
  isSubmitting: boolean;
  isDuo?: boolean;
}

export const ScoreSubmissionForm = ({
  challenge,
  onSubmit,
  isSubmitting,
  isDuo = false
}: ScoreSubmissionFormProps) => {
  const [winnerScore1, setWinnerScore1] = useState("");
  const [loserScore1, setLoserScore1] = useState("");
  const [winnerScore2, setWinnerScore2] = useState("");
  const [loserScore2, setLoserScore2] = useState("");
  const [winnerScore3, setWinnerScore3] = useState("");
  const [loserScore3, setLoserScore3] = useState("");
  const [winnerId, setWinnerId] = useState<string>("");
  const [isTiebreak1, setIsTiebreak1] = useState(false);
  const [isTiebreak2, setIsTiebreak2] = useState(false);
  const [isTiebreak3, setIsTiebreak3] = useState(false);
  const [showThirdSet, setShowThirdSet] = useState(false);

  const handleSubmit = () => {
    const isValid = validateMatchResult(
      winnerScore1,
      loserScore1,
      winnerScore2,
      loserScore2,
      showThirdSet ? winnerScore3 : null,
      showThirdSet ? loserScore3 : null,
      isTiebreak1,
      isTiebreak2,
      isTiebreak3
    );

    if (!isValid) return;

    onSubmit({
      winnerId,
      winnerScore1,
      loserScore1,
      winnerScore2,
      loserScore2,
      winnerScore3,
      loserScore3,
      showThirdSet
    });
  };

  return (
    <div className="space-y-4 py-4">
      <WinnerSelection
        challenge={challenge}
        winnerId={winnerId}
        setWinnerId={setWinnerId}
        isDuo={isDuo}
      />

      <SetScoreInput
        setNumber={1}
        winnerScore={winnerScore1}
        loserScore={loserScore1}
        isTiebreak={isTiebreak1}
        onWinnerScoreChange={setWinnerScore1}
        onLoserScoreChange={setLoserScore1}
        onTiebreakChange={setIsTiebreak1}
      />

      <SetScoreInput
        setNumber={2}
        winnerScore={winnerScore2}
        loserScore={loserScore2}
        isTiebreak={isTiebreak2}
        onWinnerScoreChange={setWinnerScore2}
        onLoserScoreChange={setLoserScore2}
        onTiebreakChange={setIsTiebreak2}
      />

      <ThirdSetInput
        showThirdSet={showThirdSet}
        winnerScore={winnerScore3}
        loserScore={loserScore3}
        isTiebreak={isTiebreak3}
        onWinnerScoreChange={setWinnerScore3}
        onLoserScoreChange={setLoserScore3}
        onTiebreakChange={setIsTiebreak3}
        onToggleThirdSet={() => setShowThirdSet(true)}
      />

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        {isSubmitting ? "Submitting..." : "Submit Result"}
      </Button>
    </div>
  );
};
