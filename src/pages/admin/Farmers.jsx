
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  MapPin,
  User,
  XCircle,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPendingFarmers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          phone,
          role,
          avatar_url,
          farm_name,
          farm_description,
          state,
          city,
          farm_image,
          verification_status,
          rating,
          total_sales,
          created_at
        `)
        .eq("role", "farmer")
        .eq("verification_status", "pending")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setFarmers(data || []);
    } catch (error) {
      console.error(
        "FETCH PENDING FARMERS ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load pending farmers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchPendingFarmers();
    };

    run();
  }, []);

  const updateVerificationStatus = async (
    farmerId,
    status
  ) => {
    try {
      setUpdatingId(farmerId);

      const { error } = await supabase
        .from("profiles")
        .update({
          verification_status: status,
        })
        .eq("id", farmerId)
        .eq("role", "farmer");

      if (error) {
        throw error;
      }

      toast.success(
        status === "verified"
          ? "Farmer verified successfully."
          : "Farmer rejected."
      );

      // Remove the farmer from pending list
      setFarmers((previousFarmers) =>
        previousFarmers.filter(
          (farmer) => farmer.id !== farmerId
        )
      );
    } catch (error) {
      console.error(
        "UPDATE FARMER STATUS ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Unable to update farmer status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container-width py-12">
        <div className="animate-pulse">
          <div className="mb-8 h-10 w-64 rounded bg-slate-200" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-width py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <BadgeCheck
            size={32}
            className="text-emerald-600"
          />

          <h1 className="text-3xl font-bold text-slate-900">
            Farmer Verification
          </h1>
        </div>

        <p className="mt-2 text-slate-500">
          Review and verify farmers before they appear
          as trusted farmers on FarmLink.
        </p>
      </div>

      {/* Empty State */}
      {farmers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <BadgeCheck
            size={48}
            className="mx-auto mb-4 text-emerald-500"
          />

          <h2 className="text-xl font-bold text-slate-900">
            No pending farmers
          </h2>

          <p className="mt-2 text-slate-500">
            All farmer applications have been reviewed.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Farm Image */}
              <div className="h-56 bg-slate-100">
                {farmer.farm_image ? (
                  <img
                    src={farmer.farm_image}
                    alt={
                      farmer.farm_name ||
                      "Farm"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User
                      size={64}
                      className="text-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    Pending Verification
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {farmer.farm_name ||
                    "Unnamed Farm"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {farmer.full_name}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={16} />

                  <span>
                    {farmer.city || "Unknown City"},{" "}
                    {farmer.state || "Unknown State"}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {farmer.farm_description ||
                    "No farm description provided."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Rating
                    </p>

                    <p className="font-semibold text-slate-900">
                      {farmer.rating || "0.00"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Total Sales
                    </p>

                    <p className="font-semibold text-slate-900">
                      {farmer.total_sales || 0}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={
                      updatingId === farmer.id
                    }
                    onClick={() =>
                      updateVerificationStatus(
                        farmer.id,
                        "verified"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <BadgeCheck size={18} />

                    {updatingId === farmer.id
                      ? "Updating..."
                      : "Verify"}
                  </button>

                  <button
                    type="button"
                    disabled={
                      updatingId === farmer.id
                    }
                    onClick={() =>
                      updateVerificationStatus(
                        farmer.id,
                        "rejected"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle size={18} />

                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Farmers;
