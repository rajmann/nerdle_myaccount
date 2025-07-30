import React from "react";

import client from "../lib/client";

export const deleteLeague = async ({ id }) => {
  const params = new URLSearchParams();
  params.append("id", id);
  const queryParams = params.toString();
  const response = await client.delete(`/league/remove?${queryParams}`);
  return response;
};

export const useDeleteLeague = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = async (payload) => {
    try {
      setIsLoading(true);
      const response = await deleteLeague(payload);
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
