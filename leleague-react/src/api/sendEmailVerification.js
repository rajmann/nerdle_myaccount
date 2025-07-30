import React from "react";

import client from "../lib/client";

export const sendEmailVerification = async (payload) => {
  const response = await client.post("league/send-email-verification/", payload);
  return response;
};

export const useSendEmail = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const execute = React.useCallback(async (payload) => {
    try {
      setIsLoading(true);
      const response = await sendEmailVerification(payload);
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