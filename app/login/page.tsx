"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Login successful!");

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Digital Heroes
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-3 text-zinc-500">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8">

          {/* Email */}
          <label className="block text-sm font-medium text-zinc-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-black"
          />

          {/* Password */}
          <label className="mt-5 block text-sm font-medium text-zinc-700">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-black"
          />

          {/* Message */}
          {message && (
            <p className="mt-4 rounded-lg bg-zinc-100 p-3 text-sm text-zinc-700">
              {message}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Use the email and password of a user created in Supabase Authentication.
        </p>

      </div>
    </main>
  );
}