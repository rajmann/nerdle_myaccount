import * as React from "react";

const SvgComponent = (props) => (
  <svg
    data-name="Group 4"
    xmlns="http://www.w3.org/2000/svg"
    width={31.429}
    height={22}
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path
          data-name="Rectangle 410"
          fill="currentColor"
          d="M0 0h31.429v22H0z"
        />
      </clipPath>
    </defs>
    <g data-name="Group 3" clipPath="url(#a)">
      <path
        data-name="Path 21"
        d="M22 3.143H1.571a1.571 1.571 0 1 1 0-3.143H22a1.571 1.571 0 0 1 0 3.143M0 11a1.571 1.571 0 0 0 1.571 1.571h28.286a1.571 1.571 0 0 0 0-3.143H1.571A1.572 1.572 0 0 0 0 11m0 9.429A1.572 1.572 0 0 0 1.571 22h14.143a1.571 1.571 0 1 0 0-3.143H1.571A1.571 1.571 0 0 0 0 20.429"
        fill="currentColor"
      />
    </g>
  </svg>
);

export default SvgComponent;
