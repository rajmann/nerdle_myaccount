import React from "react";

import ForgotPasswordForm from "../containers/ForgotPassword/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-xl font-semibold text-black dark:text-white">Forgot password?</h1>
      <p className="mt-5 text-sm text-gray-400">
        Enter your email below and we will send you a reset email.
      </p>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
