import React from "react";

import { GameIcon } from "../utils/gameIcons";


const CompleteGameList = ({ allGames, gamesToday, gamesPastTwoWeeks, showShareButton = true }) => {

  let gamesTodayUnique = gamesToday?.filter(
    (game, index) =>
      gamesToday?.findIndex(
        (g) => g.gameName.toLowerCase() === game.gameName.toLowerCase()
      ) === index
  );

  var byScore = gamesTodayUnique.slice(0);
  byScore.sort(function (a, b) {
    return b.calculatedScore - a.calculatedScore;
  });

  gamesTodayUnique = byScore;



  const gamesPastTwoWeeksUnique = gamesPastTwoWeeks?.filter(
    (game, index) =>
      gamesPastTwoWeeks?.findIndex(
        (g) => g.gameName.toLowerCase() === game.gameName.toLowerCase()
      ) === index
  );

  const gamesTodayWithDetails = React.useMemo(
    () =>
      gamesTodayUnique?.map((game) => {
        const detail = allGames?.find(
          (g) => g?.value.toLowerCase() === game?.gameName?.toLowerCase()
        );
        // Transform "nerdle" to "nerdle (classic)" for display
        let displayName = detail?.name;
        if (detail?.value === 'nerdlegame' && detail?.name === 'nerdle') {
          displayName = 'nerdle (classic)';
        }
        return {
          ...game,
          name: displayName,
          value: detail?.value,
          url: detail?.url,
        };
      }),
    [gamesTodayUnique, allGames]
  );

  const recentlyPlayedWithDetails = React.useMemo(
    () =>
      gamesPastTwoWeeksUnique?.map((game) => {
        const detail = allGames?.find(
          (g) => g?.value.toLowerCase() === game?.gameName?.toLowerCase()
        );
        // Transform "nerdle" to "nerdle (classic)" for display
        let displayName = detail?.name;
        if (detail?.value === 'nerdlegame' && detail?.name === 'nerdle') {
          displayName = 'nerdle (classic)';
        }
        return {
          ...game,
          name: displayName,
          url: detail?.url,
        };
      }),
    [gamesPastTwoWeeksUnique, allGames]
  );

  // get recently played games without today
  const allGamesWithRecentlyPlayed = React.useMemo(
    () =>
    {
      const recentlyPlayed = recentlyPlayedWithDetails?.filter(
        (game) =>
          gamesTodayWithDetails?.findIndex(
            (g) => g.gameName.toLowerCase() === game.gameName.toLowerCase()
          ) === -1
      )
      /* console.log('recentlyPlayed');
      console.log(recentlyPlayed); */

      let arrSpacer = [];
      if(recentlyPlayed.length > 0)
            arrSpacer.push({name: 'SPACER', value: 'SPACER', url: 'SPACER'});

      const arrTemp = allGames?.filter(
        (game) =>
          recentlyPlayed?.findIndex(
            (g) => g.gameName.toLowerCase() === game.value.toLowerCase()
          ) === -1
      )

      /* console.log('arrTemp');
      console.log(arrTemp); */

      const otherGames = arrTemp?.filter(
        (game) =>
          gamesTodayWithDetails?.findIndex(
            (g) => g.gameName.toLowerCase() === game.value.toLowerCase()
          ) === -1
      )
      const all = [...recentlyPlayed, ...arrSpacer, ...otherGames];
      /* console.log('ALL');
      console.log(all); */
      return all ;

    },
    [gamesTodayWithDetails, recentlyPlayedWithDetails, allGames]
  );

  return (
    <div className="mt-8">
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        <h2>Played Today</h2>
      </div>

      <div className="h-full rounded-md bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 p-4">
        <div className="pr-4">
          {!gamesTodayWithDetails?.length ? (
            <p className="text-sm text-gray-500">No games played today</p>
          ) : (
            <>
              {gamesTodayWithDetails?.map(
                ({ name, calculatedScore, url }, index) => (
                  <div
                    key={index}
                    className="mb-2 flex items-center">
                    <GameIcon 
                      gameName={name} 
                      gameData={{ nGame: url && url.includes('nerdlegame.com') }}
                      className="w-8 h-8 flex-shrink-0"
                    />
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-black dark:text-white underline underline-offset-2 game-name flex-1 min-w-0 ml-3"
                      style={{ fontFamily: 'Quicksand, sans-serif' }}>
                      {name}
                    </a>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      <div className="text-sm font-semibold text-gray-900 dark:text-white mt-3 mb-2">
        <h2>Not Played Today</h2>
      </div>
      <div className="h-full rounded-md bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 p-4">
        <div className="pr-4">
          {!allGamesWithRecentlyPlayed?.length ? (
            <p className="text-sm text-gray-500">All games played today</p>
          ) : (
            <>
              {allGamesWithRecentlyPlayed?.map(({ name, url }, index) => (
                (name === 'SPACER' ? 
                <div key={index} className="h-6"></div>: 
                <div
                  key={index}
                  className="mb-2 flex items-center">
                  <GameIcon 
                    gameName={name} 
                    gameData={{ nGame: url && url.includes('nerdlegame.com') }}
                    className="w-8 h-8 flex-shrink-0"
                  />
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-black dark:text-white underline underline-offset-2 game-name flex-1 min-w-0 ml-3"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    {name}
                  </a>
                </div>
              )))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteGameList;
