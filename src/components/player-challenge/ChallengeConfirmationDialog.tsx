import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChallengeConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  challengeDetails: {
    playerName: string;
    leagueName: string;
    location: string;
    proposedTime: string;
    leagueId: string;
  };
}

export const ChallengeConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  challengeDetails,
}: ChallengeConfirmationDialogProps) => {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
    navigate(`/tournament/${challengeDetails.leagueId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Challenge Request</DialogTitle>
          <DialogDescription>
            Please review the challenge details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-semibold mb-2">League</h4>
            <p className="text-sm text-gray-600">{challengeDetails.leagueName}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Opponent</h4>
            <p className="text-sm text-gray-600">{challengeDetails.playerName}</p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <p className="text-sm text-gray-600">
              {format(new Date(challengeDetails.proposedTime), 'PPp')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <p className="text-sm text-gray-600">{challengeDetails.location}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Challenge</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};