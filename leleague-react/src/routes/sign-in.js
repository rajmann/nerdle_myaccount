import React from "react";

import { Navigate } from "react-router-dom";

import SignInForm from "../containers/SignIn/SignInForm";
import useAuth from "../hooks/useAuth";

const SignIn = () => {
  const auth = useAuth();

  if (auth.token) {
    return <Navigate to="/" replace />;
  }

  return (
    //<div className="flex h-full flex-col justify-center">  //FIX FOR SCROLL
    <div className="flex flex-col justify-center">
      <h1 className="text-center text-3xl font-semibold text-black">Sign in</h1>
      <SignInForm />
    </div>
  );
};

export default SignIn;
