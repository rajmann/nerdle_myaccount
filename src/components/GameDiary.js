import React from "react";

import { format } from "date-fns";
import toast from "react-hot-toast";

import Button from "../components/Button";
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

const DiaryData = ({ theDay, date, played, won, points, showPlayColumn, gameUrl }) => {
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
          {(() => {
            console.log(`DiaryData ${theDay} - played: ${played}, theDay: ${theDay}, gameUrl: ${gameUrl}`);
            console.log(`Should show play link: ${played === 0 && theDay !== 'tomorrow'}`);
            
            if (played === 0 && theDay !== 'tomorrow') {
              const href = theDay === 'today' ? gameUrl : `${gameUrl}/${urlDate}`;
              console.log(`Play link href: ${href}`);
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-nerdle-primary underline underline-offset-2">
                  play
                </a>
              );
            }
            return null;
          })()}
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
  );
};

const GameDiary = ({ data, weeklyScoresForSharingData, gameFilter, allGames }) => {
  const { isPWA } = useAuth();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker("My Statistics");

  const currentData = React.useMemo(
    () => weeklyScoresForSharingData,
    [weeklyScoresForSharingData]
  );

  // Determine if we should show the play column (only for single games, not "all" or "all nerdle games")
  const showPlayColumn = React.useMemo(() => {
    console.log('GameDiary - showPlayColumn calculation:');
    console.log('gameFilter:', gameFilter);
    console.log('gameFilter.value !== "all":', gameFilter?.value !== 'all');
    console.log('gameFilter.value !== "allnerdle":', gameFilter?.value !== 'allnerdle');
    console.log('!gameFilter.label?.includes("All "):', !gameFilter?.label?.includes('All '));
    
    const result = gameFilter && 
           gameFilter.value !== 'all' && 
           gameFilter.value !== 'allnerdle' &&
           !gameFilter.label?.includes('All '); // Hide for any filter with "All" in the label
           
    console.log('showPlayColumn result:', result);
    return result;
  }, [gameFilter]);

  // Get the game URL for play links
  const gameUrl = React.useMemo(() => {
    console.log('GameDiary - gameUrl calculation:');
    console.log('showPlayColumn:', showPlayColumn);
    console.log('allGames:', allGames);
    console.log('gameFilter:', gameFilter);
    
    if (!showPlayColumn || !allGames || !gameFilter) {
      console.log('Early return - missing prerequisites');
      return '';
    }
    
    const game = allGames.find(g => g.value === gameFilter.value);
    console.log('Found game:', game);
    const url = game ? game.url : '';
    console.log('Game URL:', url);
    return url;
  }, [showPlayColumn, allGames, gameFilter]);

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
  return (
    <div className="mt-12">
      <DiaryTitle showPlayColumn={showPlayColumn} />
      {data.map((diary) => (
        <DiaryData
          key={diary.day}
          theDay={diary.day}
          date={diary.date}
          played={diary.played}
          won={diary.won}
          points={diary.points}
          showPlayColumn={showPlayColumn}
          gameUrl={gameUrl}
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
