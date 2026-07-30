
import { supabase } from "../lib/supabase";

/* =========================================================
   GET FARMER PROFILE
========================================================= */

export const getFarmerProfile = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      state,
      city,
      avatar_url
    `)
    .eq("id", farmerId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================================
   GET FARMER DASHBOARD STATS
========================================================= */

export const getFarmerDashboardStats = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const { data, error } = await supabase
    .from("farmer_orders")
    .select(`
      id,
      subtotal,
      platform_fee,
      farmer_amount,
      status,
      payout_status,
      order_id,
      orders!inner (
        id,
        payment_status,
        created_at
      )
    `)
    .eq("farmer_id", farmerId)
    .eq("orders.payment_status", "paid");

  if (error) {
    throw error;
  }

  const orders = data || [];

  const totalSales = orders.reduce(
    (sum, order) =>
      sum + Number(order.farmer_amount || 0),
    0
  );

  const totalOrders = orders.length;

  /*
    Get the actual number of products/units sold
    for this farmer.
  */
  const orderIds = orders.map(
    (order) => order.order_id
  );

  let productsSold = 0;

  if (orderIds.length > 0) {
    const { data: items, error: itemsError } =
      await supabase
        .from("order_items")
        .select(`
          quantity,
          order_id,
          products!inner (
            farmer_id
          )
        `)
        .in("order_id", orderIds)
        .eq("products.farmer_id", farmerId);

    if (itemsError) {
      throw itemsError;
    }

    productsSold = (items || []).reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );
  }

  const pendingOrders = orders.filter(
    (order) =>
      !order.status ||
      order.status === "pending"
  ).length;

  return {
    totalSales,
    totalOrders,
    productsSold,
    pendingOrders,
  };
};


/* =========================================================
   GET FARMER PRODUCTS SOLD
========================================================= */

export const getFarmerProductsSold = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const { data, error } = await supabase
    .from("order_items")
    .select(`
      quantity,

      products!inner (
        farmer_id
      ),

      orders!inner (
        payment_status
      )
    `)
    .eq("products.farmer_id", farmerId);

  if (error) {
    throw error;
  }

  const paidItems = (data || []).filter(
    (item) =>
      item.orders?.payment_status === "paid"
  );

  return paidItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );
};


/* =========================================================
   GET RECENT FARMER ORDERS
========================================================= */
export const getRecentFarmerOrders = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const { data, error } = await supabase
    .from("farmer_orders")
    .select(`
      id,
      order_id,
      farmer_id,
      subtotal,
      platform_fee,
      farmer_amount,
      status,
      payout_status,
      created_at,

      orders (
        id,
        buyer_id,
        total_amount,
        payment_reference,
        payment_status,
        order_status,
        delivery_address,
        delivery_state,
        delivery_city,
        phone,
        notes,
        created_at
      )
    `)
    .eq("farmer_id", farmerId)
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

  if (error) {
    throw error;
  }

  /*
    Get the products belonging to each farmer order.
  */
  const ordersWithItems = await Promise.all(
    (data || []).map(async (farmerOrder) => {
      const { data: items, error: itemsError } =
        await supabase
          .from("order_items")
          .select(`
            id,
            order_id,
            product_id,
            quantity,
            unit_price,
            subtotal,

            products (
              id,
              name,
              image,
              farmer_id
            )
          `)
          .eq("order_id", farmerOrder.order_id);

      if (itemsError) {
        throw itemsError;
      }

      /*
        IMPORTANT:
        Only return products belonging to this farmer.
      */
      const farmerItems = (items || []).filter(
        (item) =>
          item.products?.farmer_id === farmerId
      );

      return {
        ...farmerOrder,
        items: farmerItems,
      };
    })
  );

  return ordersWithItems;
};

/* =========================================================
   GET ALL FARMER ORDERS
========================================================= */

export const getAllFarmerOrders = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const { data, error } = await supabase
    .from("farmer_orders")
    .select(`
      id,
      order_id,
      farmer_id,
      subtotal,
      platform_fee,
      farmer_amount,
      status,
      payout_status,
      created_at,

      orders!inner (
        id,
        buyer_id,
        total_amount,
        payment_reference,
        payment_status,
        order_status,
        delivery_address,
        delivery_state,
        delivery_city,
        phone,
        notes,
        created_at,

        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          subtotal,

          products (
            id,
            name,
            image,
            farmer_id
          )
        )
      )
    `)
    .eq("farmer_id", farmerId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data || [];
};


/* =========================================================
   GET SINGLE FARMER ORDER
========================================================= */

export const getFarmerOrderById = async (
  farmerOrderId,
  farmerId
) => {
  if (!farmerOrderId || !farmerId) {
    throw new Error(
      "Farmer order ID and farmer ID are required."
    );
  }

  const { data, error } = await supabase
    .from("farmer_orders")
    .select(`
      id,
      order_id,
      farmer_id,
      subtotal,
      platform_fee,
      farmer_amount,
      status,
      payout_status,
      created_at,

      orders!inner (
        id,
        buyer_id,
        total_amount,
        payment_reference,
        payment_status,
        order_status,
        delivery_address,
        delivery_state,
        delivery_city,
        phone,
        notes,
        created_at,

        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          subtotal,

          products (
            id,
            name,
            image,
            farmer_id
          )
        )
      )
    `)
    .eq("id", farmerOrderId)
    .eq("farmer_id", farmerId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================================
   UPDATE FARMER ORDER STATUS
========================================================= */

export const updateFarmerOrderStatus = async (
  farmerOrderId,
  farmerId,
  status
) => {
  if (!farmerOrderId || !farmerId) {
    throw new Error(
      "Farmer order ID and farmer ID are required."
    );
  }

  const allowedStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "completed",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      `Invalid order status: ${status}`
    );
  }

  const { data, error } = await supabase
    .from("farmer_orders")
    .update({
      status,
    })
    .eq("id", farmerOrderId)
    .eq("farmer_id", farmerId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================================
   UPDATE PAYOUT STATUS
========================================================= */

export const updateFarmerPayoutStatus = async (
  farmerOrderId,
  farmerId,
  payoutStatus
) => {
  if (!farmerOrderId || !farmerId) {
    throw new Error(
      "Farmer order ID and farmer ID are required."
    );
  }

  const allowedStatuses = [
    "pending",
    "processing",
    "paid",
    "failed",
  ];

  if (!allowedStatuses.includes(payoutStatus)) {
    throw new Error(
      `Invalid payout status: ${payoutStatus}`
    );
  }

  const { data, error } = await supabase
    .from("farmer_orders")
    .update({
      payout_status: payoutStatus,
    })
    .eq("id", farmerOrderId)
    .eq("farmer_id", farmerId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================================
   GET FARMER PRODUCTS
========================================================= */

export const getFarmerProducts = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

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
      category_id,
      farmer_id,
      created_at,

      categories (
        name
      )
    `)
    .eq("farmer_id", farmerId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data || [];
};


/* =========================================================
   GET FARMER EARNINGS
========================================================= */

export const getFarmerEarnings = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const { data, error } = await supabase
    .from("farmer_orders")
    .select(`
      id,
      subtotal,
      platform_fee,
      farmer_amount,
      payout_status,
      status,
      created_at
    `)
    .eq("farmer_id", farmerId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  const orders = data || [];

  const totalSales = orders.reduce(
    (sum, order) =>
      sum + Number(order.subtotal || 0),
    0
  );

  const totalPlatformFees = orders.reduce(
    (sum, order) =>
      sum + Number(order.platform_fee || 0),
    0
  );

  const totalEarnings = orders.reduce(
    (sum, order) =>
      sum + Number(order.farmer_amount || 0),
    0
  );

  const paidOut = orders
    .filter(
      (order) =>
        order.payout_status === "paid"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.farmer_amount || 0),
      0
    );

  const pendingPayout = orders
    .filter(
      (order) =>
        order.payout_status === "pending"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.farmer_amount || 0),
      0
    );

  return {
    totalSales,
    totalPlatformFees,
    totalEarnings,
    paidOut,
    pendingPayout,
  };
};

