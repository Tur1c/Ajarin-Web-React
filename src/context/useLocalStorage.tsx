import { useState } from "react";

export const useSessionStorage = (keyName: string, defaultValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.sessionStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.sessionStorage.setItem(keyName, defaultValue);
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue: any) => {
    try {
      window.sessionStorage.setItem(keyName, newValue);
    } catch (err) {
      // console.log(err);
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};