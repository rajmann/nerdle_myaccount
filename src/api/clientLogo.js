import useSWR from "swr";

import client from "../lib/client";

export const useClientLogo = (clientID) => {
  const response = useSWR(`/client/${clientID}/logo`, (url) =>
    client
      .get(url, { responseType: "blob", headers: { Accept: "image/*" } })
      .then((res) => URL.createObjectURL(res.data))
  );
  return response;
};
