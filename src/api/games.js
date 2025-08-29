import useSWR, { useSWRConfig } from "swr";

export const useGames = () => {
  // Add cache busting parameter to force fresh data
  const timestamp = Math.floor(Date.now() / 60000); // Update every minute
  const response = useSWR(`/games?t=${timestamp}`);
  return response;
};

export const useRefreshGames = () => {
  const { mutate } = useSWRConfig();
  
  const refresh = () => {
    mutate("/games");
  };
  
  return refresh;
};
