"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

type FitnessCard = {
  id: number;
  name: string;
  description: string;
  image?: string;
  category?: string;
  equipment?: string;
  difficulty?: string;
  sets?: number;
  reps?: string;
  duration?: string;
  calories?: string | number;
  rating?: number;
};

type Props = {
  fitnessCard: FitnessCard;
};

const FitnessDetailsCard = ({ fitnessCard }: Props) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111418] text-white shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* IMAGE */}
        <div className="p-4 sm:p-6">
          <div className="relative h-100 overflow-hidden rounded-xl sm:h-137.5 lg:h-162.5">
            <img
              src={
                fitnessCard.image ||
                "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80"
              }
              alt={fitnessCard.name}
              className="h-full w-full object-cover"
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

            <Info title="Sets" value={fitnessCard.sets || 4} />

            <Info title="Reps" value={fitnessCard.reps || "8-12"} />

            <Info title="Duration" value={fitnessCard.duration || "25 min"} />

            <Info title="Calories" value={fitnessCard.calories || "180 kcal"} />

            <Info title="Rating" value={`⭐ ${fitnessCard.rating || 4.8}`} />
          </div>

          {/* BUTTONS */}
          <>
            <ToastContainer
              position="top-right"
              autoClose={2500}
              theme="dark"
            />

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111418]">
              {/* your card content */}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdded(!isAdded);

                    if (!isAdded) {
                      toast.success("Exercise added to today's plan!");
                    } else {
                      toast.info("Exercise removed from today's plan.");
                    }
                  }}
                  className={`btn flex-1 border-0 ${
                    isAdded ? "bg-white text-black" : "bg-[#c6ff00] text-black"
                  }`}
                >
                  {isAdded ? "Added to today's plan" : "Add to today's plan"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSaved(!isSaved);

                    if (!isSaved) {
                      toast.success("Exercise saved for later!");
                    } else {
                      toast.info("Exercise removed from saved items.");
                    }
                  }}
                  className="btn border-white/10 bg-transparent text-white"
                >
                  {isSaved ? "✓ Saved" : " Save for later"}
                </button>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default FitnessDetailsCard;

/* -------------------------------
   INFORMATION ROW
-------------------------------- */

const Info = ({ title, value }: { title: string; value: string | number }) => {
  return (
    <div className="flex min-h-13.75 items-center justify-between border-b border-white/5 px-4 last:border-0 sm:px-5">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {title}
      </span>

      <span className="text-sm text-gray-200">{value}</span>
    </div>
  );
};
