import React from "react";

import { HiArrowLeft } from "react-icons/hi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Header from "../Header";

const BasicLayout = ({ children }) => {
  const navigate = useNavigate();
  const path = useLocation();

  const goBack = React.useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header className="bg-white p-0 px-1">
        <Header.Left>
          {path.pathname !== "/" && (
            <button onClick={goBack} className="p-3">
              <HiArrowLeft />
            </button>
          )}
        </Header.Left>
      </Header>
      <main id='main-container' className="flex-1 overflow-y-auto py-16 px-9">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default BasicLayout;
