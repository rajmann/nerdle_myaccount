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
    {/* User head profile */}
    <path d="M3 20c0-4.4 3.6-8 8-8v8H3z"/>
    <circle cx="11" cy="8" r="5"/>
    
    {/* Settings cogwheel - positioned to the right */}
    <path d="M14 12h1.5l.5-1.5.5 1.5H18l-1 1 .5 1.5-1.5-1-1.5 1L15 13l-1-1z"/>
    <circle cx="16.5" cy="13" r="2.5"/>
    <path d="M19 10.5v5M14 10.5v5"/>
    <path d="M16.5 8v2M16.5 16v2"/>
  </svg>
);

export default ProfileSettingsIcon;