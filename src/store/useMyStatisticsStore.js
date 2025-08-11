import create from "zustand";

const useMyStatisticsStore = create((set) => ({
  gameFilter: { label: "All Nerdle Games", value: "allnerdle" },
  setGameFilter: (gameFilter) => set(() => ({ gameFilter })),
  dateFilter: { label: "This week", value: "This week" },
  setDateFilter: (dateFilter) => set(() => ({ dateFilter })),
}));

export default useMyStatisticsStore;
