import Image from "next/image";
import { Clock3, Flame, Star } from "lucide-react";
import { FitnessType } from "@/fitness-type";

interface FitnessCardProps {
  fitnessCard: FitnessType;
}

export default function FitnessCard({ fitnessCard: fitnessCard }: FitnessCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/5 bg-[#15171b] transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/40 hover:shadow-2xl">

      {/* ===> Image <=== */}
      <div className="relative aspect-[1.95/1] overflow-hidden">
        <Image
          src={fitnessCard.image}
          alt={fitnessCard.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* ===> Content <=== */}
      <div className="p-3 sm:p-4">

        {/* ===> Muscle groups <=== */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {fitnessCard.muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="rounded-full bg-lime-400 px-2.5 py-1 text-[8px] font-black uppercase text-black"
            >
              {muscle}
            </span>
          ))}
        </div>

        {/* ===> Name <=== */}
        <h2 className="text-xs font-black uppercase tracking-wide text-white">
          {fitnessCard.name}
        </h2>

        {/* ===> Equipment <=== */}
        <p className="mt-1 text-[10px] text-zinc-500">
          {fitnessCard.equipment}
        </p>

        {/* ===> Divider <=== */}
        <div className="my-3 h-px bg-white/5" />

        {/* ===> Information <=== */}
        <div className="flex items-center justify-between text-[9px] text-zinc-400 sm:text-[10px]">

          <span className="flex items-center gap-1">
            <Clock3 className="size-3" />
            {fitnessCard.duration} min
          </span>

          <span className="flex items-center gap-1">
            <Flame className="size-3 text-orange-400" />
            {fitnessCard.caloriesBurned} kcal
          </span>

          <span className="flex items-center gap-1">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {fitnessCard.rating}
          </span>

        </div>
      </div>
    </article>
  );
}
