
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Camera, Save, ShieldCheck } from "lucide-react";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const FarmProfile = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    farm_name: "",
    farm_description: "",
    state: "",
    city: "",
    farm_image: "",
    avatar_url: "",
  });

  const [verificationStatus, setVerificationStatus] =
    useState("pending");

  const [searchParams] = useSearchParams();

  // targetId: admin can pass ?id=<farmerId> to edit another farmer
  const targetId = searchParams.get("id") || user?.id;

  // ---------------------------------------
  // Fetch farm profile
  // ---------------------------------------
  const fetchFarmProfile = async () => {
    if (!targetId) return;

    try {
      const { data, error } = await supabase
          .from("profiles")
          .select(`
            farm_name,
            farm_description,
            state,
            city,
            farm_image,
            avatar_url,
            verification_status
          `)
        .eq("id", targetId)
        .single();

      if (error) {
        throw error;
      }

      setFormData({
        farm_name: data?.farm_name || "",
        farm_description:
          data?.farm_description || "",
        state: data?.state || "",
        city: data?.city || "",
        farm_image: data?.farm_image || "",
        avatar_url: data?.avatar_url || "",
      });

      setVerificationStatus(
        data?.verification_status || "pending"
      );
    } catch (error) {
      console.error(
        "Farm profile error:",
        error
      );

      toast.error(
        "Unable to load farm profile."
      );
    }
  };

  // ---------------------------------------
  // Initial load
  // ---------------------------------------
  useEffect(() => {
    if (!targetId) return;

    const loadProfile = async () => {
      setLoading(true);

      await fetchFarmProfile();

      setLoading(false);
    };

    loadProfile();
  }, [user?.id]);

  // ---------------------------------------
  // Handle text inputs
  // ---------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------
  // Handle image selection
  // ---------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be less than 5MB."
      );
      return;
    }

    setImageFile(file);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    setAvatarFile(file);
  };

  // ---------------------------------------
  // Upload farm image
  // ---------------------------------------
  const uploadFarmImage = async () => {
    if (!imageFile) {
      return formData.farm_image;
    }

    const fileExtension =
      imageFile.name.split(".").pop();

    const ownerId = targetId || user.id;

    const fileName =
      `${ownerId}-${Date.now()}.${fileExtension}`;

    const filePath =
      `${ownerId}/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("farm-images")
        .upload(
          filePath,
          imageFile,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("farm-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return formData.avatar_url;

    const fileExtension = avatarFile.name.split(".").pop();
    const ownerId = targetId || user.id;
    const fileName = `${ownerId}-avatar-${Date.now()}.${fileExtension}`;
    const filePath = `${ownerId}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { cacheControl: '3600', upsert: false });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // ---------------------------------------
  // Save farm profile
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error(
        "You must be logged in."
      );
      return;
    }

    try {
      setSaving(true);

      // Upload new avatar and farm image if selected
      const avatarUrl = await uploadAvatar();
      const farmImageUrl = await uploadFarmImage();

      // Update profile
      const { error: updateError } = await supabase.from("profiles").update({
        farm_name: formData.farm_name.trim(),
        farm_description: formData.farm_description.trim(),
        state: formData.state.trim(),
        city: formData.city.trim(),
        farm_image: farmImageUrl || null,
        avatar_url: avatarUrl || null,
      }).eq("id", targetId);

      if (updateError) {
        throw updateError;
      }

      // ---------------------------------------
      // IMPORTANT:
      // Fetch the updated profile again
      // ---------------------------------------
      const { data: updatedProfile, error: fetchError } =
        await supabase
          .from("profiles")
          .select(`
            farm_name,
            farm_description,
            state,
            city,
            farm_image,
            verification_status
          `)
          .eq("id", user.id)
          .single();

      if (fetchError) {
        throw fetchError;
      }

      // ---------------------------------------
      // Update form with freshly saved data
      // ---------------------------------------
      setFormData({
        farm_name:
          updatedProfile.farm_name || "",

        farm_description:
          updatedProfile.farm_description || "",

        state:
          updatedProfile.state || "",

        city:
          updatedProfile.city || "",

        farm_image:
          updatedProfile.farm_image || "",
      });

      setVerificationStatus(
        updatedProfile.verification_status ||
          "pending"
      );

      // Clear only the newly selected file.
      // The saved image remains visible.
      setImageFile(null);
      setAvatarFile(null);

      // Refresh auth profile in the app (dev helper)
      try { if (window.refreshAuthProfile) await window.refreshAuthProfile(); } catch(e) {}

      toast.success(
        "Farm profile saved successfully!"
      );
    } catch (error) {
      console.error(
        "SAVE FARM PROFILE ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Unable to save farm profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------
  // Loading state
  // ---------------------------------------
  if (loading) {
    return (
      <div className="container-width py-12">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-8 h-96 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  // ---------------------------------------
  // Image preview
  // ---------------------------------------
  const imagePreview = imageFile
    ? URL.createObjectURL(imageFile)
    : formData.farm_image;

  return <div>Farm Profile</div>;
};

export default FarmProfile;
