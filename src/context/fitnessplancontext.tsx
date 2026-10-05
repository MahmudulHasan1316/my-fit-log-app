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

// const FitnessPlanContext = createContext<
//   FitnessPlanContextType | undefined
// >(undefined);

// export const FitnessPlanProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [plannedIds, setPlannedIds] = useState<string[]>([]);
//   const [savedIds, setSavedIds] = useState<string[]>([]);
//   const [isLoaded, setIsLoaded] = useState(false);

//   // Load data from localStorage after hydration
//   useEffect(() => {
//     const loadStoredData = () => {
//       const storedPlan = localStorage.getItem("fitness-plan");
//       const storedSaved = localStorage.getItem("fitness-saved");

//       if (storedPlan) {
//         setPlannedIds(JSON.parse(storedPlan));
//       }

//       if (storedSaved) {
//         setSavedIds(JSON.parse(storedSaved));
//       }

//       setIsLoaded(true);
//     };

//     queueMicrotask(loadStoredData);
//   }, []);

//   // Save plan to localStorage
//   useEffect(() => {
//     if (!isLoaded) return;

//     localStorage.setItem(
//       "fitness-plan",
//       JSON.stringify(plannedIds)
//     );
//   }, [plannedIds, isLoaded]);

//   // Save saved workouts to localStorage
//   useEffect(() => {
//     if (!isLoaded) return;

//     localStorage.setItem(
//       "fitness-saved",
//       JSON.stringify(savedIds)
//     );
//   }, [savedIds, isLoaded]);

//   // Add workout to today's plan
//   const addToPlan = (id: string) => {
//     setPlannedIds((prev) =>
//       prev.includes(id) ? prev : [...prev, id]
//     );
//   };

//   // Save workout for later
//   const saveForLater = (id: string) => {
//     setSavedIds((prev) =>
//       prev.includes(id) ? prev : [...prev, id]
//     );
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
//     throw new Error(
//       "useFitnessPlan must be used inside FitnessPlanProvider"
//     );
//   }

//   return context;
// };

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type FitnessPlanContextType = {
  planCount: number;
  savedCount: number;
  plannedIds: string[];
  savedIds: string[];
  addToPlan: (id: string) => void;
  removeFromPlan: (id: string) => void;
  saveForLater: (id: string) => void;
  removeFromSaved: (id: string) => void;
};

const FitnessPlanContext = createContext<FitnessPlanContextType | undefined>(
  undefined,
);

type FitnessPlanProviderProps = {
  children: ReactNode;
};

const FitnessPlanProvider = ({ children }: FitnessPlanProviderProps) => {
  // Load planned IDs from localStorage
  const [plannedIds, setPlannedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedPlan = localStorage.getItem("fitness-plan");

    return storedPlan ? JSON.parse(storedPlan) : [];
  });

  // Load saved IDs from localStorage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedSaved = localStorage.getItem("fitness-saved");

    return storedSaved ? JSON.parse(storedSaved) : [];
  });

  // Save planned IDs whenever they change
  useEffect(() => {
    localStorage.setItem("fitness-plan", JSON.stringify(plannedIds));
  }, [plannedIds]);

  // Save saved IDs whenever they change
  useEffect(() => {
    localStorage.setItem("fitness-saved", JSON.stringify(savedIds));
  }, [savedIds]);

  // Add workout to today's plan
  const addToPlan = (id: string) => {
    setPlannedIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds;
      }

      return [...currentIds, id];
    });
  };

  // Remove workout from today's plan
  const removeFromPlan = (id: string) => {
    setPlannedIds((currentIds) => currentIds.filter((item) => item !== id));
  };

  // Save workout for later
  const saveForLater = (id: string) => {
    setSavedIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds;
      }

      return [...currentIds, id];
    });
  };

  // Remove workout from saved list
  const removeFromSaved = (id: string) => {
    setSavedIds((currentIds) => currentIds.filter((item) => item !== id));
  };

  return (
    <FitnessPlanContext.Provider
      value={{
        planCount: plannedIds.length,
        savedCount: savedIds.length,
        plannedIds,
        savedIds,
        addToPlan,
        removeFromPlan,
        saveForLater,
        removeFromSaved,
      }}
    >
      {children}
    </FitnessPlanContext.Provider>
  );
};

export const useFitnessPlan = () => {
  const context = useContext(FitnessPlanContext);

  if (!context) {
    throw new Error("useFitnessPlan must be used inside FitnessPlanProvider");
  }

  return context;
};

export default FitnessPlanProvider;
