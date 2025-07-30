import React from "react";

import client from "../lib/client";

export const resetPassword = async (payload, token) => {
  const response = await client.put(`league/reset-password/${token}`, payload);
  return response;
};

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = React.useCallback(async (payload, token) => {
    try {
      setIsLoading(true);
      const response = await resetPassword(payload, token);
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
