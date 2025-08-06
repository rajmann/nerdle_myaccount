import React from "react";

import { NavLink } from "react-router-dom";

const BottomNavigationItem = ({ path, icon: Icon, label, onClick }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center whitespace-nowrap px-1 py-2 text-center text-[0.45rem] hover:bg-gray-100 dark:hover:bg-slate-700 ${
          isActive ? "text-nerdle-primary dark:!text-white" : "text-gray-600 dark:text-gray-400"
        }`
      }

      onClick={onClick}
    >
      {({ isActive }) => (
        <>
          <Icon 
            className={
              isActive 
                ? "text-nerdle-primary dark:!text-white" 
                : "text-gray-600 dark:text-gray-400"
            } 
            style={{ color: 'inherit', height: '24px', width: 'auto' }}
          />
          {label}
        </>
      )}
    </NavLink>
  );
};

export default BottomNavigationItem;
