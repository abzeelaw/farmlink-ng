-- RPC: propagate_farmer_order_status
-- Run this in Supabase SQL editor (SQL) to create the function and grant execute to authenticated role.

create or replace function public.propagate_farmer_order_status(
  p_order_id uuid,
  p_new_status text,
  p_farmer_id uuid
) returns void language plpgsql security definer as $$
declare
  cnt int;
begin
  -- verify that the given farmer has at least one farmer_orders row for this order
  select count(*) into cnt
  from public.farmer_orders
  where order_id = p_order_id and farmer_id = p_farmer_id;

  if cnt = 0 then
    raise exception 'permission denied: farmer not associated with order';
  end if;

  -- perform the update on the master orders table
  update public.orders
  set order_status = p_new_status
  where id = p_order_id;
end;
$$;

-- Grant execute to authenticated role
grant execute on function public.propagate_farmer_order_status(uuid, text, uuid) to authenticated;
