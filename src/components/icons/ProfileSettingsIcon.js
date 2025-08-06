import * as React from "react";

const ProfileSettingsIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={24}
    height={24}
    {...props}
  >
    {/* Cogwheel head */}
    <circle cx="12" cy="8" r="3"/>
    <path d="M12 2l1 2h2l-1 1.5L15 8l-1.5-1L12 8l-1.5-1L9 8l1-2.5L9 4h2l1-2z"/>
    <path d="M8.5 6L10 4.5M15.5 6L14 4.5M8.5 10L10 11.5M15.5 10L14 11.5"/>
    
    {/* Body/shoulders */}
    <path d="M12 14c-3.31 0-6 2.02-6 4.5V22h12v-3.5c0-2.48-2.69-4.5-6-4.5z"/>
  </svg>
);

export default ProfileSettingsIcon;