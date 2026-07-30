import { useEffect } from "react";
import { supabase } from "../lib/supabase";

const TestSupabase = () => {
  useEffect(() => {
    console.log("Supabase Connected");

    console.log(supabase);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold text-emerald-600">
        Supabase Connected
      </h1>
    </div>
  );
};

export default TestSupabase;