import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { supabase } from "../../lib/supabase";
import { uploadProductImage } from "../../services/storageServices";
import { createProduct } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";

const AddProduct = () => {
  const { user, profile } = useAuth();

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    farmer_id: "",
    category_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    state: "",
    city: "",
  });

  const [farmersList, setFarmersList] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*");

      setCategories(data || []);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    // If admin, load farmers for selection
    const loadFarmers = async () => {
      if (!profile || profile.role !== "admin") return;

      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, farm_name, email")
        .eq("role", "farmer")
        .order("created_at", { ascending: false });

      setFarmersList(data || []);
    };

    loadFarmers();
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent unverified farmers from adding products
    if (profile?.role === "farmer" && profile?.verification_status !== "verified") {
      toast.error("Your account is not verified yet. Please complete your profile and wait for admin verification before adding products.");
      return;
    }

    try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadProductImage(image);
      }

      const { error } = await createProduct({
        farmer_id: formData.farmer_id || user.id,
        ...formData,
        image: imageUrl,
      });

      if (error) throw error;

      toast.success("Product added successfully");

      setFormData({
        category_id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        state: "",
        city: "",
      });

      setImage(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container-width py-12">
      <h1 className="mb-8 text-3xl font-bold">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-8 shadow"
      >
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        {profile?.role === "admin" && (
          <select
            name="farmer_id"
            value={formData.farmer_id}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select Farmer</option>
            {farmersList.map((f) => (
              <option key={f.id} value={f.id}>
                {f.farm_name || f.full_name || f.email}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-white"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;