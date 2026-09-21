"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type GolfScore = {
  id: number;
  player_name: string;
  score: number;
  format: string;
  created_at: string;
};

type Subscription = {
  id: number;
  full_name: string;
  email: string;
  plan: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [scores, setScores] = useState<GolfScore[]>([]);
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    const supabase = createClient();

    // Check logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Get golf scores
    const { data: scoreData, error: scoreError } =
      await supabase
        .from("golf_scores")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (scoreError) {
      console.error(
        "Golf scores error:",
        scoreError
      );
    }

    setScores(scoreData || []);

    // Get latest subscription
    const {
      data: subscriptionData,
      error: subscriptionError,
    } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

    if (subscriptionError) {
      console.error(
        "Subscription error:",
        subscriptionError
      );
    }

    setSubscription(
      subscriptionData?.[0] || null
    );

    setLoading(false);
  }

  async function logout() {
    setLoggingOut(true);

    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  const latestScore =
    scores.length > 0
      ? scores[0].score
      : "-";

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10 text-zinc-900 md:px-8">

      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}

        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Digital Heroes
            </p>

            <h1 className="mt-2 text-4xl font-bold text-zinc-900">
              Your Dashboard
            </h1>

            <p className="mt-3 text-zinc-600">
              Manage your subscription and track your golf performance.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="rounded-full bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

        </header>


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <p className="text-zinc-600">
              Loading dashboard...
            </p>

          </div>

        ) : (

          <>

            {/* ================= SUBSCRIPTION ================= */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-bold text-zinc-900">
                Your Subscription
              </h2>

              {subscription ? (

                <div className="mt-6 grid gap-4 md:grid-cols-3">

                  {/* Plan */}

                  <div className="rounded-xl bg-zinc-100 p-5">

                    <p className="text-sm text-zinc-500">
                      Plan
                    </p>

                    <p className="mt-2 text-xl font-bold text-zinc-900">
                      {subscription.plan}
                    </p>

                  </div>


                  {/* Status */}

                  <div className="rounded-xl bg-zinc-100 p-5">

                    <p className="text-sm text-zinc-500">
                      Status
                    </p>

                    <p className="mt-2 text-xl font-bold capitalize text-zinc-900">
                      {subscription.status}
                    </p>

                  </div>


                  {/* Member */}

                  <div className="rounded-xl bg-zinc-100 p-5">

                    <p className="text-sm text-zinc-500">
                      Member
                    </p>

                    <p className="mt-2 text-xl font-bold text-zinc-900">
                      {subscription.full_name}
                    </p>

                  </div>

                </div>

              ) : (

                <div className="mt-6 rounded-xl bg-zinc-100 p-5">

                  <p className="text-zinc-600">
                    No subscription found.
                  </p>

                  <a
                    href="/#plans"
                    className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-sm font-semibold text-white"
                  >
                    Choose a Plan
                  </a>

                </div>

              )}

            </section>


            {/* ================= GOLF PERFORMANCE ================= */}

            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-bold text-zinc-900">
                Golf Performance
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">

                {/* Latest Score */}

                <div className="rounded-xl bg-zinc-100 p-5">

                  <p className="text-sm text-zinc-500">
                    Latest Score
                  </p>

                  <p className="mt-2 text-3xl font-bold text-zinc-900">
                    {latestScore}
                  </p>

                </div>


                {/* Total Scores */}

                <div className="rounded-xl bg-zinc-100 p-5">

                  <p className="text-sm text-zinc-500">
                    Scores Submitted
                  </p>

                  <p className="mt-2 text-3xl font-bold text-zinc-900">
                    {scores.length}
                  </p>

                </div>


                {/* Format */}

                <div className="rounded-xl bg-zinc-100 p-5">

                  <p className="text-sm text-zinc-500">
                    Format
                  </p>

                  <p className="mt-2 text-xl font-bold text-zinc-900">
                    {scores.length > 0
                      ? scores[0].format
                      : "-"}
                  </p>

                </div>

              </div>

            </section>


            {/* ================= RECENT SCORES ================= */}

            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-bold text-zinc-900">
                Recent Golf Scores
              </h2>

              {scores.length === 0 ? (

                <p className="mt-6 text-zinc-600">
                  No golf scores submitted yet.
                </p>

              ) : (

                <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200">

                  {scores
                    .slice(0, 5)
                    .map((item) => (

                      <div
                        key={item.id}
                        className="flex flex-col gap-4 border-b border-zinc-200 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div>

                          <p className="font-semibold text-zinc-900">
                            {item.player_name}
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            {item.format}
                          </p>

                        </div>


                        <div className="sm:text-right">

                          <p className="text-xl font-bold text-zinc-900">
                            {item.score}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {new Date(
                              item.created_at
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                    ))}

                </div>

              )}

            </section>


            {/* ================= QUICK ACTIONS ================= */}

            <section className="mt-8 rounded-2xl bg-black p-8 text-white">

              <h2 className="text-2xl font-bold">
                Ready to Play?
              </h2>

              <p className="mt-3 max-w-2xl text-zinc-300">
                Keep submitting your golf scores and take part in
                the monthly prize draws while supporting charity.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">

                <a
                  href="/"
                  className="rounded-full bg-white px-6 py-3 font-semibold text-black"
                >
                  Back to Home
                </a>

                <button
                  type="button"
                  onClick={logout}
                  disabled={loggingOut}
                  className="rounded-full border border-white px-6 py-3 font-semibold text-white disabled:opacity-50"
                >
                  Logout
                </button>

              </div>

            </section>

          </>

        )}

      </div>

    </main>
  );
}