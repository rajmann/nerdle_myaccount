import React from "react";

import { Outlet } from "react-router-dom";

import Header from "../Header";
import LogoBanner from "../LogoBanner";

const HeaderLayout = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-white">
      <Header className="bg-white">
        <Header.Center>
          <LogoBanner />
        </Header.Center>
      </Header>
      <main className="flex-1 overflow-y-auto p-4">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default HeaderLayout;
