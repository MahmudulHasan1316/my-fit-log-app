import Banner from "@/components/homepage/banner";
import FitnessLibraries from "@/components/homepage/fitnesslibraries";
import { Suspense } from "react";

const WorkoutsPage = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Banner/>
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <FitnessLibraries/>
      </Suspense>
    </div>
  );
};

export default WorkoutsPage;
