// 




"use client";

import Image from "next/image";
import Link from "next/link";

import {
  CalendarCheck,
  Bookmark,
  Clock3,
  Flame,
  Star,
} from "lucide-react";

import { FitnessType } from "@/fitness-type";

import { useFitnessPlan } from "@/context/fitnessplancontext";

interface FitnessDetailsProps {
  workout: FitnessType;
}

export default function FitnessDetails({
  workout,
}: FitnessDetailsProps) {
  const {
    addToPlan,
    saveForLater,
  } = useFitnessPlan();

  return (
    <section className="min-h-screen bg-[#0d0f12] px-4 py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1.05fr]">

        {/* ========================= */}
        {/* LEFT IMAGE */}
        {/* ========================= */}

        <div className="relative min-h-\[450px\] overflow-hidden rounded-xl lg:min-h-162.5">
          <Image
            src={workout.image}
            alt={workout.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        {/* ========================= */}
        {/* RIGHT CONTENT */}
        {/* ========================= */}

        <div className="flex flex-col">

          {/* Title */}
          <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            {workout.name}
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            {workout.description}
          </p>

          {/* Muscle groups */}
          <div className="mt-4 flex flex-wrap gap-2">
            {workout.muscleGroups.map((muscle) => (
              <span
                key={muscle}
                className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black"
              >
                {muscle}
              </span>
            ))}
          </div>

          {/* ========================= */}
          {/* SPECS */}
          {/* ========================= */}

          <div className="mt-5 overflow-hidden rounded-xl border border-zinc-800 bg-[#15171b]">

            <SpecRow
              label="EQUIPMENT"
              value={workout.equipment}
            />

            <SpecRow
              label="DIFFICULTY"
              value={workout.difficulty}
            />

            <SpecRow
              label="SETS"
              value={String(workout.sets)}
            />

            <SpecRow
              label="REPS"
              value={workout.reps}
            />

            <SpecRow
              label="DURATION"
              value={`${workout.duration} min`}
            />

            <SpecRow
              label="CALORIES"
              value={`${workout.caloriesBurned} kcal`}
            />

            <SpecRow
              label="RATING"
              value={String(workout.rating)}
              last
            />

          </div>

          {/* ========================= */}
          {/* INSTRUCTIONS */}
          {/* ========================= */}

          <div className="mt-6">
            <h2 className="text-sm font-bold tracking-wide text-white">
              INSTRUCTIONS
            </h2>

            <ol className="mt-3 space-y-3">
              {workout.instructions.map(
                (instruction, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-5 text-zinc-400"
                  >
                    <span className="text-zinc-500">
                      {index + 1}.
                    </span>

                    <span>{instruction}</span>
                  </li>
                )
              )}
            </ol>
          </div>

          {/* ========================= */}
          {/* BUTTONS */}
          {/* ========================= */}

          <div className="mt-7 flex flex-wrap gap-3">

            <button
              onClick={() => addToPlan(String(workout.id))}
              className="flex items-center gap-2 rounded-lg bg-lime-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
            >
              <CalendarCheck size={16} />

              Add to today&apos;s plan
            </button>

            <button
              onClick={() => saveForLater(String(workout.id))}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm text-zinc-200 transition hover:border-lime-400 hover:text-lime-400"
            >
              <Bookmark size={16} />

              Save for later
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

/* ========================= */
/* SPEC ROW COMPONENT */
/* ========================= */

function SpecRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        !last ? "border-b border-zinc-800" : ""
      }`}
    >
      <span className="text-[10px] font-medium tracking-wider text-zinc-500">
        {label}
      </span>

      <span className="text-xs text-zinc-200">
        {value}
      </span>
    </div>
  );
}