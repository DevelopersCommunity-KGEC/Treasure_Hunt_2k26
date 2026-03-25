"use client";

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getLocalStorageItem<T>(key: string): T | null {
  if (!isClient()) return null;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function setLocalStorageItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function removeLocalStorageItem(key: string): void {
  // const setStoreState = useTreasureHuntStore((store) => store.setStoreState);

  if (!isClient()) return;
  localStorage.removeItem(key);
  // setStoreState({
  //   teamId: "",
  // });
}

export const getTeamId = () => {
  const storedData = localStorage.getItem('treasure-hunt-storage');
  if (!storedData) return null;

  try {
    const parsedData = JSON.parse(storedData);
    return parsedData.state?.teamId || null;
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    return null;
  }
};

export const localStorageUtil = {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  getTeamId
};
