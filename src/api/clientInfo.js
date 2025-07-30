import useSWR from "swr";

export const useClientInfo = (clientID) => {
  const params = new URLSearchParams();
  params.append("client_id", clientID);
  const queryString = params.toString();
  const response = useSWR(`/client?${queryString}`);
  return response;
};
