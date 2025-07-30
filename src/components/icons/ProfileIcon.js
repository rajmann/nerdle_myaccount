import * as React from "react";

const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={44} height={30} {...props}>
    <g fill="currentColor">
      <path d="M21.982 6.83a4.343 4.343 0 0 0-.11 8.685.738.738 0 0 1 .2 0h.063a4.344 4.344 0 0 0-.153-8.685Z" />
      <path
        data-name="Vector"
        d="M26.631 17.95a9.086 9.086 0 0 0-9.289 0 3.612 3.612 0 0 0-1.803 2.956 3.582 3.582 0 0 0 1.794 2.937 8.455 8.455 0 0 0 4.649 1.29 8.455 8.455 0 0 0 4.649-1.29 3.611 3.611 0 0 0 1.794-2.956 3.6 3.6 0 0 0-1.794-2.937Z"
      />
    </g>
  </svg>
);

export default SvgComponent;
