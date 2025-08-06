import React from "react";

import { Navigate } from "react-router-dom";

import SignUpForm from "../containers/SignUp/SignUpForm";
import useAuth from "../hooks/useAuth";

const SignUp = () => {
  const auth = useAuth();

  if (auth.token) {
    return <Navigate to="/" replace />;
  }

  return (
    //<div className="flex h-full flex-col justify-center"> //FIX FOR SCROLL
    <div className="flex flex-col justify-center">
      <h1 className="text-center text-3xl font-semibold text-black dark:text-white">
        Create an account.
      </h1>
      <SignUpForm />
    </div>
  );
};

export default SignUp;
