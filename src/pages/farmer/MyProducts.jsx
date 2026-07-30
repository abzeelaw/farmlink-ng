import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, PlusCircle, Package } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const MyProducts = () => {
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          image,
          price,
          stock,
          state,
          city,
          created_at,
          categories (
            name
          )
        `)
        .eq("farmer_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Products error:", error);

      toast.error(
        error.message || "Failed to load your products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    fetchProducts();
  }, [user, authLoading]);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("farmer_id", user.id);

      if (error) throw error;

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(
        error.message || "Failed to delete product."
      );
    }
  };

  if (authLoading || loading) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <p className="text-slate-500">
            Loading your products...
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

          <p className="mt-2 text-slate-500">
            You need to be logged in to manage your products.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              My Products
            </h1>

            <p className="mt-2 text-slate-500">
              Manage the products you have listed on FarmLink.
            </p>
          </div>

          <Link
            to="/farmer/add-product"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <PlusCircle size={20} />
            Add Product
          </Link>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <Package
              size={50}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No products yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              You haven't listed any farm products yet.
              Add your first product to start selling.
            </p>

            <Link
              to="/farmer/add-product"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              <PlusCircle size={20} />
              Add Your First Product
            </Link>

          </div>
        ) : (

          /* Product Grid */
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Image */}
                <div className="relative h-56 bg-slate-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package
                        size={50}
                        className="text-slate-300"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">

                  {/* Category */}
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {product.categories?.name || "Produce"}
                  </span>

                  {/* Name */}
                  <h2 className="mt-4 text-xl font-bold text-slate-900">
                    {product.name}
                  </h2>

                  {/* Location */}
                  <p className="mt-1 text-sm text-slate-500">
                    {product.city}, {product.state}
                  </p>

                  {/* Price */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">
                      ₦{Number(product.price).toLocaleString()}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        Number(product.stock) > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {Number(product.stock) > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">

                    <Link
                      to={`/farmer/products/edit/${product.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
                    >
                      <Edit size={18} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                      className="flex items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default MyProducts;