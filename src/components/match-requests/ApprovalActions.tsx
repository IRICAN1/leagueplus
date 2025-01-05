import { Button } from "@/components/ui/button";

interface ApprovalActionsProps {
  onApprove: () => void;
  onDispute: () => void;
}

export const ApprovalActions = ({ onApprove, onDispute }: ApprovalActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onDispute}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        Dispute
      </Button>
      <Button
        size="sm"
        onClick={onApprove}
        className="bg-green-500 hover:bg-green-600"
      >
        Approve
      </Button>
    </div>
  );
};