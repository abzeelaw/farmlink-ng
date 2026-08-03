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
   GET FARMER ORDERS - BASE DATA
   ---------------------------------------------------------
   This is the main function used by both:
   - Farmer Dashboard
   - Farmer Orders
========================================================= */

export const getFarmerOrdersData = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  /* -------------------------------------------------------
     1. GET FARMER ORDERS
  ------------------------------------------------------- */

  const {
    data: farmerOrders,
    error: farmerOrdersError,
  } = await supabase
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
      created_at
    `)
    .eq("farmer_id", farmerId)
    .order("created_at", {
      ascending: false,
    });

  if (farmerOrdersError) {
    throw farmerOrdersError;
  }

  if (!farmerOrders || farmerOrders.length === 0) {
    return [];
  }

  /* -------------------------------------------------------
     2. GET MASTER ORDERS
  ------------------------------------------------------- */

  const orderIds = [
    ...new Set(
      farmerOrders.map(
        (farmerOrder) => farmerOrder.order_id
      )
    ),
  ];

  const {
    data: orders,
    error: ordersError,
  } = await supabase
    .from("orders")
    .select(`
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
    `)
    .in("id", orderIds);

  if (ordersError) {
    throw ordersError;
  }

  /* -------------------------------------------------------
     3. GET ORDER ITEMS
  ------------------------------------------------------- */

  const {
    data: orderItems,
    error: orderItemsError,
  } = await supabase
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
        description,
        image,
        price,
        farmer_id
      )
    `)
    .in("order_id", orderIds);

  if (orderItemsError) {
    throw orderItemsError;
  }

  /* -------------------------------------------------------
     4. CREATE LOOKUP MAP FOR ORDERS
  ------------------------------------------------------- */

  const orderMap = new Map();

  (orders || []).forEach((order) => {
    orderMap.set(order.id, order);
  });

  /* -------------------------------------------------------
     5. GROUP PRODUCTS BY FARMER ORDER
  ------------------------------------------------------- */

  const result = farmerOrders.map((farmerOrder) => {
    const order = orderMap.get(
      farmerOrder.order_id
    );

    const farmerItems = (orderItems || []).filter(
      (item) =>
        item.order_id === farmerOrder.order_id &&
        item.products?.farmer_id === farmerId
    );

    return {
      /* Farmer order information */
      id: farmerOrder.id,
      farmer_order_id: farmerOrder.id,
      order_id: farmerOrder.order_id,
      farmer_id: farmerOrder.farmer_id,

      subtotal: farmerOrder.subtotal,
      platform_fee: farmerOrder.platform_fee,
      farmer_amount: farmerOrder.farmer_amount,

      status:
        farmerOrder.status || "pending",

      payout_status:
        farmerOrder.payout_status || "pending",

      created_at: farmerOrder.created_at,

      /* Master order information */
      order: order || null,

      buyer_id: order?.buyer_id || null,
      total_amount: order?.total_amount || 0,
      payment_reference:
        order?.payment_reference || null,

      payment_status:
        order?.payment_status || "pending",

      order_status:
        order?.order_status || "pending",

      delivery_address:
        order?.delivery_address || "",

      delivery_state:
        order?.delivery_state || "",

      delivery_city:
        order?.delivery_city || "",

      phone:
        order?.phone || "",

      notes:
        order?.notes || null,

      /* Farmer's products in this order */
      items: farmerItems,
    };
  });

  return result;
};


/* =========================================================
   GET FARMER DASHBOARD STATS
========================================================= */

export const getFarmerDashboardStats = async (
  farmerId
) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const orders =
    await getFarmerOrdersData(farmerId);

  /* -------------------------------------------------------
     Only paid orders count toward sales.
  ------------------------------------------------------- */

  const paidOrders = orders.filter(
    (order) =>
      order.payment_status === "paid"
  );

  /* -------------------------------------------------------
     TOTAL SALES
  ------------------------------------------------------- */

  const totalSales = paidOrders.reduce(
    (sum, order) =>
      sum +
      Number(
        order.farmer_amount || 0
      ),
    0
  );

  /* -------------------------------------------------------
     TOTAL ORDERS

     Count farmer_orders, not individual products.
  ------------------------------------------------------- */

  const totalOrders = paidOrders.length;

  /* -------------------------------------------------------
     PRODUCTS SOLD

     Sum quantities from this farmer's products only.
  ------------------------------------------------------- */

  const productsSold = paidOrders.reduce(
    (total, order) => {
      const quantity = order.items.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity || 0),
        0
      );

      return total + quantity;
    },
    0
  );

  /* -------------------------------------------------------
     PENDING ORDERS
  ------------------------------------------------------- */

  const pendingOrders = orders.filter(
    (order) =>
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

export const getFarmerProductsSold = async (
  farmerId
) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const orders =
    await getFarmerOrdersData(farmerId);

  const paidOrders = orders.filter(
    (order) =>
      order.payment_status === "paid"
  );

  return paidOrders.reduce(
    (total, order) => {
      const quantity = order.items.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity || 0),
        0
      );

      return total + quantity;
    },
    0
  );
};


/* =========================================================
   GET RECENT FARMER ORDERS
========================================================= */

export const getRecentFarmerOrders = async (
  farmerId
) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const orders =
    await getFarmerOrdersData(farmerId);

  return orders.slice(0, 5);
};


/* =========================================================
   GET ALL FARMER ORDERS
========================================================= */

export const getAllFarmerOrders = async (
  farmerId
) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  return await getFarmerOrdersData(
    farmerId
  );
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

  const orders =
    await getFarmerOrdersData(farmerId);

  const order = orders.find(
    (item) =>
      item.farmer_order_id ===
      farmerOrderId
  );

  if (!order) {
    throw new Error(
      "Farmer order not found."
    );
  }

  return order;
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
    "ready",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      `Invalid order status: ${status}`
    );
  }

  const {
    data,
    error,
  } = await supabase
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

  const {
    data,
    error,
  } = await supabase
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

export const getFarmerProducts = async (
  farmerId
) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const {
    data,
    error,
  } = await supabase
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

export const getFarmerEarnings = async (
  farmerId
) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  const {
    data,
    error,
  } = await supabase
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
      sum +
      Number(order.subtotal || 0),
    0
  );

  const totalPlatformFees =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.platform_fee || 0
        ),
      0
    );

  const totalEarnings =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.farmer_amount || 0
        ),
      0
    );

  const paidOut = orders
    .filter(
      (order) =>
        order.payout_status === "paid"
    )
    .reduce(
      (sum, order) =>
        sum +
        Number(
          order.farmer_amount || 0
        ),
      0
    );

  const pendingPayout = orders
    .filter(
      (order) =>
        order.payout_status === "pending"
    )
    .reduce(
      (sum, order) =>
        sum +
        Number(
          order.farmer_amount || 0
        ),
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