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
      const verification_status = role === "farmer" ? "pending" : "verified";

      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: userId,
          full_name: fullName,
          phone,
          role,
          verification_status,
        },
        { returning: "minimal" }
      );

      // Try to immediately sign the user in (so farmers can access their dashboard/profile to update details)
      const signInResult = await supabase.auth.signInWithPassword({ email, password });

      return { data, error, upsertError, signInResult };
    }
  } catch (e) {
    console.error("Post-signup profile upsert error:", e.message || e);
    return { data, error, upsertError: e };
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