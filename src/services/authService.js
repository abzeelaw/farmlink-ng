import { supabase } from "../lib/supabase";

export const signUp = async ({
  fullName,
  email,
  password,
  phone,
  role = "buyer",
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        role,
      },
    },
  });

  return { data, error };
};

export const signIn = async ({ email, password }) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  return { data, error };
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};