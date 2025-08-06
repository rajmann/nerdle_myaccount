import * as React from "react";

const ProfileSettingsIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={24}
    height={24}
    {...props}
  >
    {/* Person/User head and shoulders */}
    <path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
    <path d="M12 12c-3.31 0-6 2.02-6 4.5V19h12v-2.5c0-2.48-2.69-4.5-6-4.5z"/>
    
    {/* Small cogwheel in top right corner */}
    <g transform="translate(16, 2)">
      <circle cx="4" cy="4" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.8"/>
      <path d="M4 1.5L4 0.5M4 7.5L4 6.5M6.5 4L7.5 4M0.5 4L1.5 4M5.6 2.4L6.3 1.7M1.7 6.3L2.4 5.6M2.4 2.4L1.7 1.7M6.3 6.3L5.6 5.6" 
            stroke="currentColor" 
            strokeWidth="0.8" 
            strokeLinecap="round"/>
    </g>
  </svg>
);

export default ProfileSettingsIcon;