import React from "react";

import { NavLink } from "react-router-dom";

const BottomNavigationItem = ({ path, icon: Icon, label, onClick }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center whitespace-nowrap p-2 text-center text-[0.5rem] hover:bg-gray-100 dark:hover:bg-slate-700 ${
          isActive ? "text-nerdle-primary dark:text-white" : "text-gray-600 dark:text-gray-400"
        }`
      }

      onClick={onClick}
    >
      {({ isActive }) => (
        <>
          <Icon 
            className={isActive ? "text-nerdle-primary dark:text-white" : "text-gray-600 dark:text-gray-400"} 
            style={{ color: 'inherit' }}
          />
          {label}
        </>
      )}
    </NavLink>
  );
};

export default BottomNavigationItem;
