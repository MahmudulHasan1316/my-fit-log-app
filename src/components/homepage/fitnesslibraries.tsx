import { FitnessType } from "@/fitness-type";
import React from "react";
import FitnessCard from "./fitnessCard";

const FitnessLibraries = async () => {
  const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
  const fitnessCards = await res.json();

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <h2 className="text-2xl font-bold text-white">THE LIBRARY</h2>

        <p className="mt-2 mb-6 text-sm text-slate-400 sm:text-base">
          Twelve lifts covering every major muscle group.
        </p>
     
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fitnessCards.map((fitnessCard: FitnessType) => (
            <FitnessCard fitnessCard={fitnessCard} key={fitnessCard.id} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default FitnessLibraries;
