import React from "react";

import ChangePasswordForm from "../containers/ChangePassword/ChangePasswordForm";

const ChangePassword = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-black">Create new password</h1>
      <p className="mt-5 text-sm text-gray-400">
        Your new password must be different from previous password.
      </p>
      <ChangePasswordForm />
    </div>
  );
};

export default ChangePassword;
