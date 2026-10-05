"use client";

import { useFitnessPlan } from "@/context/fitnessplancontext";
import { BookmarkPlus, CalendarPlus } from "lucide-react";
import { toast } from "react-toastify";

type FitnessDetailActionsProps = {
  fitnessId: string;
  onAddToPlan: () => void;
  onSaveForLater: () => void;
};

const FitnessDetailActions = ({ fitnessId }: FitnessDetailActionsProps) => {
  const { plannedIds, savedIds, addToPlan, saveForLater } = useFitnessPlan();

  const isPlanned = plannedIds.includes(fitnessId);
  const isSaved = savedIds.includes(fitnessId);

  const handleAddToPlan = () => {
    if (isPlanned) {
      toast.info("Exercise is already in today's plan!");
      return;
    }

    addToPlan(fitnessId);
    toast.success("Exercise added to today's plan!");
  };

  const handleSaveForLater = () => {
    if (isSaved) {
      toast.info("Exercise is already saved!");
      return;
    }

    saveForLater(fitnessId);
    toast.success("Exercise saved for later!");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Add to Today's Plan */}

      <button
        type="button"
        onClick={handleAddToPlan}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
          isPlanned
            ? "bg-[#c9cac4] text-black hover:bg-lime-200"
            : "bg-lime-400 text-black hover:bg-white"
        }`}
      >
        <CalendarPlus size={20} />
        {isPlanned ? "Added to Today's Plan" : "Add to Today's Plan"}
      </button>

      <button
        type="button"
        onClick={handleSaveForLater}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
          isSaved
            ? "bg-lime-400 text-black hover:bg-green-200"
            : "border border-white/20 bg-transparent text-white hover:bg-white/10"
        }`}
      >
        <BookmarkPlus size={20} />
        {isSaved ? "Saved" : "Save for Later"}
      </button>
    </div>
  );
};

export default FitnessDetailActions;
