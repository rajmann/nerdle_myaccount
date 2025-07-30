import React from "react";

import AddScore from "../../containers/AddScore/AddScore";

const BottomNavigation = ({ children }) => {
  return (
    <nav className="sticky bottom-0 flex w-full bg-[#10171F]">
      {children}
      <AddScore />
    </nav>
  );
};

export default BottomNavigation;
