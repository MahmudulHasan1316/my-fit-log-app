This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { FitnessType } from "@/fitness-type";
import Image from "next/image";
type FitnessId = FitnessType["id"];

const MyPlanClient = () => {
  const [plan, setPlan] = useState<FitnessType[]>([]);
  const [saved, setSaved] = useState<FitnessType[]>([]);

  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<"duration" | "calories" | "name">(
    "duration",
  );

  const [loaded, setLoaded] = useState(false);

  // --------------------------------
  // LOAD DATA
  // --------------------------------

  useEffect(() => {
  const timer = window.setTimeout(() => {
    try {
      const storedPlan = localStorage.getItem("fitlog-plan");
      const storedSaved = localStorage.getItem("fitlog-saved");

      if (storedPlan) {
        const parsedPlan = JSON.parse(storedPlan);

        if (Array.isArray(parsedPlan)) {
          setPlan(parsedPlan);
        }
      }

      if (storedSaved) {
        const parsedSaved = JSON.parse(storedSaved);

        if (Array.isArray(parsedSaved)) {
          setSaved(parsedSaved);
        }
      }
    } catch (error) {
      console.error("Failed to load plan:", error);
    } finally {
      setLoaded(true);
    }
  }, 0);

  return () => window.clearTimeout(timer);
}, []);

  // --------------------------------
  // SAVE DATA
  // --------------------------------

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("fitlog-plan", JSON.stringify(plan));
  }, [plan, loaded]);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("fitlog-saved", JSON.stringify(saved));
  }, [saved, loaded]);

  // --------------------------------
  // CURRENT DATA
  // --------------------------------

  const currentExercises = activeTab === "plan" ? plan : saved;

  // --------------------------------
  // SEARCH + SORT
  // --------------------------------

  const exercises = useMemo(() => {
    let result = [...currentExercises];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchValue),
      );
    }

    result.sort((a, b) => {
      if (sortBy === "duration") {
        return Number(a.duration ?? 0) - Number(b.duration ?? 0);
      }

      if (sortBy === "calories") {
        return Number(b.calories ?? 0) - Number(a.calories ?? 0);
      }

      return a.name.localeCompare(b.name);
    });

    return result;
  }, [currentExercises, search, sortBy]);

  // --------------------------------
  // STATISTICS
  // --------------------------------

  const totalExercises = plan.length;

  const completedExercises = plan.filter(
    (exercise) => exercise.completed,
  ).length;

  const totalMinutes = plan.reduce(
    (total, exercise) => total + Number(exercise.duration ?? 0),
    0,
  );

  const totalCalories = plan.reduce(
    (total, exercise) => total + Number(exercise.calories ?? 0),
    0,
  );

  const progress =
    totalExercises === 0
      ? 0
      : Math.round((completedExercises / totalExercises) * 100);

  // --------------------------------
  // COMPLETE
  // --------------------------------

  const handleComplete = (id: FitnessId) => {
    setPlan((current) =>
      current.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              completed: !exercise.completed,
            }
          : exercise,
      ),
    );

    const exercise = plan.find((item) => item.id === id);

    if (!exercise) return;

    if (exercise.completed) {
      toast.info(`${exercise.name} marked as active`);
    } else {
      toast.success(`${exercise.name} completed!`);
    }
  };

  // --------------------------------
  // REMOVE
  // --------------------------------

  const handleRemove = (id: FitnessId) => {
    const exercise = plan.find((item) => item.id === id);

    setPlan((current) => current.filter((item) => item.id !== id));

    if (exercise) {
      toast.info(`${exercise.name} removed`);
    }
  };

  // --------------------------------
  // SAVE / UNSAVE
  // --------------------------------

  const handleSave = (exercise: FitnessType) => {
    const exists = saved.some((item) => item.id === exercise.id);

    if (exists) {
      setSaved((current) => current.filter((item) => item.id !== exercise.id));

      toast.info(`${exercise.name} removed from saved`);
    } else {
      setSaved((current) => [...current, exercise]);

      toast.success(`${exercise.name} saved`);
    }
  };

  // --------------------------------
  // CLEAR COMPLETED
  // --------------------------------

  const handleClearCompleted = () => {
    const count = plan.filter((exercise) => exercise.completed).length;

    if (count === 0) {
      toast.info("No completed exercises.");
      return;
    }

    setPlan((current) => current.filter((exercise) => !exercise.completed));

    toast.success(
      `${count} completed ${count === 1 ? "exercise" : "exercises"} cleared`,
    );
  };

  // --------------------------------
  // CLEAR PLAN
  // --------------------------------

  const handleClearPlan = () => {
    if (plan.length === 0) {
      toast.info("Your plan is empty.");
      return;
    }

    const confirmed = window.confirm("Clear your entire workout plan?");

    if (!confirmed) return;

    setPlan([]);

    toast.success("Your workout plan was cleared.");
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#090b0e]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="skeleton h-8 w-48 bg-white/5" />

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="skeleton h-24 bg-white/5" />
            <div className="skeleton h-24 bg-white/5" />
            <div className="skeleton h-24 bg-white/5" />
            <div className="skeleton h-24 bg-white/5" />
          </div>

          <div className="mt-6 skeleton h-64 bg-white/5" />
        </div>
      </main>
    );
  }

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      <main className="min-h-screen bg-[#090b0e] text-white">


        {/* ====> in the coment <==== */}
        {/* NAVBAR */}

        {/* <nav className="border-b border-white/white/6 bg-[#090b0e]">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[#c6ff00]">⚡</span>

              <span className="text-sm font-black">FITLOG</span>
            </Link>

            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/workouts"
                className="rounded-lg px-4 py-2 text-xs text-slate-500 hover:text-white"
              >
                Workouts
              </Link>

              <Link
                href="/myplan"
                className="rounded-lg bg-[#c6ff00]/10 px-4 py-2 text-xs font-bold text-[#c6ff00]"
              >
                My Plan
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Plan</span>

              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c6ff00] px-1.5 text-[9px] font-black text-black">
                {plan.length}
              </span>
            </div>
          </div>
        </nav> */}

        {/* CONTENT */}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase sm:text-3xl">
                My Plan
              </h1>

              <p className="mt-2 text-xs text-slate-500">
                Keep your favorite workouts here. Finish them, then load more.
              </p>
            </div>

            {plan.length > 0 && (
              <div className="w-full sm:w-52">
                <div className="mb-2 flex justify-between text-[9px] font-bold uppercase">
                  <span className="text-slate-500">Progress</span>

                  <span className="text-[#c6ff00]">{progress}%</span>
                </div>

                <progress
                  className="progress progress-success h-1.5 w-full"
                  value={progress}
                  max="100"
                />
              </div>
            )}
          </div>

          {/* STATS */}

          <div className="mt-7 grid grid-cols-2 overflow-hidden rounded-xl border border-white/6 bg-[#11151b] sm:grid-cols-4">
            <Stat title="Exercises" value={totalExercises} highlight />

            <Stat title="Minutes" value={totalMinutes} />

            <Stat title="Calories" value={totalCalories} />

            <Stat title="Completed" value={completedExercises} />
          </div>

          {/* TOOLBAR */}

          <div className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* TABS */}

              <div className="flex w-full rounded-lg border border-white/6 bg-[#11151b] p-1 sm:w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab("plan")}
                  className={`flex-1 rounded-md px-4 py-2 text-[10px] font-bold sm:flex-none ${
                    activeTab === "plan"
                      ? "bg-white text-black"
                      : "text-slate-500"
                  }`}
                >
                  Today&apos;s Plan
                  <span className="ml-1">{plan.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("saved")}
                  className={`flex-1 rounded-md px-4 py-2 text-[10px] font-bold sm:flex-none ${
                    activeTab === "saved"
                      ? "bg-white text-black"
                      : "text-slate-500"
                  }`}
                >
                  Saved
                  <span className="ml-1">{saved.length}</span>
                </button>
              </div>

              {/* SEARCH + SORT */}

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search exercises..."
                  className="input input-sm h-9 w-full border-white/10 bg-[#11151b] text-xs text-white placeholder:text-slate-600 sm:w-52"
                />

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value as "duration" | "calories" | "name",
                    )
                  }
                  className="select select-sm h-9 border-white/10 bg-[#11151b] text-xs text-white"
                >
                  <option value="duration">Duration</option>

                  <option value="calories">Calories</option>

                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* ACTIONS */}

            {activeTab === "plan" && plan.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleClearCompleted}
                  className="btn btn-xs border-white/10 bg-transparent text-slate-500"
                >
                  Clear completed
                </button>

                <button
                  type="button"
                  onClick={handleClearPlan}
                  className="btn btn-xs border-red-500/10 bg-transparent text-red-400"
                >
                  Clear plan
                </button>
              </div>
            )}
          </div>

          {/* EXERCISES */}

          <div className="mt-5">
            {exercises.length === 0 ? (
              <EmptyState tab={activeTab} searching={Boolean(search)} />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    saved={saved.some((item) => item.id === exercise.id)}
                    onComplete={handleComplete}
                    onRemove={handleRemove}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </div>
        </div>


        {/* ====> In the comment <==== */}
        {/* FOOTER

        <footer className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[9px] text-slate-600 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <span className="font-bold">⚡ FITLOG</span>

            <span>© 2026 Fitlog — Workout Library</span>
          </div>
        </footer> */}
        {/* ====> In the comment <==== */}

      </main>
    </>
  );
};

export default MyPlanClient;

/* --------------------------------
   STAT
-------------------------------- */

const Stat = ({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) => {
  return (
    <div className="border-b border-white/5 px-4 py-5 last:border-0 sm:border-b-0 sm:border-r sm:px-6">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-black ${
          highlight ? "text-[#c6ff00]" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

/* --------------------------------
   EMPTY STATE
-------------------------------- */

const EmptyState = ({
  tab,
  searching,
}: {
  tab: "plan" | "saved";
  searching: boolean;
}) => {
  if (searching) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-white/8 text-center">
        <span className="text-3xl">🔎</span>

        <h2 className="mt-4 text-sm font-black uppercase">Nothing found</h2>

        <p className="mt-2 text-[10px] text-slate-600">
          Try searching for another exercise.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-87.5 flex-col items-center justify-center rounded-xl border border-dashed border-white/8 bg-[#0d1014] px-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c6ff00]/10 text-2xl">
        {tab === "plan" ? "⚡" : "☆"}
      </div>

      <h2 className="mt-5 text-sm font-black uppercase">Nothing here yet</h2>

      <p className="mt-2 max-w-xs text-[10px] leading-5 text-slate-600">
        {tab === "plan"
          ? "Browse the library and add it to your plan to start moving."
          : "Save your favorite exercises and they will appear here."}
      </p>

      <Link
        href="/workouts"
        className="btn mt-5 h-9 min-h-9 border-0 bg-[#c6ff00] px-5 text-[10px] font-black text-black"
      >
        Go to workouts
      </Link>
    </div>
  );
};

/* --------------------------------
   EXERCISE CARD
-------------------------------- */

const ExerciseCard = ({
  exercise,
  saved,
  onComplete,
  onRemove,
  onSave,
}: {
  exercise: FitnessType;
  saved: boolean;
  onComplete: (id: FitnessId) => void;
onRemove: (id: FitnessId) => void;
  onSave: (exercise: FitnessType

  ) => void;
}) => {
  return (
    <article
      className={`overflow-hidden rounded-xl border bg-[#11151b] transition hover:-translate-y-1 hover:border-white/10 ${
        exercise.completed
          ? "border-[#c6ff00]/20 opacity-70"
          : "border-white/6"
      }`}
    >
      {/* IMAGE */}

      <div className="relative h-48 overflow-hidden">
        <Image
          src={
            exercise.image ||
            "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
          }
          alt={exercise.name}
          className={`h-full w-full object-cover ${
            exercise.completed ? "grayscale" : ""
          }`}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-[#c6ff00] px-2.5 py-1 text-[8px] font-black uppercase text-black">
          {exercise.category || "Fitness"}
        </span>

        <button
          type="button"
          onClick={() => onSave(exercise)}
          className={`btn btn-circle btn-xs absolute right-3 top-3 border-0 ${
            saved ? "bg-[#c6ff00] text-black" : "bg-black/50 text-white"
          }`}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      {/* BODY */}

      <div className="p-4">
        <h3 className="text-sm font-black uppercase">{exercise.name}</h3>

        <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
          {exercise.description ||
            "Complete this exercise with controlled movement and proper form."}
        </p>

        {/* META */}

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Meta label="Sets" value={exercise.sets ?? 4} />

          <Meta label="Reps" value={exercise.reps ?? "8-12"} />

          <Meta label="Time" value={`${exercise.duration ?? 25}m`} />
        </div>

        {/* ACTIONS */}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onComplete(exercise.id)}
            className={`btn btn-sm min-h-9 flex-1 border-0 text-[10px] ${
              exercise.completed
                ? "bg-white text-black"
                : "bg-[#c6ff00] text-black"
            }`}
          >
            {exercise.completed ? "Mark active" : "Complete"}
          </button>

          <button
            type="button"
            onClick={() => onRemove(exercise.id)}
            className="btn btn-square btn-sm min-h-9 border-white/10 bg-transparent text-slate-500 hover:bg-red-500/10 hover:text-red-400"
          >
            ×
          </button>
        </div>
      </div>
    </article>
  );
};

const Meta = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div className="rounded-lg border border-white/5 bg-white/2 px-2 py-2">
      <p className="text-[7px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-300">{value}</p>
    </div>
  );
};

