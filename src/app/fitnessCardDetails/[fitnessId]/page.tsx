import { notFound } from "next/navigation";



import { FitnessType } from "@/fitness-type";
import FitnessDetails from "@/components/fitnessDetailsCard";

interface PageProps {
  params: Promise<{
    fitnessId: string;
  }>;
}

export default async function FitnessCardDetailsPage({
  params,
}: PageProps) {
  const { fitnessId } = await params;

  const response = await fetch(
    "https://api.abcz.workers.dev/api/fitlog",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch workouts");
  }

  const fitnessCards: FitnessType[] =
    await response.json();

  const workout = fitnessCards.find(
    (fitness) =>
      fitness.id === Number(fitnessId)
  );

  if (!workout) {
    notFound();
  }

  return <FitnessDetails workout={workout} />;
}