import * as React from "react";

const ProfileSettingsIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={24}
    height={24}
    {...props}
  >
    {/* User circle icon */}
    <circle cx="7" cy="7" r="4"/>
    <path d="M2 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/>
    
    {/* Settings cogwheel */}
    <circle cx="18" cy="12" r="3"/>
    <path d="m19.4 15-1.4-1.4m0-2.2 1.4-1.4m-2.8 0L18 8.6m2.8 2.8L18 12.8"/>
    <path d="M15.7 13.5 18 12l2.3 1.5"/>
    <path d="M15.7 10.5 18 12l2.3-1.5"/>
  </svg>
);

export default ProfileSettingsIcon;