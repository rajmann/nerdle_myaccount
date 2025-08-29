import useSWR, { useSWRConfig } from "swr";

export const useGames = () => {
  const response = useSWR("/games");
  return response;
};

export const useRefreshGames = () => {
  const { mutate } = useSWRConfig();
  
  const refresh = () => {
    mutate("/games");
  };
  
  return refresh;
};
