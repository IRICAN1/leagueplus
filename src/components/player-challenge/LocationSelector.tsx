import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface LocationSelectorProps {
  locations: Array<{
    id: string;
    name: string;
    distance: string;
  }>;
  selectedLocation: string;
  onLocationSelect: (locationId: string) => void;
}

export const LocationSelector = ({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationSelectorProps) => {
  return (
    <Card className="md:col-span-2 bg-white/80 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Select Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedLocation}
          onValueChange={onLocationSelect}
          className="grid gap-4 md:grid-cols-3"
        >
          {locations.map((location) => (
            <label
              key={location.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                selectedLocation === location.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-200"
              )}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={location.id} id={location.id} />
                <div>
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-gray-500">{location.distance}</div>
                </div>
              </div>
            </label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};