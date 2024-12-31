import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LocationPreferencesProps {
  isEditing: boolean;
  formData: {
    primaryLocation?: string;
    preferredRegions?: string[];
    maxTravelDistance?: number;
    favoriteVenues?: string[];
  };
  onChange: (field: string, value: any) => void;
}

export const LocationPreferences = ({
  isEditing,
  formData,
  onChange,
}: LocationPreferencesProps) => {
  const handleAddRegion = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = event.currentTarget.value.trim();
      if (value && (!formData.preferredRegions || !formData.preferredRegions.includes(value))) {
        onChange('preferredRegions', [...(formData.preferredRegions || []), value]);
        event.currentTarget.value = '';
      }
    }
  };

  const handleAddVenue = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = event.currentTarget.value.trim();
      if (value && (!formData.favoriteVenues || !formData.favoriteVenues.includes(value))) {
        onChange('favoriteVenues', [...(formData.favoriteVenues || []), value]);
        event.currentTarget.value = '';
      }
    }
  };

  const removeRegion = (region: string) => {
    onChange('preferredRegions', formData.preferredRegions?.filter(r => r !== region));
  };

  const removeVenue = (venue: string) => {
    onChange('favoriteVenues', formData.favoriteVenues?.filter(v => v !== venue));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Primary Location</Label>
        <Input
          placeholder="Enter your primary location"
          value={formData.primaryLocation || ''}
          onChange={(e) => onChange('primaryLocation', e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="space-y-2">
        <Label>Maximum Travel Distance (km)</Label>
        <div className="pt-2">
          <Slider
            value={[formData.maxTravelDistance || 0]}
            onValueChange={([value]) => onChange('maxTravelDistance', value)}
            max={100}
            step={1}
            disabled={!isEditing}
          />
          <div className="mt-1 text-sm text-gray-500">
            {formData.maxTravelDistance || 0} km
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preferred Regions</Label>
        <Input
          placeholder="Type and press Enter to add"
          onKeyDown={handleAddRegion}
          disabled={!isEditing}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.preferredRegions?.map((region) => (
            <Badge
              key={region}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {region}
              {isEditing && (
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeRegion(region)}
                />
              )}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Favorite Venues (Optional)</Label>
        <Input
          placeholder="Type and press Enter to add"
          onKeyDown={handleAddVenue}
          disabled={!isEditing}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.favoriteVenues?.map((venue) => (
            <Badge
              key={venue}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {venue}
              {isEditing && (
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeVenue(venue)}
                />
              )}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};