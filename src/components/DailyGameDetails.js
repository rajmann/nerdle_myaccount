import React from "react";

const DailyGameDetails = ({ 
  gameDetails, 
  date, 
  allGames, 
  isFirstRow = false 
}) => {
  // Format date as YYYYMMDD for the URL
  const urlDate = React.useMemo(() => {
    return date.replace(/-/g, ''); // Convert 2020-10-10 to 20201010
  }, [date]);

  if (!gameDetails || gameDetails.length === 0) {
    return null;
  }

  return (
    <div className="ml-4 mb-4">
      {isFirstRow && (
        <div className="mb-2 flex gap-8">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Played Today
          </span>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Not Played Today
          </span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {gameDetails.map((game, index) => {
          const gameInfo = allGames?.find(g => g.value === game.gameName);
          
          // Determine display name
          let displayName = gameInfo?.name || game.gameName;
          if (game.gameName === 'nerdlegame' || (gameInfo?.value === 'nerdlegame' && gameInfo?.name === 'nerdle')) {
            displayName = 'nerdle (classic)';
          }

          const hasScore = game.calculatedScore > 0;
          
          return (
            <div
              key={`${game.gameName}-${index}`}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                hasScore
                  ? 'bg-nerdle-primary/10 text-nerdle-primary'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="font-medium game-name">
                {displayName}
              </span>
              {hasScore ? (
                <span className="font-bold">
                  {game.calculatedScore}pt{game.calculatedScore === 1 ? '' : 's'}
                </span>
              ) : (
                <a
                  href={`${gameInfo?.url}/${urlDate}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-nerdle-primary underline underline-offset-2 hover:text-nerdle-secondary"
                >
                  play
                </a>
              )}
            </div>
          );
        })}
      </div>
      
      <hr className="mt-4 border-gray-200 dark:border-gray-600" />
    </div>
  );
};

export default DailyGameDetails;