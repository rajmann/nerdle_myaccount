import React from "react";

import FilterSelectMenu from "./FilterSelectMenu";

const GameAndDateFilters = ({
  className,
  gameFilterOptions,
  gameFilter,
  onGameFilterChange,
  dateFilterOptions,
  dateFilter,
  onDateFilterChange,
}) => {
  const handleGameFilterChange = (option) => {
    onGameFilterChange(option);
  };

  const handleDateFilterChange = (option) => {
    onDateFilterChange(option.value);
  };

  return (
    <div className={`flex items-center gap-2 ${className} mt-10`}>
      <p className="text-sm text-gray-900 dark:text-white">Filter by:</p>
      <FilterSelectMenu
        options={gameFilterOptions}
        value={gameFilter}
        onChange={handleGameFilterChange}
      />
      <FilterSelectMenu
        options={dateFilterOptions}
        value={dateFilter}
        onChange={handleDateFilterChange}
      />
    </div>
  );
};

export default GameAndDateFilters;
