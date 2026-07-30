
import { supabase } from "../lib/supabase";

/* =========================================
   CREATE ORDER
========================================= */

export const createOrder = async ({
  userId,
  totalAmount,
  paymentReference,
  checkoutData,
}) => {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      buyer_id: userId,
      total_amount: totalAmount,
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


/* =========================================
   CREATE ORDER ITEMS
========================================= */

export const createOrderItems = async (
  orderId,
  cartItems
) => {
  const items = cartItems.map((item) => ({
    order_id: orderId,
    product_id: item.id,
    quantity: Number(item.quantity),
    unit_price: Number(item.price),
    subtotal:
      Number(item.price) * Number(item.quantity),
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


/* =========================================
   GET CUSTOMER ORDERS
========================================= */

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


/* =========================================
   GET SINGLE CUSTOMER ORDER
========================================= */

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


/* =========================================
   GET ORDER ITEMS
========================================= */

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


/* =========================================
   GET FARMER ORDERS
   -----------------------------------------
   IMPORTANT:
   Only farmer_orders belonging to the
   logged-in farmer are returned.
========================================= */

export const getFarmerOrders = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required.");
  }

  /*
    First get ONLY this farmer's
    farmer_orders records.
  */

  const { data: farmerOrders, error } =
    await supabase
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
      });

  if (error) {
    throw error;
  }

  if (!farmerOrders || farmerOrders.length === 0) {
    return [];
  }

  /*
    For each farmer order, retrieve ONLY the
    order items whose products belong to this
    farmer.
  */

  const ordersWithItems = await Promise.all(
    farmerOrders.map(async (farmerOrder) => {
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
              farmer_id,
              price
            )
          `)
          .eq("order_id", farmerOrder.order_id);

      if (itemsError) {
        throw itemsError;
      }

      /*
        IMPORTANT:
        Only products belonging to the logged-in
        farmer are allowed into this order.
      */

      const farmerItems = (items || []).filter(
        (item) =>
          item.products?.farmer_id === farmerId
      );

      return {
        ...farmerOrder,

        /*
          Keep the farmer-specific order status.
        */
        status: farmerOrder.status,

        /*
          Only this farmer's products.
        */
        items: farmerItems,
      };
    })
  );

  return ordersWithItems;
};


/* =========================================
   UPDATE FARMER ORDER STATUS
   -----------------------------------------
   Updates ONLY farmer_orders.status.
   Does NOT modify the master orders table.
========================================= */

export const updateOrderStatus = async (
  farmerOrderId,
  status
) => {
  if (!farmerOrderId) {
    throw new Error(
      "Farmer order ID is required."
    );
  }

  if (!status) {
    throw new Error("Order status is required.");
  }

  const allowedStatuses = [
    "pending",
    "processing",
    "ready",
    "shipped",
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
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================
   CREATE PAID ORDER
   -----------------------------------------
   Multi-Farmer Checkout

   The RPC function:
   create_paid_order()

   handles:

   1. Master order
   2. Order items
   3. Stock reduction
   4. Farmer orders
   5. 2% platform commission
========================================= */

export const createPaidOrder = async ({
  userId,
  totalAmount,
  paymentReference,
  checkoutData,
  cartItems,
}) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!cartItems || cartItems.length === 0) {
    throw new Error(
      "Cannot create an order with an empty cart."
    );
  }

  /*
    Convert cart items into the exact structure
    expected by the Supabase RPC function.

    Product IDs MUST be UUIDs.
  */

  const items = cartItems.map((item) => ({
    product_id: item.id,
    quantity: Number(item.quantity),
    unit_price: Number(item.price),
  }));

  const { data, error } = await supabase.rpc(
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