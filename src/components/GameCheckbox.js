import React from "react";

const GameCheckbox = React.forwardRef(({ label, ...props }, ref) => (
  <label className="group flex flex-1 flex-col items-start rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[slate-700] p-1">
    <input
      ref={ref}
      type="checkbox"
      className="peer rounded-full border-none checked:bg-violet-500 focus:ring-transparent focus:ring-violet-500 focus:checked:bg-violet-500 focus:checked:ring-violet-500 group-hover:checked:bg-violet-500"
      {...props}
    />
    <span className="mt-1 mb-5 self-center text-sm text-gray-400 peer-checked:text-violet-500">
      {label}
    </span>
  </label>
));

export default GameCheckbox;
