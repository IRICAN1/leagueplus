import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Image, Upload } from "lucide-react";

interface ImageUploadProps {
  avatarUrl: string | null;
  onImageUpload: (file: File) => void;
}

export const ImageUpload = ({ avatarUrl, onImageUpload }: ImageUploadProps) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <Label
          htmlFor="avatar"
          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
        </Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};