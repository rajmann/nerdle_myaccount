import React from "react";

import client from "../lib/client";

export const createAuthCode = async (clientID, redirectURI) => {
  const finalURL = `/client/${clientID}/${encodeURIComponent(redirectURI)}/createAuthCode`;
  const response = await client.get(finalURL);
  return response;
};

export const useCreateAuthCode = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = React.useCallback(async (clientID, redirectURI) => {
    try {
      setIsLoading(true);
      const response = await createAuthCode(clientID, redirectURI);
      setData(response);
      return response;
    } catch (e) {
      setIsLoading(false);
      setError(e);
      throw e;
    } finally {
      //setIsLoading(false);
    }
  }, []);

  return { isLoading, error, data, execute };
};
