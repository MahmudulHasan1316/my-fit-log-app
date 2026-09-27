import FitnessDetailsCard from "@/components/fitnessDetailsCard";
import { FitnessType } from "@/fitness-type";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    fitnessId: string;
  }>;
};

const FitnessCardDetailsPage = async ({ params }: PageProps) => {
  const { fitnessId } = await params;

  const response = await fetch(
    "https://api.abcz.workers.dev/api/fitlog",
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090b0e] px-4 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-black">
            Failed to load workout
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading the fitness data.
          </p>

          <Link
            href="/workouts"
            className="mt-5 inline-flex rounded-lg bg-[#c6ff00] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#d4ff4d]"
          >
            Back to Workouts
          </Link>
        </div>
      </main>
    );
  }

  const data: unknown = await response.json();

  // Make sure the API actually returned an array.
  if (!Array.isArray(data)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090b0e] px-4 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-black">
            Invalid fitness data
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The workout API returned an unexpected response.
          </p>

          <Link
            href="/workouts"
            className="mt-5 inline-flex rounded-lg bg-[#c6ff00] px-5 py-3 text-sm font-bold text-black"
          >
            Back to Workouts
          </Link>
        </div>
      </main>
    );
  }

  const fitnessCards = data as FitnessType[];

  const fitnessCard = fitnessCards.find(
    (card) => String(card.id) === fitnessId,
  );

  if (!fitnessCard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090b0e] px-4 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-2xl font-black">
            Fitness Card Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            We couldn&apos;t find a workout with ID {fitnessId}.
          </p>

          <Link
            href="/workouts"
            className="mt-5 inline-flex rounded-lg bg-[#c6ff00] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#d4ff4d]"
          >
            Back to Workouts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090b0e] px-3 py-6 text-white sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <FitnessDetailsCard fitnessCard={fitnessCard} />
      </div>
    </main>
  );
};

export default FitnessCardDetailsPage;