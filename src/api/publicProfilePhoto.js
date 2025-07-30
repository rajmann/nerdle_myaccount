import useSWR from "swr";

import client from "../lib/client";

export const usePublicProfilePhoto = ({ userId }) => {
  const response = useSWR(
    userId ? `/user/${userId}/profile/photo` : null,
    (url) =>
      client
        .get(url, { responseType: "blob", headers: { Accept: "image/*" } })
        .then((res) => URL.createObjectURL(res.data))
  );
  return response;
};
