import React from "react";

const Header = ({ className, children }) => {
  return (
    <header
      className={`sticky top-0 flex w-full items-center justify-center gap-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 p-4 ${className}`}
    >
      {children}
    </header>
  );
};

const Left = ({ children }) => {
  return <div className="flex flex-1 items-center">{children}</div>;
};

const Center = ({ children }) => {
  return <div>{children}</div>;
};

const Right = ({ children }) => {
  return <div className="flex flex-1 items-center justify-end">{children}</div>;
};

Header.Left = Left;
Header.Center = Center;
Header.Right = Right;

export default Header;
