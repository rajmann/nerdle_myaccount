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
            className="checked:bg-violet-500 hover:checked:bg-violet-500 focus:ring-violet-500 focus:checked:bg-violet-500"
            {...field}
            value={value}
          />
          <span className="text-sm text-black">{label}</span>
        </label>
      )}
    ></Controller>
  );
};

export default RadioButton;
