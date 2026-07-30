import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { supabase } from "../../lib/supabase";
import { uploadProductImage } from "../../services/storageServices";
import { useAuth } from "../../context/AuthContext";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    state: "",
    city: "",
    image: "",
  });

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      if (authLoading || !user) return;

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .eq("farmer_id", user.id)
          .single();

        if (error) throw error;

        setFormData({
          category_id: data.category_id || "",
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          stock: data.stock || "",
          state: data.state || "",
          city: data.city || "",
          image: data.image || "",
        });
      } catch (error) {
        console.error("Fetch product error:", error);

        toast.error(
          error.message || "Failed to load product."
        );

        navigate("/farmer/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, authLoading, navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Categories error:", error);
        return;
      }

      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = formData.image;

      // Upload new image if selected
      if (image) {
        imageUrl = await uploadProductImage(image);
      }

      const { error } = await supabase
        .from("products")
        .update({
          category_id: formData.category_id,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          state: formData.state,
          city: formData.city,
          image: imageUrl,
        })
        .eq("id", id)
        .eq("farmer_id", user.id);

      if (error) throw error;

      toast.success("Product updated successfully.");

      navigate("/farmer/products");
    } catch (error) {
      console.error("Update product error:", error);

      toast.error(
        error.message || "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <p className="text-slate-500">
            Loading product...
          </p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <h1 className="text-3xl font-bold">
            Please log in
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Edit Product
          </h1>

          <p className="mt-2 text-slate-500">
            Update your product information and stock.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 shadow-sm"
        >

          <div className="grid gap-6 md:grid-cols-2">

            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block font-medium">
                Price (₦)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block font-medium">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="mb-2 block font-medium">
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block font-medium">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Current Image */}
            {formData.image && (
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">
                  Current Image
                </label>

                <img
                  src={formData.image}
                  alt={formData.name}
                  className="h-48 w-full rounded-2xl object-cover md:w-80"
                />
              </div>
            )}

            {/* New Image */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Replace Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />

              <p className="mt-2 text-sm text-slate-500">
                Leave this empty if you want to keep the current image.
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate("/farmer/products")}
              className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </section>
  );
};

export default EditProduct;