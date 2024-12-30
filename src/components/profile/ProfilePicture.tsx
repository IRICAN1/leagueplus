import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Camera } from "lucide-react";

interface ProfilePictureProps {
  currentUrl?: string;
  onImageChange: (file: File) => void;
  isEditing: boolean;
}

export const ProfilePicture = ({ currentUrl, onImageChange, isEditing }: ProfilePictureProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
    <Card className="bg-white/80">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={preview || currentUrl} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div
                {...getRootProps()}
                className="absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
              >
                <input {...getInputProps()} />
                <Camera className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          {isEditing && (
            <div
              {...getRootProps()}
              className={`
                w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-300 hover:border-purple-500"
                }
              `}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-sm text-purple-600">Drop your image here</p>
              ) : (
                <p className="text-sm text-gray-600">
                  Drag & drop an image here, or click to select one
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};