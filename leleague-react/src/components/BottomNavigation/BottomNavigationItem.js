import React from "react";

import { NavLink } from "react-router-dom";

const BottomNavigationItem = ({ path, icon: Icon, label, onClick }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center whitespace-nowrap p-2 text-center text-[0.5rem] hover:bg-slate-800 ${
          isActive ? "text-violet-400" : "text-gray-400"
        }`
      }

      onClick={onClick}
    >
      {({ isActive }) => (
        <>
          <Icon className={isActive ? "fill-violet-400" : "fill-gray-400"} />
          {label}
        </>
      )}
    </NavLink>
  );
};

export default BottomNavigationItem;
