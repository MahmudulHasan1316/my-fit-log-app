const FitnessCardDetailsPage = async ({
  params,
}: {
  params: Promise<{ fitnessId: string }>;
}) => {
  const { fitnessId } = await params;

  const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
  const fitnessCardDetails = await res.json();

  const fitnessCard = fitnessCardDetails.find(
    (fitnessCard: { id: number }) => fitnessCard.id === parseInt(fitnessId),
  );

  return (
    <div>
      <h2>This is Fitness Card Details Page</h2>

      <p>Post ID: {fitnessId}</p>

      <h3>{fitnessCard ?.name}</h3>

      <p>{fitnessCard ?.description}</p>
    </div>
  );
};

export default FitnessCardDetailsPage;
