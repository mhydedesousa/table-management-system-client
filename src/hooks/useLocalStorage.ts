import { useState, useEffect } from "react";

const getLocalStorageValue = (key: string, defaultValue: any) => {
  // getting stored value
  const savedItem = localStorage.getItem(key);
  const initial = savedItem ? JSON.parse(savedItem) : defaultValue;
  return initial;
};
export const useLocalStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() =>
    getLocalStorageValue(key, defaultValue)
  );

  const refresh = () => {
    setValue(getLocalStorageValue(key, defaultValue));
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue, refresh];
};
