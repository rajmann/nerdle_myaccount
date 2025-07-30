import React from "react";

const StatCard = ({
  numberColor = "text-white",
  value = 0,
  label = "",
  className = "",
}) => {
  return (
    <div className={`rounded-md bg-gray-700 p-4 ${className}`}>
      <p className={`font-semibold ${numberColor}`}>{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
};

export default StatCard;
