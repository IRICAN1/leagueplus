import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Save, X } from "lucide-react";

interface ProfileFormProps {
  isEditing: boolean;
  formData: {
    fullName: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
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
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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