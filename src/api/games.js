import useSWR from "swr";

export const useGames = () => {
  const response = useSWR("/games");
  return response;
};
