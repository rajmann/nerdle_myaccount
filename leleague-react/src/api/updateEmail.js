import React from "react";

import client from "../lib/client";

export const updateEmail = async (payload) => {
  const response = await client.put("/user/profile/email", payload);
  return response;
};

export const useUpdateEmail = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = async (payload) => {
    try {
      setIsLoading(true);
      const response = await updateEmail(payload);
      setData(response);
      return response;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, execute };
};
