import React from "react";


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
        return {
          ...game,
          name: detail?.name,
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
        return {
          ...game,
          name: detail?.name,
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

      <div className="h-full rounded-md bg-gray-100 dark:bg-[rgb(152,148,132)] border border-gray-200 dark:border-gray-600 p-4">
        <div className="pr-4">
          {!gamesTodayWithDetails?.length ? (
            <p className="text-sm text-gray-500">No games played today</p>
          ) : (
            <>
              {gamesTodayWithDetails?.map(
                ({ name, calculatedScore, url }, index) => (
                  <div
                    key={index}
                    className="mb-1 flex items-center justify-between">
                    <a
                      href={url + "?external=true"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-nerdle-primary underline underline-offset-2 game-name">
                      {name}
                    </a>
                    <p className="text-sm text-gray-900 dark:text-white">{calculatedScore}</p>
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
      <div className="h-full rounded-md bg-gray-100 dark:bg-[rgb(152,148,132)] border border-gray-200 dark:border-gray-600 p-4">
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
                  className="mb-1 flex items-center justify-between">
                  <a
                    href={url + "?external=true"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-nerdle-primary underline underline-offset-2 game-name">
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
