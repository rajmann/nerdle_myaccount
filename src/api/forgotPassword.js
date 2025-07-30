import React from "react";

import client from "../lib/client";

export const forgotPassword = async (payload) => {
  const response = await client.post("league/forgot-password", payload);
  return response;
};

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = React.useCallback(async (payload) => {
    try {
      setIsLoading(true);
      const response = await forgotPassword(payload);
      setData(response);
      return response;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, data, execute };
};
