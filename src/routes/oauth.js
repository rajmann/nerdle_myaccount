import React from "react";

import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";

import OAuthAuthorizeDialog from "../containers/OAuth/OAuthAuthorizeDialog";
import useAuth from "../hooks/useAuth";
import useOAuthParamsStore from "../store/useOAuthParamsStore";

let toastPosted = false;
const OAuth = () => {
  const params = useParams();
  const { token } = useAuth();
  const { setOAuthParams } = useOAuthParamsStore();

  React.useEffect(() => {
    if (!token) {
      if (!toastPosted) toast.error("Log in first to authorize the App.");
      toastPosted = true;
      setOAuthParams(params?.client_id, params?.redirect_uri);
      localStorage.setItem("clientID", params?.client_id);
      localStorage.setItem("redirectURI", params?.redirect_uri);
      //console.log("REDIRECT URL SAVED.");
    }
  }, [params?.client_id, params?.redirect_uri, setOAuthParams, token]);

  if (!token) {
    return <Navigate to="../" />;
  }

  return (
    <div className="grid h-full place-items-center">
      <OAuthAuthorizeDialog
        open={true}
        clientID={params?.client_id}
        redirectURI={params?.redirect_uri}
      />
    </div>
  );
};

export default OAuth;
