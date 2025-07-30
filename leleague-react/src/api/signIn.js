import React from "react";

import client from "../lib/client";

export const signIn = async (payload) => {
  const response = await client.post("/login", payload);
  return response;
};

export const useSignIn = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = React.useCallback(async (payload) => {
    try {
      setIsLoading(true);
      const response = await signIn(payload);
      setData(response);
      return response;
    } catch (e) {
      setIsLoading(false);
      setError(e);
      throw e;
    } finally {
    }
  }, []);

  return { isLoading, error, data, execute };
};
