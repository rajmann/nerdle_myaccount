import React from "react";

import GameChart from "./GameChart";
import StatCard from "./StatCard";

const ScoreDistribution = ({ data, isMultipleGames = false }) => {
  return (
    <div>
      <div className="mt-10">
        <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">Score Distribution</h2>
          <div className="flex gap-2">
            <StatCard
              value={data?.totalScore}
              label="Total Score"
              className="flex-grow"
            />
            <StatCard
              value={data?.bestScore}
              label="Best Daily Score"
              className="flex-grow"
            />
          </div>
      </div>
      <div className="mt-5 w-full">
        <GameChart data={data?.graph} />
      </div>
    </div>
  );
};

export default ScoreDistribution;
