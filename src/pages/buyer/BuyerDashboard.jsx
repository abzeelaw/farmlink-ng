import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Camera, Save } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const BuyerDashboard = () => {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({ full_name: "", phone: "", avatar_url: "" });

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`full_name, phone, avatar_url`)
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setForm({ full_name: data.full_name || "", phone: data.phone || "", avatar_url: data.avatar_url || "" });
      } catch (err) {
        console.error("Failed to load buyer profile", err);
        toast.error("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Select an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be less than 5MB");
    setImageFile(file);
  };

  const uploadAvatar = async () => {
    if (!imageFile) return form.avatar_url;

    const ext = imageFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${ext}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, imageFile, { cacheControl: '3600', upsert: false });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return toast.error('Log in first');

    try {
      setSaving(true);
      const avatarUrl = await uploadAvatar();

      const { error } = await supabase.from('profiles').update({ full_name: form.full_name.trim(), phone: form.phone.trim(), avatar_url: avatarUrl || null }).eq('id', user.id);
      if (error) throw error;

      toast.success('Profile saved');
      setImageFile(null);
      if (window.refreshAuthProfile) await window.refreshAuthProfile();
    } catch (err) {
      console.error('Save buyer profile failed', err);
      toast.error(err.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container-width py-12">Loading...</div>;

  return (
    <div className="container-width py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Buyer Dashboard</h1>
          <p className="mt-1 text-slate-500">Update your details and profile picture.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-3 block font-semibold text-slate-900">Avatar</label>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {imageFile ? (
                <img src={URL.createObjectURL(imageFile)} className="h-40 w-full object-cover" alt="avatar" />
              ) : form.avatar_url ? (
                <img src={form.avatar_url} className="h-40 w-full object-cover" alt="avatar" />
              ) : (
                <div className="flex h-40 items-center justify-center text-slate-400">No avatar</div>
              )}

              <label className="absolute bottom-4 right-4 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg">
                <Camera size={16} />
                Change
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-slate-900">Full name</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-lg border p-3" />

            <label className="mb-2 mt-4 block font-semibold text-slate-900">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border p-3" />

            <div className="mt-6">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white">
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BuyerDashboard;
