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

export const getFarmerOrders = async (
  farmerId
) => {
  if (!farmerId) {
    throw new Error(
      "Farmer ID is required."
    );
  }

  const { data, error } = await supabase
    .from("farmer_orders")
    .select(`
      id,
      order_id,
      farmer_id,
      status,
      farmer_amount,
      platform_fee,
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
        created_at,

        order_items (
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
            price,
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
    console.error(
      "GET FARMER ORDERS ERROR:",
      error
    );

    throw error;
  }

  const flattenedOrders = [];

  /*
    Convert the nested Supabase response
    into a flat structure.
  */

  for (const farmerOrder of data || []) {
    const order = farmerOrder.orders;

    if (!order) {
      continue;
    }

    /*
      Only include products belonging
      to this farmer.
    */

    const farmerItems =
      (order.order_items || []).filter(
        (item) =>
          item.products?.farmer_id ===
          farmerId
      );

    for (const item of farmerItems) {
      flattenedOrders.push({
        /* ================================
           FARMER ORDER
        ================================= */

        farmer_order_id:
          farmerOrder.id,

        farmer_id:
          farmerOrder.farmer_id,

        status:
          farmerOrder.status,

        farmer_amount:
          farmerOrder.farmer_amount,

        platform_fee:
          farmerOrder.platform_fee,

        payout_status:
          farmerOrder.payout_status,

        farmer_order_created_at:
          farmerOrder.created_at,


        /* ================================
           MASTER ORDER
        ================================= */

        order_id:
          order.id,

        buyer_id:
          order.buyer_id,

        total_amount:
          order.total_amount,

        payment_reference:
          order.payment_reference,

        payment_status:
          order.payment_status,

        order_status:
          order.order_status,

        delivery_address:
          order.delivery_address,

        delivery_state:
          order.delivery_state,

        delivery_city:
          order.delivery_city,

        phone:
          order.phone,

        notes:
          order.notes,

        order_created_at:
          order.created_at,


        /* ================================
           ORDER ITEM
        ================================= */

        order_item_id:
          item.id,

        product_id:
          item.product_id,

        quantity:
          item.quantity,

        unit_price:
          item.unit_price,

        subtotal:
          item.subtotal,


        /* ================================
           PRODUCT
        ================================= */

        product_name:
          item.products?.name ||
          "Product",

        product_image:
          item.products?.image ||
          "",

        product_price:
          item.products?.price ||
          0,

        product_farmer_id:
          item.products?.farmer_id,
      });
    }
  }

  console.log(
    "FARMER ORDERS:",
    flattenedOrders
  );

  return flattenedOrders;
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