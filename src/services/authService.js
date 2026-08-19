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

  // If user was created, ensure a profile row exists and mark as verified
  try {
    const userId = data?.user?.id;

    if (userId) {
      await supabase.from("profiles").upsert(
        {
          id: userId,
          full_name: fullName,
          phone,
          role,
          verification_status: "verified",
        },
        { returning: "minimal" }
      );

      // Try to immediately sign the user in (if the auth settings allow it)
      await supabase.auth.signInWithPassword({ email, password });
    }
  } catch (e) {
    // ignore profile upsert/signin errors here; caller will handle signUp error
    console.error("Post-signup profile upsert error:", e.message || e);
  }

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