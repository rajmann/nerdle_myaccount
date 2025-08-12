import React, { useState } from "react";

import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useClientInfo } from "../../api/clientInfo";
import { useClientLogo } from "../../api/clientLogo";
import { useCreateAuthCode } from "../../api/createAuthCode";
import BaseDialog from "../../components/BaseDialog";
import Button from "../../components/Button";
import LogoMain from "../../components/LogoMain";
import Spinner from "../../components/Spinner";
import useOAuthParamsStore from "../../store/useOAuthParamsStore";

const OAuthAuthorizeDialog = ({ open, clientID, redirectURI }) => {
  const navigate = useNavigate();
  const clientData = useClientInfo(clientID);
  const { data: logo, error: errorLoadingLogo } = useClientLogo(clientID);
  const [theLogo, setTheLogo] = useState(null);
  if (errorLoadingLogo) console.log("errorLoadingLogo");

  const [clientInfo, setClientInfo] = useState({
    name: "",
    icon: "",
    secret_key: "",
  });
  const [checkingClient, setCheckingClient] = useState(true);

  const { clearOAuthParams } = useOAuthParamsStore();
  const { execute, isLoading } = useCreateAuthCode();

  const closeDialog = React.useCallback(() => {
    clearOAuthParams();
    navigate("../");
  }, [clearOAuthParams, navigate]);

  const getClientInfo = async (clientID) => {
    //console.log('CLIENT INFO');
    //console.log(clientInfo);
  };

  React.useEffect(() => {
    getClientInfo(clientID);
    setTheLogo(logo);
    if (clientData.data === undefined) return;
    if (clientData.data.hasOwnProperty("error")) {
      toast.error("Invalid client app.");
      clearOAuthParams();
      navigate("../");
    } else {
      setClientInfo(clientData.data.clientInfo);
      setCheckingClient(false);
    }
  }, [clientID, clientData.data, navigate, clearOAuthParams, logo]);

  const getAuthCode = React.useCallback(
    async (data) => {
      try {
        const response = await execute(clientID, redirectURI);

        if(response.data.error)
        {
          const errorMessage = response.data.message;
          toast.error(errorMessage);
          navigate("../");
          return;
        }

        clearOAuthParams();
        //navigate(`../my-leagues/${data.code}`);

        const finalURL = `${redirectURI}?authCode=${response.data.authCode}`;
        window.open(finalURL, "_self");
      } catch (error) {
        toast.error(error.message);
      }
    },
    [execute, clearOAuthParams, clientID, redirectURI, navigate]
  );

  return (
    <BaseDialog open={open} closeDialog={closeDialog} className="z-21">
      <div className="flex-1">
        <div className="ht-24 flex items-center justify-end">
          <button
            className="rounded-full p-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            onClick={closeDialog}>
            <MdClose className="h-5 w-5" />
          </button>
        </div>
        {checkingClient === true ? (
          <div className="flex h-screen items-center justify-center">
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <LogoMain className="w-1/2" />
              <Spinner />
              <p className="text-gray-400">Checking...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 flex h-24 justify-center">
              {theLogo != null && (
                <img
                  className="h-24 w-24 object-contain"
                  src={theLogo}
                  alt="logo"
                />
              )}
            </div>
            <div className="mx-10 mt-3 flex flex-1 flex-col ">
              <h1 className="text-center text-xl font-semibold text-black dark:text-white">
                <span className="text-violet-500">{`${clientInfo.name}`}</span>{" "}
                wants to connect to your Nerdle League account
              </h1>
              <h3 className="mt-10 mb-3 font-semibold text-black dark:text-white">
                This will allow{" "}
                <span className="text-violet-500">{`${clientInfo.name}`}</span>{" "}
                to:
              </h3>
              <ol className="mb-10 list-disc">
                <li className="text-xs text-black dark:text-white">
                  Access your name, email and profile photo
                </li>
                <li className="text-xs text-black dark:text-white">
                  Add scores to Nerdle League using this account.
                </li>
              </ol>

              {isLoading ? (
                <Button
                  className="mt-5 focus-visible:ring-offset-dialog"
                  disabled>
                  <Spinner />
                  Authorizing app...
                </Button>
              ) : (
                <>
                  <Button
                    className="mt-5 focus-visible:ring-offset-dialog"
                    onClick={getAuthCode}>
                    Continue
                  </Button>

                  <Button
                    className="mt-5 bg-gray-500 hover:bg-gray-500 focus-visible:ring-gray-500 focus-visible:ring-offset-dialog"
                    onClick={closeDialog}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </BaseDialog>
  );
};

export default OAuthAuthorizeDialog;
