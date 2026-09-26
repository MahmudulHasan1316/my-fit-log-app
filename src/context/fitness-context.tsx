// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";

// import { FitnessType } from "@/fitness-type";

// interface FitnessContextType {
//   plan: FitnessType[];
//   saved: FitnessType[];

//   addToPlan: (fitness: FitnessType) => void;
//   removeFromPlan: (id: string | number) => void;

//   saveForLater: (fitness: FitnessType) => void;
//   removeFromSaved: (id: string | number) => void;

//   isInPlan: (id: string | number) => boolean;
//   isSaved: (id: string | number) => boolean;
// }

// const FitnessContext = createContext<FitnessContextType | null>(
//   null
// );

// function getStoredItems(key: string): FitnessType[] {
//   if (typeof window === "undefined") {
//     return [];
//   }

//   try {
//     const stored = localStorage.getItem(key);

//     if (!stored) {
//       return [];
//     }

//     return JSON.parse(stored) as FitnessType[];
//   } catch (error) {
//     console.error(`Failed to read ${key}:`, error);
//     return [];
//   }
// }

// export function FitnessProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [plan, setPlan] = useState<FitnessType[]>(
//     () => getStoredItems("fitness-plan")
//   );

//   const [saved, setSaved] = useState<FitnessType[]>(
//     () => getStoredItems("fitness-saved")
//   );

  
//   useEffect(() => {
//     localStorage.setItem(
//       "fitness-plan",
//       JSON.stringify(plan)
//     );
//   }, [plan]);

//   useEffect(() => {
//     localStorage.setItem(
//       "fitness-saved",
//       JSON.stringify(saved)
//     );
//   }, [saved]);

//   const addToPlan = (fitness: FitnessType) => {
//     setPlan((current) => {
//       const alreadyAdded = current.some(
//         (item) => item.id === fitness.id
//       );

//       if (alreadyAdded) {
//         return current;
//       }

//       return [...current, fitness];
//     });
//   };

//   const removeFromPlan = (id: string | number) => {
//     setPlan((current) =>
//       current.filter((item) => item.id !== id)
//     );
//   };

//   const saveForLater = (fitness: FitnessType) => {
//     setSaved((current) => {
//       const alreadySaved = current.some(
//         (item) => item.id === fitness.id
//       );

//       if (alreadySaved) {
//         return current;
//       }

//       return [...current, fitness];
//     });
//   };

//   const removeFromSaved = (id: string | number) => {
//     setSaved((current) =>
//       current.filter((item) => item.id !== id)
//     );
//   };

//   const isInPlan = (id: string | number) => {
//     return plan.some((item) => item.id === id);
//   };

//   const isSaved = (id: string | number) => {
//     return saved.some((item) => item.id === id);
//   };

//   return (
//     <FitnessContext.Provider
//       value={{
//         plan,
//         saved,
//         addToPlan,
//         removeFromPlan,
//         saveForLater,
//         removeFromSaved,
//         isInPlan,
//         isSaved,
//       }}
//     >
//       {children}
//     </FitnessContext.Provider>
//   );
// }

// export function useFitness() {
//   const context = useContext(FitnessContext);

//   if (!context) {
//     throw new Error(
//       "useFitness must be used inside FitnessProvider"
//     );
//   }

//   return context;
// }
