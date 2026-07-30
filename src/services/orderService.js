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
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity,
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

export const createPaidOrder = async ({
  userId,
  totalAmount,
  paymentReference,
  checkoutData,
  cartItems,
}) => {
  const items = cartItems.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.price,
  }));

  const { data, error } = await supabase.rpc(
    "create_paid_order",
    {
      p_buyer_id: userId,
      p_total_amount: totalAmount,
      p_payment_reference: paymentReference,

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
  JSON.stringify(error, null, 2)
);

    throw error;
  }

  return data;
};

/* =========================================
   GET CUSTOMER ORDERS
========================================= */

export const getBuyerOrders = async (userId) => {
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

  return data;
};


/* =========================================
   GET SINGLE ORDER
========================================= */

export const getOrderById = async (orderId) => {
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
        image
      )
    `)
    .eq("order_id", orderId);

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================
   GET FARMER ORDERS
========================================= */

export const getFarmerOrders = async (farmerId) => {
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
        farmer_id
      ),

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
    .eq("products.farmer_id", farmerId);

  if (error) {
    throw error;
  }

  return data;
};


/* =========================================
   UPDATE ORDER STATUS
========================================= */

export const updateOrderStatus = async (
  orderId,
  status
) => {
  const { data, error } = await supabase
    .from("orders")
    .update({
      order_status: status,
    })
    .eq("id", orderId)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Order was not found or you do not have permission to update it."
    );
  }

  return data[0];
};