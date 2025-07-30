import create from "zustand";

const useLeagueCodeStore = create((set) => ({
  leagueCode: null,
  setLeagueCode: (leagueCode) => set(() => ({ leagueCode })),
  clearLeagueCode: () => set(() => ({ leagueCode: null })),
}));

export default useLeagueCodeStore;
