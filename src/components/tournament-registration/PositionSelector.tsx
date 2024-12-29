import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PositionSelectorProps {
  primaryPosition: string;
  setPrimaryPosition: (value: string) => void;
  secondaryPosition: string;
  setSecondaryPosition: (value: string) => void;
}

export const PositionSelector = ({
  primaryPosition,
  setPrimaryPosition,
  secondaryPosition,
  setSecondaryPosition,
}: PositionSelectorProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="font-semibold">Primary Position</label>
        <Select value={primaryPosition} onValueChange={setPrimaryPosition}>
          <SelectTrigger>
            <SelectValue placeholder="Select primary position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="singles">Singles</SelectItem>
            <SelectItem value="doubles">Doubles</SelectItem>
            <SelectItem value="mixed">Mixed Doubles</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="font-semibold">Secondary Position (Optional)</label>
        <Select value={secondaryPosition} onValueChange={setSecondaryPosition}>
          <SelectTrigger>
            <SelectValue placeholder="Select secondary position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="singles">Singles</SelectItem>
            <SelectItem value="doubles">Doubles</SelectItem>
            <SelectItem value="mixed">Mixed Doubles</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};