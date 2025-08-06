import React from "react";

const NerdleText = () => {
  return (
    <div className="flex flex-col">
      <span className="text-2xl text-gray-900 dark:text-white">
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 300 }}>nerdle</span>
        <span style={{ fontFamily: "'Times New Roman', serif" }}>.</span>
      </span>
      <span 
        className="text-xs leading-none" 
        style={{ color: '#398874' }}
      >
        account stats
      </span>
    </div>
  );
};

export default NerdleText;