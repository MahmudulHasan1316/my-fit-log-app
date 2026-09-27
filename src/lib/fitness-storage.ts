import { FitnessType } from "@/fitness-type";

export const PLAN_STORAGE_KEY = "fitlog-plan";
export const SAVED_STORAGE_KEY = "fitlog-saved";

export const PLAN_UPDATED_EVENT = "fitlog-plan-updated";

const getBrowserStorage = (key: string): FitnessType[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to read ${key}:`, error);
    return [];
  }
};

export const getPlan = (): FitnessType[] => {
  return getBrowserStorage(PLAN_STORAGE_KEY);
};

export const getSaved = (): FitnessType[] => {
  return getBrowserStorage(SAVED_STORAGE_KEY);
};

const saveBrowserStorage = (
  key: string,
  exercises: FitnessType[],
) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(exercises));

    window.dispatchEvent(
      new CustomEvent(PLAN_UPDATED_EVENT),
    );
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
};

export const addToPlan = (exercise: FitnessType) => {
  const currentPlan = getPlan();

  const alreadyExists = currentPlan.some(
    (item) => item.id === exercise.id,
  );

  if (alreadyExists) {
    return false;
  }

  saveBrowserStorage(PLAN_STORAGE_KEY, [
    ...currentPlan,
    exercise,
  ]);

  return true;
};

export const addToSaved = (exercise: FitnessType) => {
  const currentSaved = getSaved();

  const alreadyExists = currentSaved.some(
    (item) => item.id === exercise.id,
  );

  if (alreadyExists) {
    return false;
  }

  saveBrowserStorage(SAVED_STORAGE_KEY, [
    ...currentSaved,
    exercise,
  ]);

  return true;
};

export const removeFromPlan = (id: number) => {
  const currentPlan = getPlan();

  saveBrowserStorage(
    PLAN_STORAGE_KEY,
    currentPlan.filter((item) => item.id !== id),
  );
};

export const removeFromSaved = (id: number) => {
  const currentSaved = getSaved();

  saveBrowserStorage(
    SAVED_STORAGE_KEY,
    currentSaved.filter((item) => item.id !== id),
  );
};

export const updatePlan = (exercises: FitnessType[]) => {
  saveBrowserStorage(PLAN_STORAGE_KEY, exercises);
};