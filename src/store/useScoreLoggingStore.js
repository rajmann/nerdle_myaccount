import create from "zustand";

const useScoreLoggingStore = create((set) => ({
  scoreLoggingEnabled: false,
  setScoreLoggingEnabled: (enabled) => set({ scoreLoggingEnabled: enabled }),
}));

export default useScoreLoggingStore;