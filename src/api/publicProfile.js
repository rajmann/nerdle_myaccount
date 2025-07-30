import useSWR from "swr";

export const usePublicProfile = ({ userId }) => {
  const response = useSWR(userId ? `/user/${userId}/profile` : null);
  return response;
};
