import useSWR from "swr";

export const useGames = () => {
  const response = useSWR("/games");
  return response;
};

export const useRefreshGames = () => {
  const { mutate } = useSWR("/games");
  
  const refresh = () => {
    mutate();
  };
  
  return refresh;
};
