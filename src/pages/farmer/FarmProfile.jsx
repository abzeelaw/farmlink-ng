
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Camera, Save, ShieldCheck } from "lucide-react";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const FarmProfile = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    farm_name: "",
    farm_description: "",
    state: "",
    city: "",
    farm_image: "",
  });

  const [verificationStatus, setVerificationStatus] =
    useState("pending");

  // ---------------------------------------
  // Fetch farm profile
  // ---------------------------------------
  const fetchFarmProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
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
    if (!user?.id) return;

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

  // ---------------------------------------
  // Upload farm image
  // ---------------------------------------
  const uploadFarmImage = async () => {
    if (!imageFile) {
      return formData.farm_image;
    }

    const fileExtension =
      imageFile.name.split(".").pop();

    const fileName =
      `${user.id}-${Date.now()}.${fileExtension}`;

    const filePath =
      `${user.id}/${fileName}`;

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

      // Upload new image if selected
      const farmImageUrl =
        await uploadFarmImage();

      // Update profile
      const { error: updateError } =
        await supabase
          .from("profiles")
          .update({
            farm_name:
              formData.farm_name.trim(),

            farm_description:
              formData.farm_description.trim(),

            state:
              formData.state.trim(),

            city:
              formData.city.trim(),

            farm_image:
              farmImageUrl || null,
          })
          .eq("id", user.id);

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

  return (
    <div className="container-width py-10 md:py-12">

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Farm Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Tell customers and our verification
              team about your farm.
            </p>
          </div>

          {/* Verification Status */}
          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              verificationStatus === "verified"
                ? "bg-emerald-100 text-emerald-700"
                : verificationStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            <ShieldCheck size={18} />

            {verificationStatus === "verified"
              ? "Verified Farmer"
              : verificationStatus === "rejected"
                ? "Verification Rejected"
                : "Verification Pending"}
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Farm Image */}
          <div>
            <label className="mb-3 block font-semibold text-slate-900">
              Farm Image
            </label>

            <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Farm"
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="flex h-72 flex-col items-center justify-center text-slate-400">
                  <Camera size={42} />

                  <p className="mt-3 text-sm">
                    Upload your farm image
                  </p>
                </div>
              )}

              <label className="absolute bottom-4 right-4 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg transition hover:bg-emerald-50">
                <Camera size={18} />

                Change Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              PNG, JPG or WEBP. Maximum 5MB.
            </p>
          </div>

          {/* Farm Information */}
          <div className="space-y-6 lg:col-span-2">

            {/* Farm Name */}
            <div>
              <label className="mb-2 block font-medium">
                Farm Name
              </label>

              <input
                type="text"
                name="farm_name"
                value={formData.farm_name}
                onChange={handleChange}
                placeholder="e.g. Green Valley Farm"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Farm Description */}
            <div>
              <label className="mb-2 block font-medium">
                Farm Description
              </label>

              <textarea
                name="farm_description"
                value={
                  formData.farm_description
                }
                onChange={handleChange}
                rows={5}
                placeholder="Tell customers about your farm, what you grow or produce, and what makes your farm unique."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Location */}
            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Kaduna"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Zaria"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

            </div>

            {/* Verification Notice */}
            <div className="rounded-2xl bg-emerald-50 p-5">

              <div className="flex gap-3">

                <ShieldCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <h3 className="font-semibold text-emerald-800">
                    Farmer Verification
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    Complete your farm information
                    and upload a clear farm image.
                    Our admin team will review your
                    profile before verifying your farm.
                  </p>
                </div>

              </div>

            </div>

            {/* Submit */}
            <div className="flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Farm Profile"}
              </button>

            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default FarmProfile;
