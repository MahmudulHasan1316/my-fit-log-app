"use client";

import {
  addToPlan,
  addToSaved,
} from "@/lib/fitness-storage";

import Image from "next/image";

import { FitnessType } from "@/fitness-type";

import FitnessDetailActions from "./fitnessdetailactions";

type Props = {
  fitnessCard: FitnessType;
};

const FitnessDetailsCard = ({ fitnessCard }: Props) => {
  // -----------------------------------------
  // ADD TO TODAY'S PLAN
  // -----------------------------------------
  const handleAddToPlan = () => {
    const added = addToPlan(fitnessCard);

    if (added) {
      console.log("Added to today's plan");
    } else {
      console.log("Already in today's plan");
    }
  };

  // -----------------------------------------
  // SAVE FOR LATER
  // -----------------------------------------
  const handleSaveForLater = () => {
    const saved = addToSaved(fitnessCard);

    if (saved) {
      console.log("Saved for later");
    } else {
      console.log("Already saved");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111418] text-white shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* IMAGE */}
        <div className="p-4 sm:p-6">
          <div className="relative h-100 overflow-hidden rounded-xl sm:h-137.5 lg:h-162.5">
            <Image
              src={
                fitnessCard.image ||
                "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80"
              }
              alt={fitnessCard.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute left-4 top-4 rounded-full bg-black/50 px-4 py-2 text-xs font-bold backdrop-blur">
              Exercise #{fitnessCard.id}
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col p-4 sm:p-6 lg:p-10">

          {/* NAME */}
          <h1 className="text-3xl font-black uppercase sm:text-4xl">
            {fitnessCard.name}
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-4 text-sm leading-6 text-gray-400">
            {fitnessCard.description}
          </p>

          {/* CATEGORY */}
          <div className="mt-5">
            <span className="rounded-full bg-[#c6ff00] px-4 py-2 text-xs font-bold uppercase text-black">
              {fitnessCard.category || "Fitness"}
            </span>
          </div>

          {/* INFORMATION */}
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#171b20]">

            <Info
              title="Equipment"
              value={fitnessCard.equipment || "Not specified"}
            />

            <Info
              title="Difficulty"
              value={fitnessCard.difficulty || "Intermediate"}
            />

            <Info
              title="Sets"
              value={fitnessCard.sets || 4}
            />

            <Info
              title="Reps"
              value={fitnessCard.reps || "8-12"}
            />

            <Info
              title="Duration"
              value={fitnessCard.duration || "25 min"}
            />

            <Info
              title="Calories"
              value={fitnessCard.calories || "180 kcal"}
            />

            <Info
              title="Rating"
              value={`⭐ ${fitnessCard.rating || 4.8}`}
            />

          </div>

          {/* FITNESS ACTION BUTTONS */}
          <div className="mt-7">
            <FitnessDetailActions
              fitnessId={String(fitnessCard.id)}
              onAddToPlan={handleAddToPlan}
              onSaveForLater={handleSaveForLater}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default FitnessDetailsCard;

/* -------------------------------
   INFORMATION ROW
-------------------------------- */

const Info = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
  return (
    <div className="flex min-h-13.75 items-center justify-between border-b border-white/5 px-4 last:border-0 sm:px-5">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {title}
      </span>

      <span className="text-sm text-gray-200">
        {value}
      </span>
    </div>
  );
};