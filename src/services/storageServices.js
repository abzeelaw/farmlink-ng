import { supabase } from "../lib/supabase";

export const uploadProductImage = async (file) => {
  if (!file) {
    throw new Error("No image selected.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  console.log("Upload Data:", data);
  console.log("Upload Error:", error);

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  console.log("Public URL:", publicUrl);

  return publicUrl;
};