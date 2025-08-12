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
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  
  // Generate year options from 2022 to current year
  const yearOptions = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2022; year--) {
      years.push({ label: year.toString(), value: year });
    }
    return years;
  }, []);

  const handleGameFilterChange = (option) => {
    onGameFilterChange(option);
  };

  const handleDateFilterChange = (option) => {
    // If "All time" is selected, include the year information
    if (option.value === "All time") {
      const optionWithYear = {
        ...option,
        year: selectedYear,
        label: `All time (${selectedYear})`
      };
      onDateFilterChange(optionWithYear);
    } else {
      onDateFilterChange(option);
    }
  };

  const handleYearChange = (yearOption) => {
    setSelectedYear(yearOption.value);
    // If "All time" is currently selected, update it with new year
    if (dateFilter.value === "All time") {
      const updatedDateFilter = {
        ...dateFilter,
        year: yearOption.value,
        label: `All time (${yearOption.value})`
      };
      onDateFilterChange(updatedDateFilter);
    }
  };

  const isAllTimeSelected = dateFilter.value === "All time";

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
      {isAllTimeSelected && (
        <>
          <p className="text-sm text-gray-900 dark:text-white">Year:</p>
          <FilterSelectMenu
            options={yearOptions}
            value={yearOptions.find(opt => opt.value === selectedYear)}
            onChange={handleYearChange}
          />
        </>
      )}
    </div>
  );
};

export default GameAndDateFilters;
