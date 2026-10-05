"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Clock3,
  Flame,
  Star,
  Check,
  X,
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useFitnessPlan } from "@/context/fitnessplancontext";

type Tab = "plan" | "saved";

export default function MyPlan() {
  const searchParams = useSearchParams();

  const {
    todaysPlan,
    savedWorkouts,
    removeFromTodaysPlan,
    markAsDone,
    removeFromSaved,
    isLoading,
  } = useFitnessPlan();

  const [activeTab, setActiveTab] =
    useState<Tab>("plan");

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "saved") {
      setActiveTab("saved");
    } else {
      setActiveTab("plan");
    }
  }, [searchParams]);

  const workouts =
    activeTab === "plan"
      ? todaysPlan
      : savedWorkouts;

  const totalMinutes = todaysPlan.reduce(
    (total, workout) =>
      total + workout.duration,
    0
  );

  const totalCalories = todaysPlan.reduce(
    (total, workout) =>
      total + workout.caloriesBurned,
    0
  );

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#0d0f12] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-zinc-400">
            Loading workouts…
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0d0f12] px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div>
          <h1 className="text-4xl font-black uppercase text-white">
            MY PLAN
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Cap of five lifts for today. Finish them,
            then load more.
          </p>
        </div>

        {/* ========================= */}
        {/* METRICS */}
        {/* ========================= */}

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <MetricCard
            title="Exercises"
            value={todaysPlan.length}
          />

          <MetricCard
            title="Minutes"
            value={totalMinutes}
          />

          <MetricCard
            title="Calories"
            value={totalCalories}
          />

        </div>

        {/* ========================= */}
        {/* TABS */}
        {/* ========================= */}

        <div className="mt-8 flex border-b border-zinc-800">

          <button
            onClick={() => setActiveTab("plan")}
            className={`px-5 py-3 text-sm font-semibold ${
              activeTab === "plan"
                ? "border-b-2 border-lime-400 text-lime-400"
                : "text-zinc-500"
            }`}
          >
            Today&apos;s Plan
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`px-5 py-3 text-sm font-semibold ${
              activeTab === "saved"
                ? "border-b-2 border-lime-400 text-lime-400"
                : "text-zinc-500"
            }`}
          >
            Saved
          </button>

        </div>

        {/* ========================= */}
        {/* EMPTY STATE */}
        {/* ========================= */}

        {workouts.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          <div className="mt-6 space-y-4">

            {workouts.map((workout) => (
              <WorkoutPlanCard
                key={workout.id}
                workout={workout}
                activeTab={activeTab}
                onRemove={() =>
                  activeTab === "plan"
                    ? removeFromTodaysPlan(
                        workout.id
                      )
                    : removeFromSaved(workout.id)
                }
                onDone={() =>
                  markAsDone(workout.id)
                }
              />
            ))}

          </div>
        )}
      </div>
    </section>
  );
}

/* ========================= */
/* METRIC CARD */
/* ========================= */

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#15171b] p-5">
      <p className="text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

/* ========================= */
/* WORKOUT CARD */
/* ========================= */

function WorkoutPlanCard({
  workout,
  activeTab,
  onRemove,
  onDone,
}: {
  workout: any;
  activeTab: Tab;
  onRemove: () => void;
  onDone: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-[#15171b]">

      <div className="flex flex-col sm:flex-row">

        {/* IMAGE */}

        <div className="relative h-52 w-full sm:h-auto sm:w-56">
          <Image
            src={workout.image}
            alt={workout.name}
            fill
            sizes="(max-width: 640px) 100vw, 224px"
            className="object-cover"
          />
        </div>

        {/* CONTENT */}

        <div className="flex flex-1 flex-col justify-between p-5">

          <div>
            <h2 className="text-xl font-black uppercase text-white">
              {workout.name}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {workout.equipment}
            </p>

            {/* Stats */}

            <div className="mt-4 flex flex-wrap gap-5 text-xs text-zinc-400">

              <span className="flex items-center gap-1">
                <Clock3 size={14} />
                {workout.duration} min
              </span>

              <span className="flex items-center gap-1">
                <Flame size={14} />
                {workout.caloriesBurned} kcal
              </span>

              <span className="flex items-center gap-1">
                <Star size={14} />
                {workout.rating}
              </span>

            </div>
          </div>

          {/* ACTIONS */}

          <div className="mt-6 flex flex-wrap gap-2">

            <Link
              href={`/fitnessCardDetails/${workout.id}`}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-semibold text-white hover:border-lime-400 hover:text-lime-400"
            >
              View Details
            </Link>

            {activeTab === "plan" && (
              <button
                onClick={onDone}
                className="flex items-center gap-1 rounded-lg bg-lime-400 px-4 py-2 text-xs font-bold text-black hover:bg-lime-300"
              >
                <Check size={14} />
                Mark as Done
              </button>
            )}

            <button
              onClick={onRemove}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 hover:border-red-500 hover:text-red-400"
            >
              <X size={14} />
              Remove
            </button>

          </div>

        </div>
      </div>
    </article>
  );
}

/* ========================= */
/* EMPTY STATE */
/* ========================= */

function EmptyState({
  activeTab,
}: {
  activeTab: Tab;
}) {
  return (
    <div className="mt-10 rounded-xl border border-dashed border-zinc-800 bg-[#111317] px-6 py-16 text-center">

      <h2 className="text-xl font-black uppercase text-white">
        NOTHING HERE YET
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        {activeTab === "plan"
          ? "Browse the library and add a lift to get today moving."
          : "Save workouts you want to come back to later."}
      </p>

      <Link
        href="/workouts"
        className="mt-6 inline-flex rounded-lg bg-lime-400 px-5 py-3 text-sm font-bold text-black hover:bg-lime-300"
      >
        Go to workouts
      </Link>

    </div>
  );
}