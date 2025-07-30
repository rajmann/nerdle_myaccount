import React from "react";

import client from "../lib/client";

export const updateLeague = async (payload) => {
  const { leagueId, body } = payload;
  const response = await client.put(`/league/update?id=${leagueId}`, body);
  return response;
};

export const useUpdateLeague = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = async (payload) => {
    try {
      setIsLoading(true);
      const response = await updateLeague(payload);
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
