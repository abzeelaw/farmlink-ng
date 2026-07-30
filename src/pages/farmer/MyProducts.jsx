import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit,
  Trash2,
  Plus,
  Minus,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const MyProducts = () => {
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [savingStockId, setSavingStockId] = useState(null);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("farmer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load your products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchProducts();
    }
  }, [user, authLoading]);

  // --------------------------------
  // DELETE PRODUCT
  // --------------------------------

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id)
        .eq("farmer_id", user.id);

      if (error) throw error;

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(
        error.message || "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------
  // CHANGE STOCK LOCALLY
  // --------------------------------

  const changeStock = (productId, amount) => {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        const currentStock = Number(product.stock) || 0;

        const newStock = Math.max(
          0,
          currentStock + amount
        );

        return {
          ...product,
          stock: newStock,
        };
      })
    );
  };

  // --------------------------------
  // SAVE STOCK
  // --------------------------------

  const handleSaveStock = async (product) => {
    try {
      setSavingStockId(product.id);

      const { data, error } = await supabase
        .from("products")
        .update({
          stock: Number(product.stock),
        })
        .eq("id", product.id)
        .eq("farmer_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? data : item
        )
      );

      toast.success("Stock updated successfully.");
    } catch (error) {
      console.error("Update stock error:", error);

      toast.error(
        error.message || "Failed to update stock."
      );

      // Reload the original database values
      fetchProducts();
    } finally {
      setSavingStockId(null);
    }
  };

  // --------------------------------
  // LOADING
  // --------------------------------

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

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">

        {/* Header */}

        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              My Products
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your products, stock and listings.
            </p>
          </div>

          <Link
            to="/farmer/add-product"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>

        {/* Empty State */}

        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <Package
              size={48}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No products yet
            </h2>

            <p className="mt-2 text-slate-500">
              Start selling by adding your first farm product.
            </p>

            <Link
              to="/farmer/add-product"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={20} />
              Add Your First Product
            </Link>

          </div>
        ) : (

          /* Product Grid */

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {products.map((product) => (

              <div
                key={product.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md"
              >

                {/* Image */}

                <div className="relative">

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-slate-100">
                      <Package
                        size={50}
                        className="text-slate-400"
                      />
                    </div>
                  )}

                  {/* Stock Badge */}

                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                      Number(product.stock) > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Number(product.stock) > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>

                </div>

                {/* Content */}

                <div className="p-6">

                  <h2 className="text-xl font-bold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {product.description}
                  </p>

                  {/* Price */}

                  <div className="mt-5 flex items-center justify-between">

                    <span className="text-2xl font-bold text-emerald-600">
                      ₦{Number(product.price).toLocaleString()}
                    </span>

                    <span className="text-sm text-slate-500">
                      {product.city}, {product.state}
                    </span>

                  </div>

                {/* Stock Management */}
<div className="mt-6 rounded-2xl bg-slate-50 p-4">
  <p className="mb-3 text-sm font-semibold text-slate-700">
    Manage Stock
  </p>

  <div className="flex items-center gap-3">
    {/* Minus */}
    <button
      type="button"
      onClick={() => changeStock(product.id, -1)}
      disabled={Number(product.stock) <= 0}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white transition hover:border-red-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Minus size={18} />
    </button>

    {/* Stock Input */}
    <input
      type="number"
      min="0"
      value={product.stock ?? 0}
      onChange={(e) => {
        const value = Math.max(
          0,
          Number(e.target.value) || 0
        );

        setProducts((current) =>
          current.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  stock: value,
                }
              : item
          )
        );
      }}
      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-center text-lg font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
    />

    {/* Plus */}
    <button
      type="button"
      onClick={() => changeStock(product.id, 1)}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white transition hover:border-emerald-500 hover:text-emerald-600"
    >
      <Plus size={18} />
    </button>
  </div>

  <p className="mt-2 text-center text-xs text-slate-500">
    Enter the quantity available
  </p>

  {/* Save */}
  <button
    type="button"
    onClick={() => handleSaveStock(product)}
    disabled={savingStockId === product.id}
    className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {savingStockId === product.id
      ? "Saving..."
      : "Save Stock"}
  </button>
</div>

                  {/* Actions */}

                  <div className="mt-5 flex gap-3">

                    {/* Edit */}

                    <Link
                      to={`/farmer/products/edit/${product.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-600"
                    >
                      <Edit size={18} />
                      Edit
                    </Link>

                    {/* Delete */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(product)
                      }
                      disabled={
                        deletingId === product.id
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={18} />

                      {deletingId === product.id
                        ? "Deleting..."
                        : "Delete"}
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