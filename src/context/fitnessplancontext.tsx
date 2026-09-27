// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";

// interface FitnessPlanContextType {
//   plannedIds: string[];
//   savedIds: string[];
//   addToPlan: (id: string) => void;
//   saveForLater: (id: string) => void;
// }

// const FitnessPlanContext = createContext<FitnessPlanContextType | undefined>(
//   undefined,
// );

// export const FitnessPlanProvider = ({ children }: { children: ReactNode }) => {
//   // Load plan from localStorage when state is initialized
//   const [plannedIds, setPlannedIds] = useState<string[]>(() => {
//     if (typeof window === "undefined") {
//       return [];
//     }

//     const storedPlan = localStorage.getItem("fitness-plan");

//     return storedPlan ? JSON.parse(storedPlan) : [];
//   });

//   // Load saved workouts from localStorage when state is initialized
//   const [savedIds, setSavedIds] = useState<string[]>(() => {
//     if (typeof window === "undefined") {
//       return [];
//     }

//     const storedSaved = localStorage.getItem("fitness-saved");

//     return storedSaved ? JSON.parse(storedSaved) : [];
//   });

//   // Save plan whenever plannedIds changes
//   useEffect(() => {
//     localStorage.setItem("fitness-plan", JSON.stringify(plannedIds));
//   }, [plannedIds]);

//   // Save workouts whenever savedIds changes
//   useEffect(() => {
//     localStorage.setItem("fitness-saved", JSON.stringify(savedIds));
//   }, [savedIds]);

//   // Add workout to today's plan
//   const addToPlan = (id: string) => {
//     setPlannedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
//   };

//   // Save workout for later
//   const saveForLater = (id: string) => {
//     setSavedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
//   };

//   return (
//     <FitnessPlanContext.Provider
//       value={{
//         plannedIds,
//         savedIds,
//         addToPlan,
//         saveForLater,
//       }}
//     >
//       {children}
//     </FitnessPlanContext.Provider>
//   );
// };

// // Custom hook
// export const useFitnessPlan = () => {
//   const context = useContext(FitnessPlanContext);

//   if (!context) {
//     throw new Error("useFitnessPlan must be used inside FitnessPlanProvider");
//   }

//   return context;
// };



"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface FitnessPlanContextType {
  plannedIds: string[];
  savedIds: string[];
  addToPlan: (id: string) => void;
  saveForLater: (id: string) => void;
}

const FitnessPlanContext = createContext<
  FitnessPlanContextType | undefined
>(undefined);

export const FitnessPlanProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [plannedIds, setPlannedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage after hydration
  useEffect(() => {
    const loadStoredData = () => {
      const storedPlan = localStorage.getItem("fitness-plan");
      const storedSaved = localStorage.getItem("fitness-saved");

      if (storedPlan) {
        setPlannedIds(JSON.parse(storedPlan));
      }

      if (storedSaved) {
        setSavedIds(JSON.parse(storedSaved));
      }

      setIsLoaded(true);
    };

    queueMicrotask(loadStoredData);
  }, []);

  // Save plan to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "fitness-plan",
      JSON.stringify(plannedIds)
    );
  }, [plannedIds, isLoaded]);

  // Save saved workouts to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "fitness-saved",
      JSON.stringify(savedIds)
    );
  }, [savedIds, isLoaded]);

  // Add workout to today's plan
  const addToPlan = (id: string) => {
    setPlannedIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  // Save workout for later
  const saveForLater = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  return (
    <FitnessPlanContext.Provider
      value={{
        plannedIds,
        savedIds,
        addToPlan,
        saveForLater,
      }}
    >
      {children}
    </FitnessPlanContext.Provider>
  );
};

// Custom hook
export const useFitnessPlan = () => {
  const context = useContext(FitnessPlanContext);

  if (!context) {
    throw new Error(
      "useFitnessPlan must be used inside FitnessPlanProvider"
    );
  }

  return context;
};