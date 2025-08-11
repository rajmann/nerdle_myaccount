import React from "react";

import { format } from "date-fns";
import toast from "react-hot-toast";

import { useGameDiary } from "../api/gameDiary";
import Button from "../components/Button";
import DailyGameDetails from "../components/DailyGameDetails";
import useAuth from "../hooks/useAuth";
import useAnalyticsEventTracker from "../lib/useAnalyticsEventTracker";

const DiaryTitle = ({ showPlayColumn }) => {
  const gridCols = showPlayColumn ? "grid-cols-6" : "grid-cols-5";
  const columns = showPlayColumn ? ["Play", "Played", "Won", "Points"] : ["Played", "Won", "Points"];
  
  return (
    <div className={`grid ${gridCols} place-items-end`}>
      <span className="col-span-2 place-self-start font-semibold text-gray-900 dark:text-white">
        Game Diary
      </span>
      {columns.map((title, index) => (
        <span
          key={index}
          className="border-r border-gray-700 pr-2 text-right text-xs text-gray-400">
          {title}
        </span>
      ))}
    </div>
  );
};

// const _isToday = (someDate) => {
//   const today = new Date()
//   return someDate.getUTCDate() === today.getUTCDate() &&
//     someDate.getUTCMonth() === today.getUTCMonth() &&
//     someDate.getUTCFullYear() === today.getUTCFullYear()
// }

// const _isYesterday = (someDate) => {
//   const yesterday = new Date()
//   yesterday.setUTCDate(yesterday.getUTCDate() - 1);
//   return someDate.getUTCDate() === yesterday.getUTCDate() &&
//     someDate.getUTCMonth() === yesterday.getUTCMonth() &&
//     someDate.getUTCFullYear() === yesterday.getUTCFullYear()
// }

// const _format = (someDate) => {
//   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   return someDate.getUTCDate() + " " + monthNames[someDate.getUTCMonth()]
// }

const DiaryData = ({ 
  theDay, 
  date, 
  played, 
  won, 
  points, 
  showPlayColumn, 
  gameUrl, 
  showGameDetails = false,
  gameDetails = [],
  allGames = [],
  isFirstDetailsRow = false
}) => {
  //const parsedDate = React.useMemo(() => parseISO(date), [date]);
  // const parsedDate = new Date(date)
  
  const parsedDate = React.useMemo(() => 
  {
    //2020-10-10
    const year = date.substring(0, 4);
    const month = parseInt(date.substring(5, 7))-1;
    const day = date.substring(8, 10);
    const newDate = new Date(year,  month, day, 0, 0, 0, 0);
    /* console.log('theDay = ' + theDay);
    console.log('year = ' + year);
    console.log('month = ' + month);
    console.log('day = ' + day);
    console.log('newDate = ' + newDate); */
    return newDate;
  }, [date]);

  // Format date as YYYYMMDD for the URL
  const urlDate = React.useMemo(() => {
    return date.replace(/-/g, ''); // Convert 2020-10-10 to 20201010
  }, [date]);

  if(theDay === 'tomorrow' && played === 0 && won === 0 && points === 0) return null;

  const gridCols = showPlayColumn ? "grid-cols-6" : "grid-cols-5";
  const values = showPlayColumn ? [played, won, points] : [played, won, points];

  return (
    <div>
      <div className={`grid ${gridCols}`}>
        <span className="col-span-2 py-2 text-sm font-semibold text-gray-900 dark:text-white">
          {theDay === 'today'
            ? "Today"
            : theDay === 'yesterday'
            ? "Yesterday"
            : theDay === 'tomorrow'
            ? "Tomorrow"
            : format(parsedDate, "d MMMM")}
        </span>
        {showPlayColumn && (
          <span className="flex items-center justify-end border-r border-gray-700 pr-2 text-sm">
            {played === 0 && theDay !== 'tomorrow' ? (
              <a
                href={theDay === 'today' ? gameUrl : `${gameUrl}/${urlDate}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-nerdle-primary underline underline-offset-2">
                play
              </a>
            ) : null}
          </span>
        )}
        {values.map((value, index) => (
          <span
            key={index}
            className="flex items-center justify-end border-r border-gray-700 pr-2 text-sm text-gray-900 dark:text-white">
            {value}
          </span>
        ))}
      </div>
      
      {showGameDetails && (
        <DailyGameDetails
          gameDetails={gameDetails}
          date={date}
          allGames={allGames}
          isFirstRow={isFirstDetailsRow}
        />
      )}
    </div>
  );
};

const GameDiary = ({ data, weeklyScoresForSharingData, gameFilter, allGames, gamesToday, gamesPastTwoWeeks }) => {
  const { isPWA } = useAuth();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker("My Statistics");

  const currentData = React.useMemo(
    () => weeklyScoresForSharingData,
    [weeklyScoresForSharingData]
  );

  // Determine if we should show the play column (only for single games, not "all" or "all nerdle games")
  const showPlayColumn = React.useMemo(() => {
    return gameFilter && 
           gameFilter.value !== 'all' && 
           gameFilter.value !== 'allnerdle' &&
           gameFilter.value !== 'nerdlegame'; // Don't show for main nerdle game either since it doesn't follow the same URL pattern
  }, [gameFilter]);

  // Determine if we should show detailed game breakdown (for "all" or "all nerdle games")
  const showGameDetails = React.useMemo(() => {
    console.log('GameDiary - gameFilter:', gameFilter);
    const result = gameFilter && 
           (gameFilter.value === 'all' || gameFilter.value === 'allnerdle');
    console.log('GameDiary - showGameDetails calculation:', result);
    return result;
  }, [gameFilter]);

  // Get the game URL for play links
  const gameUrl = React.useMemo(() => {
    if (!showPlayColumn || !allGames || !gameFilter) return '';
    
    const game = allGames.find(g => g.value === gameFilter.value);
    return game ? game.url : '';
  }, [showPlayColumn, allGames, gameFilter]);

  // Get unique list of recently played games for fetching game diary data
  const recentlyPlayedGames = React.useMemo(() => {
    if (!showGameDetails || !gamesToday || !gamesPastTwoWeeks) return [];
    
    const allRecentGames = [...(gamesToday || []), ...(gamesPastTwoWeeks || [])];
    const uniqueGames = allRecentGames.filter((game, index, self) => 
      index === self.findIndex(g => g.gameName.toLowerCase() === game.gameName.toLowerCase())
    );
    
    return uniqueGames.map(game => game.gameName);
  }, [showGameDetails, gamesToday, gamesPastTwoWeeks]);

  // Process game data by date for detailed display
  const gameDetailsByDate = React.useMemo(() => {
    if (!showGameDetails) return {};
    
    const detailsByDate = {};
    
    // Debug log to see data structure
    console.log('GameDiary - showGameDetails:', showGameDetails);
    console.log('GameDiary - gamesToday:', gamesToday);
    console.log('GameDiary - gamesPastTwoWeeks:', gamesPastTwoWeeks);
    console.log('GameDiary - data:', data);
    
    // Only process if we have diary data
    if (data) {
      // For now, let's create mock data based on the diary dates to see the structure
      data.forEach(diary => {
        const date = diary.date;
        detailsByDate[date] = [];
        
        // Add some sample games for testing - this would normally come from API calls
        if (gamesToday && gamesToday.length > 0) {
          gamesToday.slice(0, 3).forEach(game => {
            detailsByDate[date].push({
              gameName: game.gameName,
              calculatedScore: game.calculatedScore || 0,
              hasScore: (game.calculatedScore || 0) > 0
            });
          });
        } else {
          // Add some mock games for testing
          detailsByDate[date] = [
            { gameName: 'nerdlegame', calculatedScore: 3, hasScore: true },
            { gameName: 'mini', calculatedScore: 0, hasScore: false },
            { gameName: 'instant', calculatedScore: 5, hasScore: true }
          ];
        }
      });
    }
    
    console.log('GameDiary - gameDetailsByDate:', detailsByDate);
    return detailsByDate;
  }, [showGameDetails, gamesToday, gamesPastTwoWeeks, data]);

  const generateTextForWeeklyScoreSharing = (currentData, isPWA) => {
    if (currentData === undefined) return "NO_GAMES";
    const data = currentData;
    if (data.noOfGames === 0) return "NO_GAMES";

    const title = "🟪🟩⬛️My nerdleverse games for the past 7 days";
    const summary = `${data.averagePointsPerGame} points per game (${
      data.noOfGames
    } game${data.noOfGames !== 1 ? "s" : ""}, ${data.totalPoints} point${
      data.totalPoints !== 1 ? "s" : ""
    })`;
    let arrGraph = [];
    const arrDistributedPoints = data.arrDistributedPoints;
    const purpleSquare = "\u{1f7ea}";
    const tenSquare = "\u{1f51f}";
    for (let ctr = arrDistributedPoints.length - 1; ctr >= 0; ctr--) {
      const curPointsInCurrentIndex = arrDistributedPoints[ctr];
      const pointsLabel = `${(ctr + 1).toString()}pts`;
      const dividedByTen = parseInt(curPointsInCurrentIndex / 10);
      let tenTexts = "";
      if (dividedByTen > 0) {
        //GET NUMBER OF TENS NEEDED.
        const noOfTens = parseInt(dividedByTen);
        for (let ctr2 = 0; ctr2 < noOfTens; ctr2++) tenTexts += tenSquare + "+";
      }
      const remainder = curPointsInCurrentIndex - dividedByTen * 10;
      let purpleTexts = "";
      for (let ctr3 = 0; ctr3 < remainder; ctr3++) purpleTexts += purpleSquare;

      /* console.log('curPointsInCurrentIndex')
      console.log(curPointsInCurrentIndex)
      console.log('pointsLabel')
      console.log(pointsLabel)
      console.log('dividedByTen')
      console.log(dividedByTen)
      console.log('remainder')
      console.log(remainder)
      console.log('purpleTexts')
      console.log(purpleTexts) */

      const finalText = `${pointsLabel} ${tenTexts}${purpleTexts} ${curPointsInCurrentIndex}`;
      arrGraph.push(finalText);
    }
    const finalGraph = arrGraph.join("\n");

    const footer = `nerdlegame.com`;

    const finalText = `${title}\n\n${summary}\n${finalGraph}\n\n${footer}`;

    /* console.log('finalText');
    console.log(finalText); */

    return finalText;
  };
  const weeklyScoresForSharing = React.useMemo(
    () => generateTextForWeeklyScoreSharing(currentData, isPWA),
    [currentData, isPWA]
  );

  const onShareWeeklyScores = React.useCallback(async () => {
    if (weeklyScoresForSharing === "NO_GAMES") {
      toast.error("Add scores in order to share.");
      return;
    }

    if (isPWA) {
      window.ReactNativeWebView.postMessage(
        `COPIED_FROM_CLIPBOARD:${weeklyScoresForSharing}`
      );
    } else {
      try {
        await navigator.clipboard.writeText(weeklyScoresForSharing);
        toast.success("Scores copied!");
      } catch (error) {
        toast.error("Failed to copy scores.");
      }
    }

    //console.log("GA: SHARED 7 DAYS");
    gaEventTracker("shared_7days");
  }, [weeklyScoresForSharing, isPWA, gaEventTracker]);
  // Debug the data structure
  console.log('GameDiary render - data:', data);
  console.log('GameDiary render - showGameDetails:', showGameDetails);

  return (
    <div className="mt-12">
      <DiaryTitle showPlayColumn={showPlayColumn} />
      {data?.map((diary, index) => (
        <DiaryData
          key={diary.day}
          theDay={diary.day}
          date={diary.date}
          played={diary.played}
          won={diary.won}
          points={diary.points}
          showPlayColumn={showPlayColumn}
          gameUrl={gameUrl}
          showGameDetails={showGameDetails}
          gameDetails={gameDetailsByDate[diary.date] || []}
          allGames={allGames}
          isFirstDetailsRow={index === 0 && showGameDetails}
        />
      ))}

      {weeklyScoresForSharingData !== undefined ? (
        <div className="flex h-full flex-col items-stretch">
          <Button className="mt-3" onClick={onShareWeeklyScores}>
            {`Share all scores for the past 7 days`}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default GameDiary;
