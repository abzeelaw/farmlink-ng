import { supabase } from "../lib/supabase";

export const getFarmerDashboardStats = async (farmerId) => {
  // Get all order items belonging to this farmer's products
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      subtotal,
      product_id,
      products!inner (
        farmer_id
      ),
      orders!inner (
        id,
        payment_status,
        order_status
      )
    `)
    .eq("products.farmer_id", farmerId);

  if (error) {
    throw error;
  }

  const items = data || [];

  // Only count successfully paid orders
  const paidItems = items.filter(
    (item) => item.orders?.payment_status === "paid"
  );

  const totalSales = paidItems.reduce(
    (sum, item) => sum + Number(item.subtotal || 0),
    0
  );

  const productsSold = paidItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const orderIds = [
    ...new Set(
      paidItems
        .map((item) => item.orders?.id)
        .filter(Boolean)
    ),
  ];

  const pendingOrderIds = [
    ...new Set(
      paidItems
        .filter(
          (item) =>
            !item.orders?.order_status ||
            item.orders.order_status === "pending"
        )
        .map((item) => item.orders?.id)
        .filter(Boolean)
    ),
  ];

  return {
    totalSales,
    totalOrders: orderIds.length,
    productsSold,
    pendingOrders: pendingOrderIds.length,
  };
};

export const getRecentFarmerOrders = async (farmerId) => {
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      subtotal,
      product_id,
      products!inner (
        id,
        name,
        farmer_id
      ),
      orders!inner (
        id,
        buyer_id,
        total_amount,
        payment_status,
        order_status,
        delivery_state,
        delivery_city,
        created_at
      )
    `)
    .eq("products.farmer_id", farmerId)
    .order("created_at", {
      foreignTable: "orders",
      ascending: false,
    })
    .limit(5);

  if (error) {
    throw error;
  }

  return data || [];
};