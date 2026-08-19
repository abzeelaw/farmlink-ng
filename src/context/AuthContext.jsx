
/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
    Load authenticated user and profile
  */
  const loadUser = async (session) => {
    if (!session?.user) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    setUser(session.user);

    console.debug('Auth: loading profile for user id', session.user.id);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error(
        "Failed to load user profile:",
        error
      );

      setProfile(null);
      try { if (process.env.NODE_ENV !== 'production') window.currentProfile = null; } catch(e){}
    } else {
      console.debug('Auth: loaded profile', data);
      setProfile(data);
      try { if (process.env.NODE_ENV !== 'production') window.currentProfile = data; } catch(e){}
    }

    setLoading(false);
  };

  /*
    Logout
  */
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setProfile(null);
  };

  /*
    Initialize authentication
  */
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        await loadUser(session);
      }
    };

    initializeAuth();

    /*
      Listen for login/logout/session changes
    */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          await loadUser(session);
        }
      }
    );

    // expose a helper to force-refresh the profile (useful after server-side role changes)
    // Call in browser console: await window.refreshAuthProfile()
    window.refreshAuthProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        await loadUser(session);
        console.debug("Auth: profile refreshed via window.refreshAuthProfile");
      }
    };

    // DEV: expose supabase client and last loaded profile on window for easier debugging in browser console
    // These are removed on unmount.
    try {
      // attach only in development
      if (process.env.NODE_ENV !== 'production') {
        window.supabase = supabase;
        window.currentProfile = null;
      }
    } catch (e) {}

    return () => {
      mounted = false;
      subscription.unsubscribe();
      try {
        delete window.refreshAuthProfile;
        if (process.env.NODE_ENV !== 'production') {
          delete window.supabase;
          delete window.currentProfile;
        }
      } catch (e) {}
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider."
    );
  }

  return context;
};
