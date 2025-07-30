import React from "react";

const Checkbox = React.forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className="rounded-full border checked:bg-violet-500 focus:ring-transparent focus:ring-violet-500 focus:checked:bg-violet-500 focus:checked:ring-violet-500"
      {...props}
    />
  );
});

export default Checkbox;
