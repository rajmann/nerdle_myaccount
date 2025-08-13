import React from "react";

import { Navigate } from "react-router-dom";

import Header from "../components/Header";
import NerdleMenuIcon from "../components/icons/NerdleMenuIcon";
import NerdleLogo from "../components/NerdleLogo";
import NerdleText from "../components/NerdleText";
import SignInForm from "../containers/SignIn/SignInForm";
import useAuth from "../hooks/useAuth";

const SignIn = () => {
  const auth = useAuth();

  if (auth.token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex h-screen max-h-[-webkit-fill-available] flex-col overflow-hidden">
      <Header>
        <Header.Left>
          <div className="flex items-center gap-4">
            <button
              className="text-gray-700 hover:text-nerdle-primary dark:text-gray-300 dark:hover:text-white p-1">
              <NerdleMenuIcon />
            </button>
            <NerdleLogo />
            <NerdleText />
          </div>
        </Header.Left>
        <Header.Right>
          <div className="flex items-center gap-3">
            <span 
              className="text-sm font-normal text-black dark:text-white"
              style={{ fontSize: '0.975em', fontFamily: "'Barlow', sans-serif" }}
            >
              account stats
            </span>
          </div>
        </Header.Right>
      </Header>
      <main className="flex-1 overflow-y-auto p-4 flex flex-col justify-center">
        <h1 className="text-center text-3xl font-semibold text-black dark:text-white">Sign in</h1>
        <SignInForm />
      </main>
    </div>
  );
};

export default SignIn;
