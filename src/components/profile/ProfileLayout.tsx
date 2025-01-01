import { Card } from "@/components/ui/card";
import { ProfilePicture } from "./ProfilePicture";
import { ProfileForm } from "./ProfileForm";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileLayoutProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  profile: any;
  formData: any;
  setFormData: (value: any) => void;
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileLayout = ({
  isEditing,
  setIsEditing,
  profile,
  formData,
  setFormData,
  avatarFile,
  setAvatarFile,
  onSave,
  onCancel
}: ProfileLayoutProps) => {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          {!isEditing && (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <Card className="p-4">
              <ProfilePicture
                currentUrl={profile?.avatar_url}
                onImageChange={setAvatarFile}
                isEditing={isEditing}
              />
            </Card>
          </div>
          
          <div className="md:col-span-8">
            <ProfileForm
              isEditing={isEditing}
              formData={formData}
              onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
              onSave={onSave}
              onCancel={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};