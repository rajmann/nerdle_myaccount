import useSWR from "swr";

export const useProfile = () => {
  const response = useSWR("/user/profile");
  return response;
};
