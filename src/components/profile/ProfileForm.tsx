import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Save, X, MapPin, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationPreferences } from "./LocationPreferences";
import { AvailabilitySchedule } from "./AvailabilitySchedule";

interface ProfileFormProps {
  isEditing: boolean;
  formData: {
    fullName: string;
    email: string;
    primaryLocation?: string;
    preferredRegions?: string[];
    maxTravelDistance?: number;
    favoriteVenues?: string[];
    availabilitySchedule?: any;
    weekdayPreference?: string;
  };
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileForm = ({
  isEditing,
  formData,
  onChange,
  onSave,
  onCancel
}: ProfileFormProps) => {
  return (
    <Card className="bg-white/80">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  value={formData.fullName}
                  onChange={(e) => onChange('fullName', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  value={formData.email}
                  disabled
                  className="pl-10 bg-gray-50"
                />
              </div>
              <p className="text-sm text-gray-500">
                Contact support to change your email address
              </p>
            </div>
          </TabsContent>

          <TabsContent value="location">
            <LocationPreferences
              isEditing={isEditing}
              formData={formData}
              onChange={onChange}
            />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilitySchedule
              isEditing={isEditing}
              formData={formData}
              onChange={onChange}
            />
          </TabsContent>
        </Tabs>

        {isEditing && (
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="default"
              onClick={onSave}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};