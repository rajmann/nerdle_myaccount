import React from "react";

const OutlineButton = ({ className, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg border-2 border-violet-400 py-5 px-4 text-white hover:border-violet-500 hover:bg-violet-500 ${className}`}
    >
      {children}
    </button>
  );
};

export default OutlineButton;
