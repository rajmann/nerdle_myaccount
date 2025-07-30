import React from "react";

import client from "../lib/client";

export const updateMember = async (payload) => {
  const { memberId, leagueId, body } = payload;
  const response = await client.put(
    `/league/manage?id=${memberId}&league=${leagueId}`,
    body
  );
  return response;
};

export const useUpdateMember = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = async (payload) => {
    try {
      setIsLoading(true);
      const response = await updateMember(payload);
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
