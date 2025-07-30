import React from "react";

import client from "../lib/client";

export const createLeague = async (payload) => {
  const response = await client.post("/league/create", payload);
  return response;
};

export const useCreateLeague = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = async (payload) => {
    try {
      setIsLoading(true);
      const response = await createLeague(payload);
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
