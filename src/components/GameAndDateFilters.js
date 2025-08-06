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
  return (
    <div className={`flex items-center gap-2 ${className} mt-10`}>
      <p className="text-sm text-gray-900 dark:text-white">Filter by:</p>
      <FilterSelectMenu
        options={gameFilterOptions}
        value={gameFilter}
        onChange={onGameFilterChange}
      />
      <FilterSelectMenu
        options={dateFilterOptions}
        value={dateFilter}
        onChange={onDateFilterChange}
      />
    </div>
  );
};

export default GameAndDateFilters;
