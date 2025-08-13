import React from "react";

import { IoMdEyeOff, IoMdEye } from "react-icons/io";

const PasswordInput = React.forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const toggleVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="relative flex">
      <input
        ref={ref}
        type={showPassword ? "text" : "password"}
        className="w-full rounded-lg border-gray-200 py-5 px-6 pr-12 bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        {...props}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-4 grid place-items-center self-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {showPassword ? (
          <IoMdEye className="h-6 w-6" />
        ) : (
          <IoMdEyeOff className="h-6 w-6" />
        )}
      </button>
    </div>
  );
});

export default PasswordInput;
