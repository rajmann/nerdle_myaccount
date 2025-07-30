import React from "react";

import client from "../lib/client";

export const deleteMember = async ({ SK, ID }) => {
  const params = new URLSearchParams();
  params.append("ID", ID);
  params.append("SK", SK);
  const queryParams = params.toString();
  const response = await client.delete(`/league/member?${queryParams}`);
  return response;
};

export const useDeleteMember = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);
  const execute = React.useCallback(async (payload) => {
    try {
      setIsLoading(true);
      const response = await deleteMember(payload);
      setData(response);
      return response;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [])

  return { isLoading, error, data, execute };
};
