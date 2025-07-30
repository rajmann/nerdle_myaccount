import create from "zustand";

export const dialogStates = {
  closed: "closed",
  adding: "adding",
  added: "added",
  overwrite: "overwrite",
};

const useAddScoreStore = create((set) => ({
  dialogState: dialogStates.closed,
  setDialogState: (dialogState) => set(() => ({ dialogState })),
  score: null,
  setScore: (score) => set(() => ({ score })),
}));

export default useAddScoreStore;
