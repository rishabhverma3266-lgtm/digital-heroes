"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TestSupabase() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  async function saveUrl() {
    if (!url) {
      setMessage("Please enter a URL");
      return;
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("url_history")
      .insert({
        url: url,
      });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("URL saved successfully!");
      setUrl("");
    }
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>URL History Test</h1>

      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
        }}
      />

      <button onClick={saveUrl}>
        Save URL
      </button>

      <p>{message}</p>
    </main>
  );
}