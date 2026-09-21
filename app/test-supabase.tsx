"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

export default function TestSupabase() {
  const [message, setMessage] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const supabase = createClient();

      const { error } = await supabase
        .from("url_history")
        .select("id")
        .limit(1);

      if (error) {
        setMessage("Connection error: " + error.message);
      } else {
        setMessage("Supabase connected successfully! ✅");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </main>
  );
}