import React from "react";

const Button = ({ className, onClick, children, ...props }) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-4 rounded-lg border border-transparent bg-violet-400 p-4 text-white hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
