import React from "react";

const Button = ({ className, onClick, children, ...props }) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-4 rounded-lg border border-transparent bg-nerdle-primary p-4 text-white hover:bg-nerdle-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-nerdle-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
