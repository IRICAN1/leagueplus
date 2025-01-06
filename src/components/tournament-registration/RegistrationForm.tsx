import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InfoIcon } from "lucide-react";
import { TournamentHeader } from "./TournamentHeader";
import { TournamentInfo } from "./TournamentInfo";
import { PositionSelector } from "./PositionSelector";
import { AvailabilitySection } from "./AvailabilitySection";
import { RegistrationButton } from "./RegistrationButton";

interface RegistrationFormProps {
  league: any;
  primaryPosition: string;
  setPrimaryPosition: (value: string) => void;
  secondaryPosition: string;
  setSecondaryPosition: (value: string) => void;
  hasExistingSchedule: boolean;
  onTimeSlotSelect: (slots: string[]) => void;
  onSubmit: () => void;
}

export const RegistrationForm = ({
  league,
  primaryPosition,
  setPrimaryPosition,
  secondaryPosition,
  setSecondaryPosition,
  hasExistingSchedule,
  onTimeSlotSelect,
  onSubmit,
}: RegistrationFormProps) => {
  return (
    <Card className="bg-white/80 shadow-lg">
      <TournamentHeader name={league?.name || ''} />
      <CardContent className="grid gap-6">
        <TournamentInfo
          registrationDeadline={league.registration_deadline}
          startDate={league.start_date}
          endDate={league.end_date}
          matchFormat={league.match_format}
          rules={league.rules}
        />

        <Separator className="my-4" />

        <PositionSelector
          primaryPosition={primaryPosition}
          setPrimaryPosition={setPrimaryPosition}
          secondaryPosition={secondaryPosition}
          setSecondaryPosition={setSecondaryPosition}
        />

        {!hasExistingSchedule && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <InfoIcon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Please configure your availability schedule below
                </span>
              </div>
              
              <AvailabilitySection onTimeSlotSelect={onTimeSlotSelect} />
            </div>
          </>
        )}

        <Separator className="my-4" />

        <RegistrationButton onClick={onSubmit} />
      </CardContent>
    </Card>
  );
};