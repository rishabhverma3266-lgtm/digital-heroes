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

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-zinc-950">

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-lg text-white shadow-lg">
              ⛳
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                Digital Heroes
              </p>

              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:block">
                Play • Win • Give
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            <a
              href="#plans"
              className="text-sm font-medium text-zinc-600 transition hover:text-black"
            >
              Plans
            </a>

            <a
              href="#performance"
              className="text-sm font-medium text-zinc-600 transition hover:text-black"
            >
              Performance
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-zinc-600 transition hover:text-black"
            >
              How It Works
            </a>

            <a
              href="#charity"
              className="text-sm font-medium text-zinc-600 transition hover:text-black"
            >
              Charity
            </a>
          </div>

          <a
            href="/dashboard"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            Dashboard →
          </a>
        </div>
      </nav>


      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative isolate overflow-hidden bg-zinc-950 px-5 py-24 text-white md:px-8 md:py-32">

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Play. Win. Give Back.
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Your Game.
              <br />
              <span className="text-zinc-400">
                Your Impact.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Track your golf performance, join our community,
              participate in monthly prize opportunities and help
              support causes that matter.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

              <a
                href="#plans"
                className="rounded-full bg-white px-7 py-4 text-sm font-bold text-black shadow-xl transition hover:-translate-y-1 hover:bg-zinc-100"
              >
                Explore Membership →
              </a>

              <a
                href="#performance"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Track Your Score
              </a>

            </div>
          </div>


          {/* Hero Stats */}

          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-2xl font-black">
                {scores.length}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Scores Tracked
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-2xl font-black">
                {history.length}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Records Saved
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-2xl font-black">
                2
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Membership Plans
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-2xl font-black">
                100%
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Community Focus
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          INTRO
      ========================================================= */}

      <section className="px-5 py-20 md:px-8 md:py-28">

        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              More than golf
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Turn every round into something meaningful.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600">
              Digital Heroes combines golf performance tracking,
              membership and community impact into one simple platform.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold">
                    Track your progress
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Save your Stableford scores and review recent activity.
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  ★
                </div>

                <div>
                  <h3 className="font-bold">
                    Join the community
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Become part of a growing golf-focused community.
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  ♥
                </div>

                <div>
                  <h3 className="font-bold">
                    Make an impact
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Support charitable causes through your membership.
                  </p>
                </div>
              </div>

            </div>
          </div>


          <div className="relative">

            <div className="rounded-[2rem] bg-zinc-950 p-8 text-white shadow-2xl md:p-10">

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Performance
                  </p>

                  <h3 className="mt-2 text-3xl font-black">
                    Your Golf Journey
                  </h3>
                </div>

                <div className="text-4xl">
                  ⛳
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="text-xs text-zinc-500">
                    Scores
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {scores.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="text-xs text-zinc-500">
                    URLs Saved
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {history.length}
                  </p>
                </div>

              </div>

              <div className="mt-4 rounded-2xl border border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    Latest score
                  </span>

                  <span className="text-xs text-emerald-400">
                    Live data
                  </span>
                </div>

                <p className="mt-2 text-4xl font-black">
                  {scores.length > 0 ? scores[0].score : "--"}
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          PLANS
      ========================================================= */}

      <section
        id="plans"
        className="bg-zinc-100 px-5 py-20 md:px-8 md:py-28"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Membership
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Choose your plan
            </h2>

            <p className="mt-5 text-zinc-600">
              Select the membership that fits your journey.
            </p>

          </div>


          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">

            {/* Monthly */}

            <button
              type="button"
              onClick={() => setSelectedPlan("Monthly")}
              className={`group relative rounded-3xl border-2 bg-white p-8 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                selectedPlan === "Monthly"
                  ? "border-black"
                  : "border-transparent"
              }`}
            >

              {selectedPlan === "Monthly" && (
                <span className="absolute right-6 top-6 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                  Selected
                </span>
              )}

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-xl text-white">
                ◷
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                Flexible
              </p>

              <h3 className="mt-2 text-3xl font-black">
                Monthly
              </h3>

              <p className="mt-4 leading-6 text-zinc-500">
                A flexible membership for players who want
                freedom month by month.
              </p>

              <div className="mt-7 border-t pt-6">

                <p className="text-sm font-bold">
                  ✓ Performance tracking
                </p>

                <p className="mt-3 text-sm font-bold">
                  ✓ Community access
                </p>

                <p className="mt-3 text-sm font-bold">
                  ✓ Charity support
                </p>

              </div>

            </button>


            {/* Yearly */}

            <button
              type="button"
              onClick={() => setSelectedPlan("Yearly")}
              className={`group relative rounded-3xl border-2 bg-zinc-950 p-8 text-left text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                selectedPlan === "Yearly"
                  ? "border-emerald-400"
                  : "border-zinc-800"
              }`}
            >

              <span className="absolute right-6 top-6 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-black">
                Best Value
              </span>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-black">
                ★
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Premium
              </p>

              <h3 className="mt-2 text-3xl font-black">
                Yearly
              </h3>

              <p className="mt-4 leading-6 text-zinc-400">
                Stay connected throughout the year and
                maximize your Digital Heroes experience.
              </p>

              <div className="mt-7 border-t border-white/10 pt-6">

                <p className="text-sm font-bold">
                  ✓ Full performance tracking
                </p>

                <p className="mt-3 text-sm font-bold">
                  ✓ Community access
                </p>

                <p className="mt-3 text-sm font-bold">
                  ✓ Charity support
                </p>

              </div>

            </button>

          </div>


          {/* Subscription Form */}

          <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] bg-white p-7 shadow-xl md:p-10">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Almost there
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Complete your membership
                </h3>
              </div>

              <div className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-bold">
                {selectedPlan} Plan
              </div>

            </div>


            <div className="mt-8">

              <label className="text-sm font-bold">
                Full Name
              </label>

              <input
                type="text"
                value={subscriptionName}
                onChange={(e) =>
                  setSubscriptionName(e.target.value)
                }
                placeholder="Enter your name"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              />


              <label className="mt-5 block text-sm font-bold">
                Email Address
              </label>

              <input
                type="email"
                value={subscriptionEmail}
                onChange={(e) =>
                  setSubscriptionEmail(e.target.value)
                }
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              />


              <button
                type="button"
                onClick={subscribe}
                disabled={savingSubscription}
                className="mt-6 w-full rounded-xl bg-black px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingSubscription
                  ? "Creating Membership..."
                  : `Continue with ${selectedPlan} →`}
              </button>

              <p className="mt-4 text-center text-xs text-zinc-400">
                Your membership details are securely stored.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          PERFORMANCE
      ========================================================= */}

      <section
        id="performance"
        className="px-5 py-20 md:px-8 md:py-28"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Golf Performance
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Keep your game on record.
            </h2>

            <p className="mt-5 text-zinc-600">
              Add your latest Stableford score and build your performance history.
            </p>

          </div>


          {/* Score Form */}

          <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] bg-zinc-950 p-7 text-white shadow-2xl md:p-10">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  New Entry
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Add Golf Score
                </h3>
              </div>

              <div className="text-4xl">
                🏌️
              </div>

            </div>


            <div className="mt-8">

              <label className="text-sm font-semibold text-zinc-300">
                Player Name
              </label>

              <input
                type="text"
                value={playerName}
                onChange={(e) =>
                  setPlayerName(e.target.value)
                }
                placeholder="Enter your name"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />


              <label className="mt-5 block text-sm font-semibold text-zinc-300">
                Stableford Score
              </label>

              <input
                type="number"
                value={score}
                onChange={(e) =>
                  setScore(e.target.value)
                }
                placeholder="e.g. 36"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
              />


              <button
                type="button"
                onClick={addScore}
                disabled={savingScore}
                className="mt-6 w-full rounded-xl bg-white px-6 py-4 font-bold text-black transition hover:-translate-y-0.5 hover:bg-zinc-200 disabled:opacity-50"
              >
                {savingScore ? "Saving Score..." : "Add Score →"}
              </button>

            </div>

          </div>


          {/* Recent Scores */}

          <div className="mt-16">

            <div className="mb-6 flex items-end justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Activity
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  Recent Scores
                </h3>
              </div>

              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-500">
                {scores.length} total
              </span>

            </div>


            {scores.length === 0 ? (

              <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center">
                <div className="text-4xl">
                  ⛳
                </div>

                <p className="mt-4 font-bold">
                  No golf scores yet.
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Add your first score above.
                </p>
              </div>

            ) : (

              <div className="grid gap-4 md:grid-cols-2">

                {scores.slice(0, 10).map((item) => (

                  <div
                    key={item.id}
                    className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 font-bold text-white">
                        {item.score}
                      </div>

                      <div>
                        <p className="font-bold">
                          {item.player_name}
                        </p>

                        <p className="mt-1 text-xs text-zinc-400">
                          {item.format}
                        </p>
                      </div>

                    </div>

                    <p className="text-right text-xs text-zinc-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      </section>


      {/* =========================================================
          URL HISTORY
      ========================================================= */}

      <section className="bg-zinc-100 px-5 py-20 md:px-8 md:py-28">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Saved Activity
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight">
                Recent URL History
              </h2>

              <p className="mt-4 max-w-2xl text-zinc-600">
                Previously checked URLs are stored here for reference.
              </p>

            </div>

            <div className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
              {history.length} records
            </div>

          </div>


          <div className="mt-10">

            {loading ? (

              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
                <p className="font-semibold">
                  Loading history...
                </p>
              </div>

            ) : history.length === 0 ? (

              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
                <div className="text-4xl">
                  🔗
                </div>

                <p className="mt-4 font-bold">
                  No URL history found.
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Checked URLs will appear here.
                </p>
              </div>

            ) : (

              <div className="grid gap-4 md:grid-cols-2">

                {history.slice(0, 10).map((item) => (

                  <div
                    key={item.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">
                        ↗
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.result
                            ?.toLowerCase()
                            .includes("safe")
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {item.result || "Pending"}
                      </span>

                    </div>

                    <p className="mt-5 break-all text-sm font-bold leading-6">
                      {item.url}
                    </p>

                    <p className="mt-3 text-xs text-zinc-400">
                      Checked{" "}
                      {new Date(item.created_at).toLocaleString()}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section
        id="how-it-works"
        className="px-5 py-20 md:px-8 md:py-28"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Simple Process
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              How it works
            </h2>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <div className="group rounded-3xl border border-zinc-200 bg-white p-7 transition hover:-translate-y-2 hover:shadow-2xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black font-black text-white">
                01
              </div>

              <h3 className="mt-7 text-xl font-black">
                Subscribe
              </h3>

              <p className="mt-3 leading-7 text-zinc-500">
                Choose between our monthly and yearly membership plans.
              </p>

            </div>


            <div className="group rounded-3xl border border-zinc-200 bg-white p-7 transition hover:-translate-y-2 hover:shadow-2xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black font-black text-white">
                02
              </div>

              <h3 className="mt-7 text-xl font-black">
                Track Your Game
              </h3>

              <p className="mt-3 leading-7 text-zinc-500">
                Add your Stableford scores and keep your performance history.
              </p>

            </div>


            <div className="group rounded-3xl border border-zinc-200 bg-white p-7 transition hover:-translate-y-2 hover:shadow-2xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black font-black text-white">
                03
              </div>

              <h3 className="mt-7 text-xl font-black">
                Win & Give
              </h3>

              <p className="mt-3 leading-7 text-zinc-500">
                Participate in community opportunities while supporting charity.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CHARITY
      ========================================================= */}

      <section
        id="charity"
        className="relative overflow-hidden bg-zinc-950 px-5 py-24 text-center text-white md:px-8"
      >

        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-black">
            ♥
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
            Give Back
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Your game can create an impact.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-zinc-400">
            Digital Heroes is designed to connect golf,
            community and charitable giving in one experience.
          </p>

          <a
            href="#plans"
            className="mt-9 inline-block rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:-translate-y-1 hover:bg-zinc-200"
          >
            Join Digital Heroes →
          </a>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-zinc-200 bg-white px-5 py-10 md:px-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
                ⛳
              </div>

              <p className="font-black">
                Digital Heroes
              </p>

            </div>

            <p className="mt-3 text-sm text-zinc-400">
              Play. Win. Give Back.
            </p>
          </div>


          <div className="flex flex-wrap gap-5 text-sm font-medium text-zinc-500">

            <a
              href="#plans"
              className="transition hover:text-black"
            >
              Plans
            </a>

            <a
              href="#performance"
              className="transition hover:text-black"
            >
              Performance
            </a>

            <a
              href="#charity"
              className="transition hover:text-black"
            >
              Charity
            </a>

            <a
              href="/dashboard"
              className="transition hover:text-black"
            >
              Dashboard
            </a>

          </div>

        </div>


        <div className="mx-auto mt-8 max-w-7xl border-t border-zinc-100 pt-6 text-xs text-zinc-400">
          © 2026 Digital Heroes. Built for community, performance and impact.
        </div>

      </footer>

    </main>
  );
}