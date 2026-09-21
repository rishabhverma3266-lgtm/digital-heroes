"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type UrlHistory = {
  id: number;
  url: string;
  result: string | null;
  created_at: string;
};

type GolfScore = {
  id: number;
  player_name: string;
  score: number;
  format: string;
  created_at: string;
};

export default function Home() {
  const [history, setHistory] = useState<UrlHistory[]>([]);
  const [scores, setScores] = useState<GolfScore[]>([]);

  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState("");

  const [subscriptionName, setSubscriptionName] = useState("");
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Monthly");

  const [loading, setLoading] = useState(true);
  const [savingScore, setSavingScore] = useState(false);
  const [savingSubscription, setSavingSubscription] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();

    const { data: urlData, error: urlError } = await supabase
      .from("url_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (urlError) {
      console.error("URL history error:", urlError);
    }

    const { data: scoreData, error: scoreError } = await supabase
      .from("golf_scores")
      .select("*")
      .order("created_at", { ascending: false });

    if (scoreError) {
      console.error("Golf scores error:", scoreError);
    }

    setHistory(urlData || []);
    setScores(scoreData || []);
    setLoading(false);
  }

  async function addScore() {
    if (!playerName.trim() || !score) {
      alert("Please enter player name and score.");
      return;
    }

    setSavingScore(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("golf_scores")
      .insert({
        player_name: playerName.trim(),
        score: Number(score),
        format: "Stableford",
      });

    if (error) {
      console.error("Score save error:", error);
      alert("Score save nahi hua.");
    } else {
      alert("Golf score saved successfully!");

      setPlayerName("");
      setScore("");

      await loadData();
    }

    setSavingScore(false);
  }

  async function subscribe() {
    if (!subscriptionName.trim() || !subscriptionEmail.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    if (!subscriptionEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setSavingSubscription(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("subscriptions")
      .insert({
        full_name: subscriptionName.trim(),
        email: subscriptionEmail.trim(),
        plan: selectedPlan,
        status: "active",
      });

    if (error) {
      console.error("Subscription error:", error);
      alert("Subscription save nahi hua. Please try again.");
      setSavingSubscription(false);
      return;
    }

    alert("Subscription successful!");

    // Dashboard par automatically bhejo
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">

      {/* ================= NAVBAR ================= */}

      <nav className="flex items-center justify-between border-b px-8 py-6">

        <h1 className="text-2xl font-bold">
          Digital Heroes
        </h1>

        <div className="flex items-center gap-6">

          <a
            href="#plans"
            className="text-sm hover:underline"
          >
            Plans
          </a>

          <a
            href="#charity"
            className="text-sm hover:underline"
          >
            Charity
          </a>

          <a
            href="#how-it-works"
            className="text-sm hover:underline"
          >
            How It Works
          </a>

          <a
            href="/dashboard"
            className="rounded-full bg-black px-5 py-2 text-sm text-white"
          >
            Dashboard
          </a>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="px-8 py-24 text-center">

        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Play. Win. Give Back.
        </p>

        <h2 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-zinc-900">
          Your Golf Performance Can Make an Impact.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
          Track your golf scores, participate in monthly prize
          draws, and support a charity of your choice.
        </p>

        <a
          href="#plans"
          className="mt-8 inline-block rounded-full bg-black px-8 py-4 font-semibold text-white"
        >
          Subscribe Now
        </a>

      </section>


      {/* ================= SUBSCRIPTION PLANS ================= */}

      <section
        id="plans"
        className="bg-zinc-100 px-8 py-20"
      >

        <h2 className="text-center text-3xl font-bold text-zinc-900">
          Choose Your Plan
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
          Choose a subscription plan and become part of Digital Heroes.
        </p>


        {/* Plans */}

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">

          {/* Monthly */}

          <button
            type="button"
            onClick={() => setSelectedPlan("Monthly")}
            className={`rounded-2xl border-2 bg-white p-8 text-left transition ${
              selectedPlan === "Monthly"
                ? "border-black"
                : "border-transparent"
            }`}
          >

            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Monthly
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              Monthly Plan
            </h3>

            <p className="mt-3 text-zinc-600">
              Flexible monthly subscription.
            </p>

            <p className="mt-6 font-semibold">
              Selected: {selectedPlan === "Monthly" ? "Yes" : "No"}
            </p>

          </button>


          {/* Yearly */}

          <button
            type="button"
            onClick={() => setSelectedPlan("Yearly")}
            className={`rounded-2xl border-2 bg-white p-8 text-left transition ${
              selectedPlan === "Yearly"
                ? "border-black"
                : "border-transparent"
            }`}
          >

            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Yearly
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              Yearly Plan
            </h3>

            <p className="mt-3 text-zinc-600">
              Convenient yearly subscription.
            </p>

            <p className="mt-6 font-semibold">
              Selected: {selectedPlan === "Yearly" ? "Yes" : "No"}
            </p>

          </button>

        </div>


        {/* Subscription Form */}

        <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-8 shadow-sm">

          <h3 className="text-2xl font-bold">
            Complete Your Subscription
          </h3>

          <label className="mt-6 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={subscriptionName}
            onChange={(e) =>
              setSubscriptionName(e.target.value)
            }
            placeholder="Enter your name"
            className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
          />


          <label className="mt-5 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={subscriptionEmail}
            onChange={(e) =>
              setSubscriptionEmail(e.target.value)
            }
            placeholder="Enter your email"
            className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
          />


          <div className="mt-5 rounded-lg bg-zinc-100 p-4">

            <p className="text-sm text-zinc-500">
              Selected Plan
            </p>

            <p className="mt-1 font-bold">
              {selectedPlan}
            </p>

          </div>


          <button
            type="button"
            onClick={subscribe}
            disabled={savingSubscription}
            className="mt-6 w-full rounded-full bg-black px-6 py-4 font-semibold text-white disabled:opacity-50"
          >
            {savingSubscription
              ? "Saving..."
              : "Continue Subscription"}
          </button>

        </div>

      </section>


      {/* ================= GOLF SCORE ================= */}

      <section className="bg-white px-8 py-20">

        <h2 className="text-center text-3xl font-bold">
          Enter Your Golf Score
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
          Add your latest Stableford score and keep track of your performance.
        </p>


        <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-zinc-100 p-8">

          <label className="block text-sm font-medium">
            Player Name
          </label>

          <input
            type="text"
            value={playerName}
            onChange={(e) =>
              setPlayerName(e.target.value)
            }
            placeholder="Enter your name"
            className="mt-2 w-full rounded-lg border bg-white px-4 py-3 outline-none"
          />


          <label className="mt-5 block text-sm font-medium">
            Stableford Score
          </label>

          <input
            type="number"
            value={score}
            onChange={(e) =>
              setScore(e.target.value)
            }
            placeholder="Enter score"
            className="mt-2 w-full rounded-lg border bg-white px-4 py-3 outline-none"
          />


          <button
            type="button"
            onClick={addScore}
            disabled={savingScore}
            className="mt-6 w-full rounded-full bg-black px-6 py-4 font-semibold text-white disabled:opacity-50"
          >
            {savingScore ? "Saving..." : "Add Score"}
          </button>

        </div>

      </section>


      {/* ================= RECENT GOLF SCORES ================= */}

      <section className="px-8 py-20">

        <h2 className="text-center text-3xl font-bold">
          Recent Golf Scores
        </h2>

        <div className="mx-auto mt-10 max-w-4xl">

          {scores.length === 0 ? (

            <p className="text-center text-zinc-600">
              No golf scores yet.
            </p>

          ) : (

            <div className="overflow-hidden rounded-2xl bg-zinc-100">

              {scores.slice(0, 10).map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between border-b bg-white p-5 last:border-b-0"
                >

                  <div>

                    <p className="font-semibold">
                      {item.player_name}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {item.format}
                    </p>

                  </div>


                  <div className="text-right">

                    <p className="text-xl font-bold">
                      {item.score}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* ================= URL HISTORY ================= */}

      <section className="bg-zinc-100 px-8 py-20">

        <h2 className="text-center text-3xl font-bold">
          Recent URL History
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
          Previously checked URLs are stored here for reference.
        </p>


        <div className="mx-auto mt-10 max-w-4xl">

          {loading ? (

            <p className="text-center text-zinc-600">
              Loading history...
            </p>

          ) : history.length === 0 ? (

            <p className="text-center text-zinc-600">
              No URL history found.
            </p>

          ) : (

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

              {history.slice(0, 10).map((item) => (

                <div
                  key={item.id}
                  className="border-b p-5 last:border-b-0"
                >

                  <p className="break-all font-medium">
                    {item.url}
                  </p>

                  <div className="mt-2 flex flex-col gap-1 text-sm text-zinc-500 md:flex-row md:justify-between">

                    <span>
                      {item.result || "Result not available"}
                    </span>

                    <span>
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="bg-white px-8 py-20"
      >

        <h2 className="text-center text-3xl font-bold">
          How It Works
        </h2>


        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-zinc-100 p-6">

            <h3 className="text-xl font-semibold">
              1. Subscribe
            </h3>

            <p className="mt-3 text-zinc-600">
              Choose a monthly or yearly subscription.
            </p>

          </div>


          <div className="rounded-2xl bg-zinc-100 p-6">

            <h3 className="text-xl font-semibold">
              2. Enter Scores
            </h3>

            <p className="mt-3 text-zinc-600">
              Add your latest golf scores in Stableford format.
            </p>

          </div>


          <div className="rounded-2xl bg-zinc-100 p-6">

            <h3 className="text-xl font-semibold">
              3. Win & Give
            </h3>

            <p className="mt-3 text-zinc-600">
              Take part in monthly draws while supporting charity.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CHARITY ================= */}

      <section
        id="charity"
        className="px-8 py-20 text-center"
      >

        <h2 className="text-3xl font-bold">
          Give Back Through Your Subscription
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-zinc-600">
          Choose a charity you care about and direct part of your
          subscription towards its cause.
        </p>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t px-8 py-8 text-center text-sm text-zinc-500">
        © 2026 Digital Heroes
      </footer>

    </main>
  );
}