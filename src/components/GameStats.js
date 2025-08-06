import React from "react";

import StatCard from "./StatCard";

const GameStats = ({ data }) => {
  return (
    <div className="mt-7">
      <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">My Stats</h2>
      <div className="grid grid-cols-3 gap-2">
        <StatCard value={data?.played} label="Played" />
        <StatCard value={data?.won} label="Won" />
        <StatCard value={data?.winPercentage} label="% of Games Played" />
        <StatCard
          value={data?.points}
          label="Points"
          numberColor="text-nerdle-primary"
        />
        <StatCard
          value={data?.pointsPerGame}
          label="Points/Game"
          numberColor="text-nerdle-primary"
        />
        <StatCard
          value={`${data?.ww >= 0 ? "+" : ""}${data?.ww}`}
          label="Week vs Week"
          numberColor={data?.ww >= 0 ? "text-nerdle-green" : "text-red-500"}
        />
      </div>
    </div>
  );
};
export default GameStats;
