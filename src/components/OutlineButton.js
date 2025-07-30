import React from "react";

const OutlineButton = ({ className, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg border-2 border-nerdle-primary py-5 px-4 text-nerdle-primary hover:border-nerdle-primary hover:bg-nerdle-primary hover:text-white ${className}`}
    >
      {children}
    </button>
  );
};

export default OutlineButton;
