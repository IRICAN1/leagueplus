import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfilePictureProps {
  currentUrl?: string;
  onImageChange: (file: File) => void;
  isEditing: boolean;
}

export const ProfilePicture = ({ currentUrl, onImageChange, isEditing }: ProfilePictureProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false,
    disabled: !isEditing,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        onImageChange(file);
      }
    }
  });

  const avatarSize = isMobile ? "h-24 w-24" : "h-32 w-32";
  const iconSize = isMobile ? "h-12 w-12" : "h-16 w-16";

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className={`${avatarSize} ring-2 ring-purple-100 transition-all duration-300 group-hover:ring-purple-300`}>
          <AvatarImage src={preview || currentUrl} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100">
            <User className={iconSize} />
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <div
            {...getRootProps()}
            className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            <input {...getInputProps()} />
            <Camera className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
      {isEditing && (
        <p className="text-sm text-gray-500 text-center animate-fade-in">
          Click the camera icon to update your profile picture
        </p>
      )}
    </div>
  );
};