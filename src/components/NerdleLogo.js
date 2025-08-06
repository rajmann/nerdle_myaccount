import React from "react";

import nerdleLogo from "../assets/images/nerdle-logo.png";

const NerdleLogo = () => {
  return (
    <img 
      src={nerdleLogo} 
      alt="Nerdle" 
      className="h-8 w-auto"
    />
  );
};

export default NerdleLogo;