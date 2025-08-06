import React from "react";

import { Controller } from "react-hook-form";

const RadioButton = ({ value, label, ...props }) => {
  return (
    <Controller
      {...props}
      render={({ field }) => (
        <label className="flex items-center gap-2">
          <input
            type="radio"
            className="checked:bg-nerdle-primary hover:checked:bg-nerdle-primary focus:ring-nerdle-primary focus:checked:bg-nerdle-primary"
            {...field}
            value={value}
          />
          <span className="text-sm text-black dark:text-white">{label}</span>
        </label>
      )}
    ></Controller>
  );
};

export default RadioButton;
