import create from "zustand";

const useOptionsStore = create(() => ({
  allGamesOption: { label: "All Games", value: "all" },
  dateOptions: [
    { label: "This week", value: "This week" },
    { label: "Last week", value: "Last week" },
    { label: "Previous week", value: "Previous week" },
    { label: "This month", value: "This month" },
    { label: "Last month", value: "Last month" },
    { label: "Previous month", value: "Previous month" },
    { label: "Year to date", value: "Year to date" },
    { label: "All time", value: "All time" },
  ],
  scoringSystems: [
    "All 7 days/week",
    // "Best 6 days/week", 
    // "Best 5 days/week"
  ],
}));

export default useOptionsStore;
