import React from "react";

import { format } from "date-fns";
import toast from "react-hot-toast";

import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import useAnalyticsEventTracker from '../lib/useAnalyticsEventTracker';

const RecentGames = ({ allGames, gamesToday, gamesPastTwoWeeks, showShareButton = true }) => {

  const { isPWA } = useAuth();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker('My Statistics');

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
  const recentlyPlayed = React.useMemo(
    () =>
      recentlyPlayedWithDetails?.filter(
        (game) =>
          gamesTodayWithDetails?.findIndex(
            (g) => g.gameName.toLowerCase() === game.gameName.toLowerCase()
          ) === -1
      ),
    [gamesTodayWithDetails, recentlyPlayedWithDetails]
  );

  const purpleSquare = "\u{1f7ea}";

  const shareTodaysScore = React.useMemo(() => {
    const today = new Date();
    const gamesToday = gamesTodayWithDetails?.slice(0, 4);
    const extraGamesToday = gamesTodayWithDetails?.slice(4);

    const games = gamesToday?.map((game) => {
      const numberOfSquares = game?.calculatedScore;
      const squares = Array(numberOfSquares).fill(purpleSquare);
      return `${squares.join("")} ${game?.gameName} ${game?.calculatedScore
        }pt${game?.calculatedScore === 1 ? '' : 's'}`;
    });

    //console.log('games count = ' + gamesTodayWithDetails?.length);
    let totalPoints = 0;
    let totalGames = gamesTodayWithDetails?.length;
    for (var ctr = 0; ctr < gamesTodayWithDetails?.length; ctr++) {
      const game = gamesTodayWithDetails[ctr];
      totalPoints += game.calculatedScore;
    }

    //NAN ERROR W/ INSTANT NERDLE
    /* const totalPoints = games?.reduce((acc, game) => {
      const score = game?.split(" ")[2];
      return acc + parseInt(score);
    }, 0); */

    const averagePoints = Math.round((totalPoints * 10) / totalGames) / 10;
    const title = `🟣🟧My -le games for ${format(today, "dd MMM")}.`;
    const summary = `${averagePoints} point${averagePoints === 1 ? '' : 's'} per game (${totalGames} game${totalGames === 1 ? '' : 's'}, ${totalPoints} point${totalPoints === 1 ? '' : 's'}).`;
    const gameTexts = games?.join("\n");
    const extraGamesCount = `${extraGamesToday?.length > 0 ? `\n+${extraGamesToday?.length} more` : ""
      }`;
    /* const gamesPlayed = `Games Played = ${games?.length}`;
    const totalPointsText = `Points total = ${totalPoints}`;
    const averagePointsText = `avg = ${averagePoints}`; */

    const texts = `${title}\n\n${summary}\n${gameTexts}${extraGamesCount}\n\nStats by ${isPWA ? 'Nerdle League' : 'nerdleleague.com'}`;

    return texts;
  }, [gamesTodayWithDetails, isPWA]);

  const onShareScore = React.useCallback(async () => {
    if (gamesTodayUnique <= 0) {
      toast.error("Add scores for today in order to share.");
      return;
    }

    if (isPWA) {
      window.ReactNativeWebView.postMessage(`COPIED_FROM_CLIPBOARD:${shareTodaysScore}`);
    }
    else {
      try {
        await navigator.clipboard.writeText(shareTodaysScore);
        toast.success("Copied todays scores");
      } catch (error) {
        toast.error("Failed to copy todays scores");
      }
    }

    //console.log('GA: SHARED TODAY');
    gaEventTracker('shared_today');
  }, [gamesTodayUnique, isPWA, gaEventTracker, shareTodaysScore]);

  return (
    <div className="mt-8">
      {/* <div className="text-sm font-semibold text-white mb-2">
        <h2>Played Today</h2>
      </div>

      <div className="h-full rounded-md bg-gray-700 p-4">
        <div className="max-h-[125px] overflow-y-auto pr-4">
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
                      className="text-sm text-violet-400 underline underline-offset-2">
                      {name}
                    </a>
                    <p className="text-sm text-white">{calculatedScore}</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      <div className="text-sm font-semibold text-white mt-3 mb-2">
        <h2>Not Played Today</h2>
      </div>
      <div className="h-full rounded-md bg-gray-700 p-4">
        <div className="max-h-[100px] overflow-y-auto pr-4">
          {!recentlyPlayed?.length ? (
            <p className="text-sm text-gray-500">All games played today</p>
          ) : (
            <>
              {recentlyPlayed?.map(({ name, url }, index) => (
                <div
                  key={index}
                  className="mb-1 flex items-center justify-between">
                  <a
                    href={url + "?external=true"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-violet-400 underline underline-offset-2">
                    {name}
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
 */}

      <div className="mb-2 grid grid-cols-2 gap-x-2 text-sm font-semibold text-white">
        <div className="flex justify-between">
          <h2>Played Today</h2>
        </div>
        <h2>Not Played Today</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="h-full rounded-md bg-gray-700 p-4">
          <div className="max-h-[125px] overflow-y-auto pr-4">
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
                        className="text-sm text-violet-400 underline underline-offset-2">
                        {name}
                      </a>
                      <p className="text-sm text-white">{calculatedScore}</p>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
        <div className="h-full">
          <div className="h-full rounded-md bg-gray-700 p-4">
            <div className="max-h-[100px] overflow-y-auto pr-4">
              {!recentlyPlayed?.length ? (
                <p className="text-sm text-gray-500">All games played today</p>
              ) : (
                <>
                  {recentlyPlayed?.map(({ name, url }, index) => (
                    <div
                      key={index}
                      className="mb-1 flex items-center justify-between">
                      <a
                        href={url + "?external=true"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-violet-400 underline underline-offset-2">
                        {name}
                      </a>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      { showShareButton === true && (
        <div className="flex h-full flex-col items-stretch">
          <Button className="mt-4" onClick={onShareScore}>
            {`Share Today's Score${(gamesTodayUnique.length > 1) ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentGames;
