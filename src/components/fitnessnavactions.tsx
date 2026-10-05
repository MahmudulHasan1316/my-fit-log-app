
// "use client";

// import { useFitnessPlan } from "@/context/fitnessplancontext";
// import Link from "next/link";


// const FitnessNavActions = () => {
//   const { plannedIds, savedIds } = useFitnessPlan();

//   return (
//     <div className="flex items-center gap-2 sm:gap-3">

//       {/* Today's Plan */}
//       <Link
//         href="/myplan"
//         className="btn btn-ghost btn-sm gap-1 rounded-lg px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
//       >
//         <span>Plan</span>

//         <span className="badge badge-success badge-xs sm:badge-sm">
//           {plannedIds.length}
//         </span>
//       </Link>

//       {/* Saved Workouts */}
//       <Link
//         href="/myplan"
//         className="btn btn-ghost btn-sm gap-1 rounded-lg px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
//       >
//         <span>Saved</span>

//         <span className="badge badge-success badge-xs sm:badge-sm">
//           {savedIds.length}
//         </span>
//       </Link>

//     </div>
//   );
// };

// export default FitnessNavActions;





"use client";

import Link from "next/link";

import { CalendarCheck, Bookmark } from "lucide-react";

import { useFitnessPlan } from "@/context/fitnessplancontext";

export default function FitnessNavActions() {
  const {
    planCount,
    savedCount,
  } = useFitnessPlan();

  return (
    <div className="flex items-center gap-5">

      {/* Plan */}
      <Link
        href="/myplan"
        className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-lime-400"
      >
        <CalendarCheck size={16} />

        <span>Plan</span>

        <span className="badge badge-sm border-0 bg-lime-400 font-bold text-slate-950">
          {planCount}
        </span>
      </Link>

      {/* Saved */}
      <Link
        href="/myplan?tab=saved"
        className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-lime-400"
      >
        <Bookmark size={16} />

        <span>Saved</span>

        <span className="badge badge-sm border-slate-700 bg-slate-900 text-slate-300">
          {savedCount}
        </span>
      </Link>

    </div>
  );
}