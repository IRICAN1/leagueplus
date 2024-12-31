import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ProfilePicture } from "@/components/profile/ProfilePicture";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Edit } from "lucide-react";

const defaultFormData = {
  fullName: "",
  email: "",
  primaryLocation: "",
  preferredRegions: [],
  maxTravelDistance: 0,
  favoriteVenues: [],
  availabilitySchedule: { selectedSlots: [] },
  weekdayPreference: "both",
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    checkAuth();
    fetchProfile();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      setProfile(profile);
      setFormData({
        fullName: profile.full_name || "",
        email: session.user.email || "",
        primaryLocation: profile.primary_location || "",
        preferredRegions: profile.preferred_regions || [],
        maxTravelDistance: profile.max_travel_distance || 0,
        favoriteVenues: profile.favorite_venues || [],
        availabilitySchedule: profile.availability_schedule ? 
          { selectedSlots: profile.availability_schedule.selectedSlots || [] } : 
          { selectedSlots: [] },
        weekdayPreference: profile.weekday_preference || "both",
      });
    } catch (error: any) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const updates = {
        id: session.user.id,
        full_name: formData.fullName,
        primary_location: formData.primaryLocation,
        preferred_regions: formData.preferredRegions,
        max_travel_distance: formData.maxTravelDistance,
        favorite_venues: formData.favoriteVenues,
        availability_schedule: formData.availabilitySchedule,
        weekday_preference: formData.weekdayPreference,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${session.user.id}/${session.user.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        const { error: avatarUpdateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', session.user.id);

        if (avatarUpdateError) throw avatarUpdateError;
      }

      await fetchProfile();
      setIsEditing(false);
      setAvatarFile(null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setFormData({
      ...defaultFormData,
      fullName: profile?.full_name || "",
      email: profile?.email || "",
      primaryLocation: profile?.primary_location || "",
      preferredRegions: profile?.preferred_regions || [],
      maxTravelDistance: profile?.max_travel_distance || 0,
      favoriteVenues: profile?.favorite_venues || [],
      availabilitySchedule: profile?.availability_schedule || { selectedSlots: [] },
      weekdayPreference: profile?.weekday_preference || "both",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container max-w-2xl mx-auto px-4 py-8">
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

        <div className="space-y-6">
          <ProfilePicture
            currentUrl={profile?.avatar_url}
            onImageChange={setAvatarFile}
            isEditing={isEditing}
          />
          
          <ProfileForm
            isEditing={isEditing}
            formData={formData}
            onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;