import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onFileChange: (file: File) => void;
}

export const ImageUpload = ({ value, onChange, onFileChange }: ImageUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        onChange(reader.result as string);
        onFileChange(file);
      };
      
      reader.readAsDataURL(file);
    }
  }, [onChange, onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={value} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
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
    </div>
  );
};