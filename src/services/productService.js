import { supabase } from "../lib/supabase";

export const createProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        farmer_id: product.farmer_id,
        category_id: product.category_id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        state: product.state,
        city: product.city,
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      profiles(full_name)
    `)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      profiles(full_name)
    `)
    .eq("id", id)
    .single();

  return { data, error };
};

export const getRelatedProducts = async (categoryId, currentProductId) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .limit(4);

  return { data, error };
};

export const getProduct = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      profiles(full_name)
    `)
    .eq("id", id)
    .single();

  return { data, error };
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  return { error };
};