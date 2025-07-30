import React from "react";

const StatCard = ({
  numberColor = "text-gray-900",
  value = 0,
  label = "",
  className = "",
}) => {
  return (
    <div className={`rounded-md bg-gray-100 border border-gray-200 p-4 ${className}`}>
      <p className={`font-semibold ${numberColor}`}>{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
};

export default StatCard;
