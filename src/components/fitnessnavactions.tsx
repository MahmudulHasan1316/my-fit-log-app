
"use client";

import { useFitnessPlan } from "@/context/fitnessplancontext";
import Link from "next/link";


const FitnessNavActions = () => {
  const { plannedIds, savedIds } = useFitnessPlan();

  return (
    <div className="flex items-center gap-2 sm:gap-3">

      {/* Today's Plan */}
      <Link
        href="/my-plan"
        className="btn btn-ghost btn-sm gap-1 rounded-lg px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
      >
        <span>Plan</span>

        <span className="badge badge-success badge-xs sm:badge-sm">
          {plannedIds.length}
        </span>
      </Link>

      {/* Saved Workouts */}
      <Link
        href="/saved"
        className="btn btn-ghost btn-sm gap-1 rounded-lg px-2 text-xs sm:gap-2 sm:px-3 sm:text-sm"
      >
        <span>Saved</span>

        <span className="badge badge-success badge-xs sm:badge-sm">
          {savedIds.length}
        </span>
      </Link>

    </div>
  );
};

export default FitnessNavActions;