import { Card } from "@/components/ui/card";
import { ProfilePicture } from "./ProfilePicture";
import { ProfileForm } from "./ProfileForm";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Profile Settings
          </h1>
          {!isEditing && (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto animate-pulse-soft hover:bg-purple-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Profile Picture Card - Full width on mobile, side column on desktop */}
          <div className={`${isMobile ? 'order-first' : ''}`}>
            <Card className="p-4 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ProfilePicture
                currentUrl={profile?.avatar_url}
                onImageChange={setAvatarFile}
                isEditing={isEditing}
              />
            </Card>
          </div>
          
          {/* Main Form Section */}
          <div className="flex-1">
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