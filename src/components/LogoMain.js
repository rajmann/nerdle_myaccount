import React from "react";

import nerdleLogo from "../assets/images/nerdle-logo.png";

const LogoMain = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={nerdleLogo} 
        alt="Nerdle League" 
        className="h-16 w-auto"
      />
      <div className="ml-2 flex flex-col">
        <span className="nerdle-name">nerdle</span>
        <span className="nerdle-dot">.</span>
      </div>
    </div>
  );
};

export default LogoMain;
