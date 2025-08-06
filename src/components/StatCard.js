import React from "react";

const StatCard = ({
  numberColor = "text-gray-900 dark:text-white",
  value = 0,
  label = "",
  className = "",
}) => {
  return (
    <div className={`rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-4 ${className}`}>
      <p className={`font-semibold ${numberColor}`}>{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
};

export default StatCard;
