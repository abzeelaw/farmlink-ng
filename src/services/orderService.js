import { supabase } from "../lib/supabase";

/* =========================================================
   CREATE ORDER
========================================================= */

export const createOrder = async ({
  userId,
  totalAmount,
  paymentReference,
  checkoutData,
}) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      buyer_id: userId,
      total_amount: Number(totalAmount),
      payment_reference: paymentReference,
      payment_status: "paid",
      order_status: "pending",
      delivery_address: checkoutData.address,
      delivery_state: checkoutData.state,
      delivery_city: checkoutData.city,
      phone: checkoutData.phone,
      notes: checkoutData.notes || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================================
   CREATE ORDER ITEMS
========================================================= */

export const createOrderItems = async (
  orderId,
  cartItems
) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  if (!cartItems || cartItems.length === 0) {
    throw new Error(
      "Cannot create order items from an empty cart."
    );
  }

  const items = cartItems.map((item) => ({
    order_id: orderId,
    product_id: item.id,
    quantity: Number(item.quantity),
    unit_price: Number(item.price),
    subtotal:
      Number(item.price) *
      Number(item.quantity),
  }));

  const { data, error } = await supabase
    .from("order_items")
    .insert(items)
    .select();

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================================
   GET BUYER ORDERS
========================================================= */

export const getBuyerOrders = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("buyer_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data || [];
};


/* =========================================================
   GET SINGLE ORDER
========================================================= */

export const getOrderById = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================================
   GET ORDER ITEMS
========================================================= */

export const getOrderItems = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const { data, error } = await supabase
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
        farmer_id,
        price
      )
    `)
    .eq("order_id", orderId);

  if (error) {
    throw error;
  }

  return data || [];
};


/* =========================================================
   GET FARMER ORDERS
   ---------------------------------------------------------
   IMPORTANT:
   This function returns a FLAT structure.

   Each returned item contains:

   FARMER ORDER:
   - farmer_order_id
   - farmer_id
   - status
   - farmer_amount
   - platform_fee
   - payout_status

   MASTER ORDER:
   - order_id
   - buyer_id
   - total_amount
   - payment_status
   - order_status
   - delivery_address
   - delivery_state
   - delivery_city
   - phone
   - notes

   PRODUCT:
   - order_item_id
   - product_id
   - quantity
   - unit_price
   - subtotal
   - product_name
   - product_image
   - product_price
========================================================= */

/* =========================================================
   GET FARMER ORDERS
   ---------------------------------------------------------
   Uses separate queries instead of relying on nested
   Supabase relationships.
========================================================= */

export const getFarmerOrders = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  console.log("=================================");
  console.log("GET FARMER ORDERS");
  console.log("FARMER ID:", farmerId);
  console.log("=================================");

  // 1. Test farmer_orders
  const {
    data: farmerOrders,
    error: farmerOrdersError,
  } = await supabase
    .from("farmer_orders")
    .select("*")
    .eq("farmer_id", farmerId)
    .order("created_at", {
      ascending: false,
    });

  console.log("1. farmer_orders DATA:", farmerOrders);
  console.log(
    "1. farmer_orders ERROR:",
    farmerOrdersError
  );

  if (farmerOrdersError) {
    throw farmerOrdersError;
  }

  if (!farmerOrders?.length) {
    console.log("STOP: farmer_orders is empty.");
    return [];
  }

  // 2. Extract order IDs
  const orderIds = [
    ...new Set(
      farmerOrders
        .map((order) => order.order_id)
        .filter(Boolean)
    ),
  ];

  console.log("2. ORDER IDS:", orderIds);

  // 3. Test orders table
  const {
    data: masterOrders,
    error: masterOrdersError,
  } = await supabase
    .from("orders")
    .select("*")
    .in("id", orderIds);

  console.log(
    "3. orders DATA:",
    masterOrders
  );

  console.log(
    "3. orders ERROR:",
    masterOrdersError
  );

  if (masterOrdersError) {
    throw masterOrdersError;
  }

  // 4. Test order_items
  const {
    data: orderItems,
    error: orderItemsError,
  } = await supabase
    .from("order_items")
    .select(`
      *,
      products (
        id,
        name,
        image,
        price,
        farmer_id
      )
    `)
    .in("order_id", orderIds);

  console.log(
    "4. order_items DATA:",
    orderItems
  );

  console.log(
    "4. order_items ERROR:",
    orderItemsError
  );

  if (orderItemsError) {
    throw orderItemsError;
  }

  // 5. Group items by farmer_order so each returned object
  //    represents a single farmer_order containing all products
  //    from the same master order that belong to this farmer.
  const result = farmerOrders.map((farmerOrder) => {
    const master = masterOrders?.find(
      (o) => o.id === farmerOrder.order_id
    );

    const itemsForFarmer = (orderItems || []).filter(
      (item) =>
        item.order_id === farmerOrder.order_id &&
        item.products?.farmer_id === farmerId
    );

    return {
      // Farmer order fields
      id: farmerOrder.id,
      farmer_order_id: farmerOrder.id,
      order_id: farmerOrder.order_id,
      farmer_id: farmerOrder.farmer_id,
      subtotal: farmerOrder.subtotal,
      platform_fee: farmerOrder.platform_fee,
      farmer_amount: farmerOrder.farmer_amount,
      status: farmerOrder.status || "pending",
      payout_status: farmerOrder.payout_status || "pending",
      created_at: farmerOrder.created_at,

      // Master order flattened
      order: master || null,
      buyer_id: master?.buyer_id || null,
      total_amount: master?.total_amount || 0,
      payment_status: master?.payment_status || "pending",
      order_status: master?.order_status || "pending",
      order_created_at: master?.created_at || null,
      delivery_address: master?.delivery_address || "",
      delivery_state: master?.delivery_state || "",
      delivery_city: master?.delivery_city || "",
      phone: master?.phone || "",
      notes: master?.notes || null,

      // Items belonging to this farmer within the master order
      items: itemsForFarmer.map((item) => ({
        order_item_id: item.id,
        order_id: item.order_id,
        product_id: item.product_id || item.products?.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        products: item.products || null,
        product_name: item.products?.name,
        product_image: item.products?.image,
      })),
    };
  });

  console.log("5. GROUPED RESULT:", result);
  console.log("=================================");

  return result;
};


/* =========================================================
   UPDATE FARMER ORDER STATUS

   IMPORTANT:
   This updates farmer_orders.status.

   It does NOT update the master orders.order_status.
========================================================= */

export const updateFarmerOrderStatus = async (
  farmerOrderId,
  farmerId,
  status
) => {
  if (!farmerOrderId) {
    throw new Error(
      "Farmer order ID is required."
    );
  }

  if (!farmerId) {
    throw new Error(
      "Farmer ID is required."
    );
  }

  if (!status) {
    throw new Error(
      "Order status is required."
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
    console.error(
      "UPDATE FARMER ORDER STATUS ERROR:",
      error
    );

    throw error;
  }

  // After updating the farmer_orders row, attempt to
  // update the master orders.order_status so buyers
  // see status changes when appropriate.
  try {
    // Fetch the farmer_order to get the master order_id
    const { data: fo, error: foErr } = await supabase
      .from("farmer_orders")
      .select("order_id")
      .eq("id", farmerOrderId)
      .eq("farmer_id", farmerId)
      .single();

    if (foErr) {
      console.warn("Could not fetch farmer_order for propagation:", foErr);
      return data;
    }

    const orderId = fo?.order_id;

    if (!orderId) return data;

    // Get all farmer_orders for this master order
    const { data: allFO, error: allFOErr } = await supabase
      .from("farmer_orders")
      .select("status")
      .eq("order_id", orderId);

    if (allFOErr) {
      console.warn("Could not fetch related farmer_orders:", allFOErr);
      return data;
    }

    const statuses = (allFO || []).map((r) => r.status || "pending");

    // If every farmer_order is delivered, mark master order as delivered.
    let newMasterStatus = null;

    if (statuses.length > 0 && statuses.every((s) => s === "delivered")) {
      newMasterStatus = "delivered";
    } else if (statuses.some((s) => ["processing", "ready", "shipped", "out_for_delivery"].includes(s))) {
      newMasterStatus = "processing";
    }

    if (newMasterStatus) {
      // Prefer calling a SECURITY DEFINER RPC that safely updates the
      // master order (avoids RLS recursion/policy issues).
      try {
        const { data: rpcData, error: rpcErr } = await supabase.rpc(
          "propagate_farmer_order_status",
          {
            p_order_id: orderId,
            p_new_status: newMasterStatus,
            p_farmer_id: farmerId,
          }
        );

        if (rpcErr) {
          console.warn("Failed to call propagate_farmer_order_status:", rpcErr);
        } else {
          console.log("propagate_farmer_order_status succeeded:", rpcData);
        }
      } catch (rpcCallErr) {
        console.warn("Error calling propagate_farmer_order_status:", rpcCallErr);
      }
    }
  } catch (propErr) {
    console.warn("Error propagating farmer order status:", propErr);
  }

  return data;
};


/* =========================================================
   UPDATE FARMER PAYOUT STATUS
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
   CREATE PAID ORDER
   ---------------------------------------------------------
   Multi-Farmer Checkout

   Uses Supabase RPC:
   create_paid_order
========================================================= */

export const createPaidOrder = async ({
  userId,
  totalAmount,
  paymentReference,
  checkoutData,
  cartItems,
}) => {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  if (
    !cartItems ||
    cartItems.length === 0
  ) {
    throw new Error(
      "Cannot create an order with an empty cart."
    );
  }

  const items = cartItems.map((item) => ({
    product_id: item.id,
    quantity: Number(item.quantity),
    unit_price: Number(item.price),
  }));

  const { data, error } =
    await supabase.rpc(
      "create_paid_order",
      {
        p_buyer_id: userId,

        p_total_amount:
          Number(totalAmount),

        p_payment_reference:
          paymentReference,

        p_delivery_address:
          checkoutData.address,

        p_delivery_state:
          checkoutData.state,

        p_delivery_city:
          checkoutData.city,

        p_phone:
          checkoutData.phone,

        p_notes:
          checkoutData.notes || null,

        p_items: items,
      }
    );

  if (error) {
    console.error(
      "create_paid_order error:",
      error
    );

    throw error;
  }

  return data;
};