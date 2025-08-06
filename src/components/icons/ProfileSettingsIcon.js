import * as React from "react";

const ProfileSettingsIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* User profile icon */}
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx={12} cy={7} r={4} />
    {/* Settings cog overlay */}
    <g transform="translate(14, 14) scale(0.6)">
      <circle cx={12} cy={12} r={3} />
      <path d="m12 1 1.8 5.2L19 8l-5.2 1.8L12 15l-1.8-5.2L5 8l5.2-1.8L12 1Z" />
    </g>
  </svg>
);

export default ProfileSettingsIcon;