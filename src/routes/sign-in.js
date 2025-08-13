import React from "react";

import { Navigate, Link } from "react-router-dom";

import Button from "../components/Button";
import Drawer from "../components/Drawer";
import Header from "../components/Header";
import NerdleMenuIcon from "../components/icons/NerdleMenuIcon";
import NerdleLogo from "../components/NerdleLogo";
import NerdleText from "../components/NerdleText";
import SignInForm from "../containers/SignIn/SignInForm";
import useAuth from "../hooks/useAuth";

const SignIn = () => {
  const auth = useAuth();
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  const onDrawerToggle = React.useCallback(() => {
    setDrawerIsOpen(prev => !prev);
  }, []);

  const onDrawerClose = React.useCallback(() => {
    setDrawerIsOpen(false);
  }, []);

  if (auth.token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex h-screen max-h-[-webkit-fill-available] flex-col overflow-hidden">
      <Header className="z-50">
        <Header.Left>
          <div className="flex items-center gap-4">
            <button
              onClick={onDrawerToggle}
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
      <Drawer isOpen={drawerIsOpen} onClose={onDrawerClose} />
      <main className="flex-1 overflow-y-auto p-4 flex flex-col justify-center">
        <h1 className="text-center text-3xl font-semibold text-black dark:text-white">Sign in</h1>
        <SignInForm />
        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button className="py-2 px-6 text-sm shadow-lg focus-visible:ring-offset-white">
              Cancel
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
