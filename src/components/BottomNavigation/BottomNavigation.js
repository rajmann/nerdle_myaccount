import React from "react";

import AddScore from "../../containers/AddScore/AddScore";

const BottomNavigation = ({ children }) => {
  return (
    <nav className="sticky bottom-0 flex w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
      {children}
      <AddScore />
    </nav>
  );
};

export default BottomNavigation;
