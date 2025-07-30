import useSWR from "swr";

import client from "../lib/client";

export const useProfilePhoto = () => {
  const response = useSWR("/user/profile/photo", (url) =>
    client
      .get(url, { responseType: "blob", headers: { Accept: "image/*" } })
      .then((res) => URL.createObjectURL(res.data))
  );
  return response;
};
