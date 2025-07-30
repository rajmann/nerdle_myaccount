import create from "zustand";

const useMyLeaguesStore = create((set) => ({
  gameFilter: { label: "All Games", value: "all" },
  setGameFilter: (gameFilter) => set(() => ({ gameFilter })),
  dateFilter: { label: "This week", value: "This week" },
  setDateFilter: (dateFilter) => set(() => ({ dateFilter })),
}));

export default useMyLeaguesStore;
