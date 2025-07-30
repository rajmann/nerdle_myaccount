import React from "react";

import client from "../lib/client";

export const updateMarketingPreferences = async (payload) => {
  const response = await client.put("/user/updateMarketingPreferences", payload);
  return response;
};

export const useUpdateMarketingPreferences = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = async (payload) => {
    try {
      setIsLoading(true);
      const response = await updateMarketingPreferences(payload);
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
