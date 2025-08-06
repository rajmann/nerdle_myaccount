import create from "zustand";

const useScoreLoggingStore = create((set) => ({
  scoreLoggingEnabled: (() => {
    try {
      const stored = localStorage.getItem("accountShowNonNerdle");
      return stored === "true";
    } catch {
      return false;
    }
  })(),
  setScoreLoggingEnabled: (enabled) => {
    try {
      localStorage.setItem("accountShowNonNerdle", enabled.toString());
    } catch (error) {
      console.warn("Failed to save score logging preference to localStorage:", error);
    }
    set({ scoreLoggingEnabled: enabled });
  },
}));

export default useScoreLoggingStore;