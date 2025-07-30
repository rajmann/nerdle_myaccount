import React from "react";

const LeagueScoringSystem = ({ scoringSystem }) => {
  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-white">Scoring system:</p>
      <span className="text-sm font-semibold text-white">{scoringSystem}</span>
    </div>
  );
};

export default LeagueScoringSystem;
