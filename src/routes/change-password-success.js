import React from "react";

import { ReactComponent as SuccessIcon } from "../assets/icons/success-icon.svg";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";

const ChangePasswordSuccess = () => {
  const auth = useAuth();

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <SuccessIcon />
      <h1 className="mt-8 text-4xl font-semibold text-black">Success</h1>
      <p className="mt-5 text-xl text-gray-400">
        Your password has been changed successfully!
      </p>
      <Button
        onClick={auth.signOut}
        className="mt-8 w-full focus-visible:ring-offset-white"
      >
        <span className="font-semibold text-white">Sign in</span>
      </Button>
    </div>
  );
};

export default ChangePasswordSuccess;
