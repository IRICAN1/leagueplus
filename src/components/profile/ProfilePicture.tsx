import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera } from "lucide-react";

interface ProfilePictureProps {
  currentUrl?: string;
  onImageChange: (file: File) => void;
  isEditing: boolean;
}

export const ProfilePicture = ({ currentUrl, onImageChange, isEditing }: ProfilePictureProps) => {
  const [preview, setPreview] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={preview || currentUrl} />
          <AvatarFallback>
            <User className="h-16 w-16" />
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <div
            {...getRootProps()}
            className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
          >
            <input {...getInputProps()} />
            <Camera className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
      {isEditing && (
        <p className="text-sm text-gray-500 text-center">
          Click the camera icon to update your profile picture
        </p>
      )}
    </div>
  );
};