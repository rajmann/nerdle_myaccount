import React from "react";

const TextButton = ({ className, children, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center gap-4 rounded-lg border border-transparent p-4 font-semibold text-violet-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TextButton;
