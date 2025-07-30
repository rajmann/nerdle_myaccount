import * as React from "react";

const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={44} height={30} {...props}>
    <g fill="currentColor">
      <path 
        d="M27 13v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z"/>
    </g>
  </svg>
);

export default SvgComponent;
