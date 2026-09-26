import FitnessDetailsCard from "@/components/fitnessDetailsCard";

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

const FitnessCardDetailsPage = async ({
  params,
}: {
  params: Promise<{ fitnessId: string }>;
}) => {
  const { fitnessId } = await params;

  const response = await fetch("https://api.abcz.workers.dev/api/fitlog", {
    cache: "no-store",
  });

  const fitnessCards: FitnessCard[] = await response.json();

  const fitnessCard = fitnessCards.find(
    (card) => card.id === Number(fitnessId),
  );

  if (!fitnessCard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <h1 className="text-2xl font-bold text-white">
          Fitness Card Not Found
        </h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#090b0e] p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <FitnessDetailsCard fitnessCard={fitnessCard} />
      </div>
    </main>
  );
};

export default FitnessCardDetailsPage;
