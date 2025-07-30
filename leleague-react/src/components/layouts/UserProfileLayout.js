import React from "react";

import { HiArrowLeft } from "react-icons/hi";
import { Outlet, useNavigate } from "react-router-dom";

import Header from "../Header";
import LogoBanner from "../LogoBanner";

const UserProfileLayout = ({ children }) => {
  const navigate = useNavigate();
  const goBack = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col">
      <Header>
        <Header.Left>
          <button onClick={goBack}>
            <HiArrowLeft className="h-6 w-6 text-white" />
          </button>
        </Header.Left>
        <Header.Center>
          <LogoBanner />
        </Header.Center>
        <Header.Right />
      </Header>
      <main className="flex-1 overflow-y-auto">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default UserProfileLayout;
