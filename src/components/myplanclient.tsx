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
                Cap of five lifts for today. Finish them, then load more.
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

            {/* <Stat title="Completed" value={completedExercises} /> */}
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

      
        {/* FOOTER */}

        {/* <footer className="border-t border-white/5">
           <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[9px] text-slate-600 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
             <span className="font-bold">⚡ FITLOG</span>

             <span>© 2026 Fitlog — Workout Library</span>
           </div>
         </footer> */}
        

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








































// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { toast, ToastContainer } from "react-toastify";

// import "react-toastify/dist/ReactToastify.css";

// import { FitnessType } from "@/fitness-type";
// import Image from "next/image";

// const PLAN_STORAGE_KEY = "fitlog-plan";
// const SAVED_STORAGE_KEY = "fitlog-saved";

// type SortOption = "duration" | "calories" | "name" | "difficulty" | "rating";

// type TabType = "plan" | "saved";

// /*
// |--------------------------------------------------------------------------
// | Demo data
// |--------------------------------------------------------------------------
// | This is only used when localStorage does not contain a plan yet.
// | Once your workout page saves exercises into "fitlog-plan", those
// | exercises will be used instead.
// */
// const demoExercises: FitnessType[] = [
//   {
//     id: 1,
//     name: "Push Ups",
//     image:
//       "https://images.unsplash.com/photo-1598971639058-a4b2b2c9f0c6?auto=format&fit=crop&w=800&q=80",
//     muscleGroups: ["Chest", "Shoulders", "Triceps"],
//     equipment: "No Equipment",
//     difficulty: "Beginner",
//     duration: 8,
//     caloriesBurned: 70,
//     sets: 3,
//     rating: 4.8,
//     calories: 70,
//     reps: "12-15",
//     description: "A classic upper-body bodyweight exercise.",
//     instructions: [
//       "Start in a high plank position.",
//       "Lower your body toward the floor.",
//       "Push back to the starting position.",
//     ],
//     completed: "pending",
//     category: "Strength",
//   },
//   {
//     id: 2,
//     name: "Bodyweight Squats",
//     image:
//       "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80",
//     muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"],
//     equipment: "No Equipment",
//     difficulty: "Beginner",
//     duration: 15,
//     caloriesBurned: 120,
//     sets: 3,
//     rating: 4.9,
//     calories: 120,
//     reps: "15-20",
//     description: "A lower-body exercise targeting the major leg muscles.",
//     instructions: [
//       "Stand with your feet shoulder-width apart.",
//       "Lower your hips toward the floor.",
//       "Drive through your feet to stand again.",
//     ],
//     completed: "pending",
//     category: "Strength",
//   },
// ];

// /*
// |--------------------------------------------------------------------------
// | Helper functions
// |--------------------------------------------------------------------------
// */

// const getCalories = (exercise: FitnessType) => {
//   return Number(exercise.caloriesBurned ?? exercise.calories ?? 0);
// };

// const getDuration = (exercise: FitnessType) => {
//   return Number(exercise.duration ?? 0);
// };

// const isCompleted = (exercise: FitnessType) => {
//   return (
//     exercise.completed === "completed" ||
//     exercise.completed === "true" ||
//     exercise.completed === "done"
//   );
// };

// const toggleCompletedValue = (exercise: FitnessType): FitnessType => {
//   return {
//     ...exercise,
//     completed: isCompleted(exercise) ? "pending" : "completed",
//   };
// };

// const MyPlanPage = () => {
//   const [plan, setPlan] = useState<FitnessType[]>([]);
//   const [saved, setSaved] = useState<FitnessType[]>([]);

//   const [activeTab, setActiveTab] = useState<TabType>("plan");

//   const [search, setSearch] = useState("");

//   const [sortBy, setSortBy] = useState<SortOption>("duration");

//   const [isLoaded, setIsLoaded] = useState(false);

//   /*
//   |--------------------------------------------------------------------------
//   | Load localStorage
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     try {
//       const storedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
//       const storedSaved = localStorage.getItem(SAVED_STORAGE_KEY);

//       if (storedPlan) {
//         const parsedPlan = JSON.parse(storedPlan);

//         if (Array.isArray(parsedPlan)) {
//           setPlan(parsedPlan);
//         }
//       } else {
//         setPlan(demoExercises);
//       }

//       if (storedSaved) {
//         const parsedSaved = JSON.parse(storedSaved);

//         if (Array.isArray(parsedSaved)) {
//           setSaved(parsedSaved);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to load workout data:", error);

//       setPlan(demoExercises);
//     } finally {
//       setIsLoaded(true);
//     }
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | Save plan
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     if (!isLoaded) return;

//     localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
//   }, [plan, isLoaded]);

//   /*
//   |--------------------------------------------------------------------------
//   | Save saved exercises
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     if (!isLoaded) return;

//     localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved));
//   }, [saved, isLoaded]);

//   /*
//   |--------------------------------------------------------------------------
//   | Current list
//   |--------------------------------------------------------------------------
//   */

//   const currentExercises = activeTab === "plan" ? plan : saved;

//   /*
//   |--------------------------------------------------------------------------
//   | Search + Sort
//   |--------------------------------------------------------------------------
//   */

//   const filteredExercises = useMemo(() => {
//     const searchValue = search.trim().toLowerCase();

//     const filtered = currentExercises.filter((exercise) => {
//       if (!searchValue) return true;

//       return (
//         exercise.name.toLowerCase().includes(searchValue) ||
//         exercise.description?.toLowerCase().includes(searchValue) ||
//         exercise.category?.toLowerCase().includes(searchValue) ||
//         exercise.difficulty?.toLowerCase().includes(searchValue) ||
//         exercise.muscleGroups?.some((muscle) =>
//           muscle.toLowerCase().includes(searchValue),
//         )
//       );
//     });

//     return [...filtered].sort((a, b) => {
//       switch (sortBy) {
//         case "duration":
//           return getDuration(a) - getDuration(b);

//         case "calories":
//           return getCalories(a) - getCalories(b);

//         case "name":
//           return a.name.localeCompare(b.name);

//         case "difficulty":
//           return a.difficulty.localeCompare(b.difficulty);

//         case "rating":
//           return Number(b.rating ?? 0) - Number(a.rating ?? 0);

//         default:
//           return 0;
//       }
//     });
//   }, [currentExercises, search, sortBy]);

//   /*
//   |--------------------------------------------------------------------------
//   | Dynamic statistics
//   |--------------------------------------------------------------------------
//   */

//   const statistics = useMemo(() => {
//     return {
//       exercises: currentExercises.length,

//       minutes: currentExercises.reduce(
//         (total, exercise) => total + getDuration(exercise),
//         0,
//       ),

//       calories: currentExercises.reduce(
//         (total, exercise) => total + getCalories(exercise),
//         0,
//       ),
//     };
//   }, [currentExercises]);

//   /*
//   |--------------------------------------------------------------------------
//   | Remove exercise from today's plan
//   |--------------------------------------------------------------------------
//   */

//   const removeFromPlan = (id: number) => {
//     const exercise = plan.find((item) => item.id === id);

//     setPlan((previous) => previous.filter((item) => item.id !== id));

//     if (exercise) {
//       toast.success(`${exercise.name} removed from your plan`);
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Add/remove saved exercise
//   |--------------------------------------------------------------------------
//   */

//   const toggleSaved = (exercise: FitnessType) => {
//     const alreadySaved = saved.some((item) => item.id === exercise.id);

//     if (alreadySaved) {
//       setSaved((previous) =>
//         previous.filter((item) => item.id !== exercise.id),
//       );

//       toast.info(`${exercise.name} removed from saved`);
//     } else {
//       setSaved((previous) => [...previous, exercise]);

//       toast.success(`${exercise.name} saved`);
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Add exercise to today's plan
//   |--------------------------------------------------------------------------
//   */

//   const addToPlan = (exercise: FitnessType) => {
//     const alreadyExists = plan.some((item) => item.id === exercise.id);

//     if (alreadyExists) {
//       toast.info(`${exercise.name} is already in your plan`);
//       return;
//     }

//     setPlan((previous) => [
//       ...previous,
//       {
//         ...exercise,
//         completed: "pending",
//       },
//     ]);

//     toast.success(`${exercise.name} added to today's plan`);

//     setActiveTab("plan");
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Toggle complete
//   |--------------------------------------------------------------------------
//   */

//   const toggleComplete = (id: number) => {
//     setPlan((previous) =>
//       previous.map((exercise) =>
//         exercise.id === id ? toggleCompletedValue(exercise) : exercise,
//       ),
//     );
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Clear today's plan
//   |--------------------------------------------------------------------------
//   */

//   const clearPlan = () => {
//     if (plan.length === 0) {
//       toast.info("Your plan is already empty");
//       return;
//     }

//     setPlan([]);

//     toast.success("Today's plan has been cleared");
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Render
//   |--------------------------------------------------------------------------
//   */

//   return (
//     <main className="min-h-screen bg-[#0d0f12] px-3 py-5 text-white sm:px-5 md:px-8 lg:px-10">
//       <div className="mx-auto w-full max-w-7xl">
//         {/* ================================================================
//             HEADER
//         ================================================================= */}

//         <section className="mb-5">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
//                 MY PLAN
//               </h1>

//               <p className="mt-1 text-xs text-gray-500 sm:text-sm">
//                 Cap of five lifts for today. Finish them, then load more.
//               </p>
//             </div>

//             <Link
//               href="/workouts"
//               className="btn btn-sm w-full border-0 bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.12)] hover:bg-lime-300 sm:w-auto"
//             >
//               + Add Workout
//             </Link>
//           </div>
//         </section>

//         {/* ================================================================
//             STATISTICS
//         ================================================================= */}

//         <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
//           {/* Exercises */}

//           <div className="rounded-xl border border-white/10 bg-[#12151b] p-5 transition hover:border-lime-400/30">
//             <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
//               Exercises
//             </p>

//             <div className="mt-2 flex items-end gap-2">
//               <span className="text-3xl font-black leading-none text-lime-400">
//                 {statistics.exercises}
//               </span>

//               <span className="pb-0.5 text-xs text-gray-500">/ 5 today</span>
//             </div>
//           </div>

//           {/* Minutes */}

//           <div className="rounded-xl border border-white/10 bg-[#12151b] p-5 transition hover:border-white/20">
//             <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
//               Minutes
//             </p>

//             <div className="mt-2">
//               <span className="text-3xl font-black leading-none text-white">
//                 {statistics.minutes}
//               </span>
//             </div>
//           </div>

//           {/* Calories */}

//           <div className="rounded-xl border border-white/10 bg-[#12151b] p-5 transition hover:border-white/20">
//             <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
//               Calories
//             </p>

//             <div className="mt-2">
//               <span className="text-3xl font-black leading-none text-white">
//                 {statistics.calories}
//               </span>

//               <span className="ml-1 text-xs text-gray-500">kcal</span>
//             </div>
//           </div>
//         </section>

//         {/* ================================================================
//             SEARCH / TABS / SORT
//         ================================================================= */}

//         <section className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
//           {/* Tabs */}

//           <div className="flex w-full rounded-lg bg-[#15181e] p-1 sm:w-fit">
//             <button
//               type="button"
//               onClick={() => setActiveTab("plan")}
//               className={`flex-1 rounded-md px-5 py-2 text-xs font-semibold transition sm:flex-none ${
//                 activeTab === "plan"
//                   ? "bg-white text-black shadow"
//                   : "text-gray-500 hover:text-white"
//               }`}
//             >
//               Today&apos;s Plan
//             </button>

//             <button
//               type="button"
//               onClick={() => setActiveTab("saved")}
//               className={`flex-1 rounded-md px-5 py-2 text-xs font-semibold transition sm:flex-none ${
//                 activeTab === "saved"
//                   ? "bg-white text-black shadow"
//                   : "text-gray-500 hover:text-white"
//               }`}
//             >
//               Saved
//             </button>
//           </div>

//           {/* Search */}

//           <div className="order-first w-full lg:order-0 lg:max-w-sm">
//             <label className="input input-sm flex w-full items-center gap-2 border-white/10 bg-[#15181e] text-gray-300">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 opacity-60"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
//                 />
//               </svg>

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search exercises..."
//                 className="grow bg-transparent text-xs outline-none"
//               />

//               {search && (
//                 <button
//                   type="button"
//                   onClick={() => setSearch("")}
//                   className="text-gray-500 hover:text-white"
//                   aria-label="Clear search"
//                 >
//                   ×
//                 </button>
//               )}
//             </label>
//           </div>

//           {/* Sort */}

//           <div className="flex items-center justify-between gap-2 lg:justify-end">
//             <span className="text-xs text-gray-500">Sort By</span>

//             <select
//               value={sortBy}
//               onChange={(event) => setSortBy(event.target.value as SortOption)}
//               className="select select-sm min-w-36 border-white/10 bg-[#15181e] text-xs text-white outline-none"
//             >
//               <option value="duration">Duration</option>
//               <option value="calories">Calories</option>
//               <option value="name">Name</option>
//               <option value="difficulty">Difficulty</option>
//               <option value="rating">Rating</option>
//             </select>
//           </div>
//         </section>

//         {/* ================================================================
//             ACTION BAR
//         ================================================================= */}

//         {activeTab === "plan" && plan.length > 0 && (
//           <div className="mb-4 flex items-center justify-between">
//             <p className="text-xs text-gray-500">
//               {filteredExercises.length} exercise
//               {filteredExercises.length !== 1 ? "s" : ""} shown
//             </p>

//             <button
//               type="button"
//               onClick={clearPlan}
//               className="btn btn-xs border-0 bg-transparent text-red-400 hover:bg-red-500/10"
//             >
//               Clear Plan
//             </button>
//           </div>
//         )}

//         {/* ================================================================
//             EMPTY STATE
//         ================================================================= */}

//         {filteredExercises.length === 0 && (
//           <section className="flex min-h-82.5 items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#101318] px-5 py-10">
//             <div className="max-w-md text-center">
//               <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#191d23] text-2xl">
//                 {search ? "⌕" : "＋"}
//               </div>

//               <h2 className="text-sm font-black uppercase tracking-wider text-white sm:text-base">
//                 {search ? "NO RESULTS FOUND" : "NOTHING HERE YET"}
//               </h2>

//               <p className="mt-2 text-xs leading-5 text-gray-500">
//                 {search
//                   ? `No exercises match "${search}". Try another search.`
//                   : activeTab === "saved"
//                     ? "Save exercises from your workout library and they will appear here."
//                     : "Browse the library and add a few exercises to get moving."}
//               </p>

//               {search ? (
//                 <button
//                   type="button"
//                   onClick={() => setSearch("")}
//                   className="btn btn-sm mt-5 border-0 bg-lime-400 px-6 text-black hover:bg-lime-300"
//                 >
//                   Clear Search
//                 </button>
//               ) : (
//                 <Link
//                   href="/workouts"
//                   className="btn btn-sm mt-5 border-0 bg-lime-400 px-6 text-black hover:bg-lime-300"
//                 >
//                   Go to workouts
//                 </Link>
//               )}
//             </div>
//           </section>
//         )}

//         {/* ================================================================
//             EXERCISE CARDS
//         ================================================================= */}

//         {filteredExercises.length > 0 && (
//           <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {filteredExercises.map((exercise) => {
//               const completed = isCompleted(exercise);

//               const existsInPlan = plan.some((item) => item.id === exercise.id);

//               const existsInSaved = saved.some(
//                 (item) => item.id === exercise.id,
//               );

//               return (
//                 <article
//                   key={exercise.id}
//                   className={`group overflow-hidden rounded-xl border bg-[#12151b] transition duration-300 ${
//                     completed
//                       ? "border-lime-400/30"
//                       : "border-white/10 hover:-translate-y-1 hover:border-white/20"
//                   }`}
//                 >
//                   {/* Image */}

//                   <div className="relative h-44 overflow-hidden bg-[#191d23]">
//                     {exercise.image ? (
//                       <Image
//                         src={exercise.image}
//                         alt={exercise.name}
//                         className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
//                           completed ? "opacity-50" : ""
//                         }`}
//                       />
//                     ) : (
//                       <div className="flex h-full items-center justify-center text-gray-600">
//                         No Image
//                       </div>
//                     )}

//                     {/* Overlay */}

//                     <div
//                       className="absolute inset-0 export default MyPlanPage;
//                     from-black/80 via-transparent to-transparent"
//                     />

//                     {/* Difficulty */}

//                     <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
//                       {exercise.difficulty}
//                     </span>

//                     {/* Complete indicator */}

//                     {completed && (
//                       <span className="absolute right-3 top-3 rounded-full bg-lime-400 px-2.5 py-1 text-[10px] font-bold text-black">
//                         ✓ Completed
//                       </span>
//                     )}
//                   </div>

//                   {/* Content */}

//                   <div className="p-4">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="min-w-0">
//                         <h3
//                           className={`truncate text-base font-bold ${
//                             completed
//                               ? "text-gray-400 line-through"
//                               : "text-white"
//                           }`}
//                         >
//                           {exercise.name}
//                         </h3>

//                         <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
//                           {exercise.description}
//                         </p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => toggleSaved(exercise)}
//                         className={`btn btn-circle btn-xs border-0 ${
//                           existsInSaved
//                             ? "bg-lime-400 text-black"
//                             : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
//                         }`}
//                         aria-label={
//                           existsInSaved ? "Remove from saved" : "Save exercise"
//                         }
//                       >
//                         {existsInSaved ? "★" : "☆"}
//                       </button>
//                     </div>

//                     {/* Exercise information */}

//                     <div className="mt-4 grid grid-cols-3 gap-2">
//                       <div className="rounded-lg bg-[#191d23] p-2.5">
//                         <p className="text-[9px] uppercase tracking-wider text-gray-600">
//                           Time
//                         </p>

//                         <p className="mt-1 text-xs font-bold text-white">
//                           {getDuration(exercise)} min
//                         </p>
//                       </div>

//                       <div className="rounded-lg bg-[#191d23] p-2.5">
//                         <p className="text-[9px] uppercase tracking-wider text-gray-600">
//                           Calories
//                         </p>

//                         <p className="mt-1 text-xs font-bold text-white">
//                           {getCalories(exercise)} kcal
//                         </p>
//                       </div>

//                       <div className="rounded-lg bg-[#191d23] p-2.5">
//                         <p className="text-[9px] uppercase tracking-wider text-gray-600">
//                           Sets
//                         </p>

//                         <p className="mt-1 text-xs font-bold text-white">
//                           {exercise.sets ?? 0}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Muscle groups */}

//                     {exercise.muscleGroups?.length > 0 && (
//                       <div className="mt-3 flex flex-wrap gap-1.5">
//                         {exercise.muscleGroups.slice(0, 3).map((muscle) => (
//                           <span
//                             key={muscle}
//                             className="rounded-full bg-white/5 px-2 py-1 text-[9px] text-gray-500"
//                           >
//                             {muscle}
//                           </span>
//                         ))}
//                       </div>
//                     )}

//                     {/* Buttons */}

//                     <div className="mt-4 flex gap-2">
//                       {activeTab === "plan" ? (
//                         <>
//                           <button
//                             type="button"
//                             onClick={() => toggleComplete(exercise.id)}
//                             className={`btn btn-sm flex-1 border-0 text-xs ${
//                               completed
//                                 ? "bg-white/10 text-white hover:bg-white/15"
//                                 : "bg-lime-400 text-black hover:bg-lime-300"
//                             }`}
//                           >
//                             {completed ? "Undo Complete" : "Mark Complete"}
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => removeFromPlan(exercise.id)}
//                             className="btn btn-sm border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"
//                           >
//                             Remove
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             type="button"
//                             onClick={() => addToPlan(exercise)}
//                             disabled={existsInPlan}
//                             className="btn btn-sm flex-1 border-0 bg-lime-400 text-xs text-black hover:bg-lime-300 disabled:bg-white/10 disabled:text-gray-500"
//                           >
//                             {existsInPlan ? "Already in Plan" : "Add to Plan"}
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => toggleSaved(exercise)}
//                             className="btn btn-sm border border-white/10 bg-transparent text-xs text-gray-400 hover:bg-white/5 hover:text-white"
//                           >
//                             Remove
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </section>
//         )}

//         {/* ================================================================
//             FOOTER INFORMATION
//         ================================================================= */}

//         {currentExercises.length > 0 && (
//           <section className="mt-6 rounded-xl border border-white/10 bg-[#12151b] p-4">
//             <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
//               <span>
//                 Showing{" "}
//                 <strong className="text-gray-300">
//                   {filteredExercises.length}
//                 </strong>{" "}
//                 of{" "}
//                 <strong className="text-gray-300">
//                   {currentExercises.length}
//                 </strong>{" "}
//                 exercises
//               </span>

//               <span>
//                 {statistics.minutes} minutes • {statistics.calories} kcal
//               </span>
//             </div>
//           </section>
//         )}
//       </div>

//       {/* ================================================================
//           TOAST
//       ================================================================= */}

//       <ToastContainer
//         position="bottom-right"
//         autoClose={2200}
//         theme="dark"
//         newestOnTop
//       />
//     </main>
//   );
// };

// export default MyPlanPage;
