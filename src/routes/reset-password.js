import React from "react";

import ResetPasswordForm from "../containers/ResetPassword/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">Create new password</h1>
      <p className="mt-5 text-sm text-gray-400">
        Please input your new password
      </p>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
