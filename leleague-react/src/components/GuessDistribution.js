import React from "react";

import GameChart from "./GameChart";
import StatCard from "./StatCard";

const GuessDistribution = ({ data }) => {
  return (
    <div>
      <div className="mt-12">
        <h2 className="mb-2 font-semibold text-white">Guess Distribution</h2>
        <div className="flex gap-2">
          <StatCard
            value={data?.winStreak}
            label="Win Streak"
            className="flex-grow"
          />
          <StatCard
            value={data?.maxStreak}
            label="Max Streak"
            className="flex-grow"
          />
        </div>
      </div>
      <div className="mt-5 mb-10 w-full">
        <GameChart data={data?.graph} />
      </div>
    </div>
  );
};

export default GuessDistribution;
