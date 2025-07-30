import React from "react";

import nerdleLogo from "../assets/images/nerdle-logo.png";

const LogoBanner = () => {
  return (
    <div className="flex items-center justify-center">
      <img 
        src={nerdleLogo} 
        alt="Nerdle League" 
        className="h-12 w-auto"
      />
    </div>
  );
};

export default LogoBanner;
