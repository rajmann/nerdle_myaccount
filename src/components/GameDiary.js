import React from "react";

import { format, isToday, isYesterday, isTomorrow, parseISO } from "date-fns";
import toast from "react-hot-toast";

import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import useAnalyticsEventTracker from "../lib/useAnalyticsEventTracker";

const DiaryTitle = () => {
  return (
    <div className="grid grid-cols-5 place-items-end">
      <span className="col-span-2 place-self-start font-semibold text-gray-900">
        Game Diary
      </span>
      {["Played", "Won", "Points"].map((title, index) => (
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

const DiaryData = ({ theDay, date, played, won, points }) => {
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

  if(theDay === 'tomorrow' && played === 0 && won === 0 && points === 0) return null;


  return (
    <div className="grid grid-cols-5">
      <span className="col-span-2 py-2 text-sm font-semibold text-gray-900">
        {theDay === 'today'
          ? "Today"
          : theDay === 'yesterday'
          ? "Yesterday"
          : theDay === 'tomorrow'
          ? "Tomorrow"
          : format(parsedDate, "d MMMM")}
      </span>
      {[played, won, points].map((value, index) => (
        <span
          key={index}
          className="flex items-center justify-end border-r border-gray-700 pr-2 text-sm text-gray-900">
          {value}
        </span>
      ))}
    </div>
  );
};

const GameDiary = ({ data, weeklyScoresForSharingData }) => {
  const { isPWA } = useAuth();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker("My Statistics");

  const currentData = React.useMemo(
    () => weeklyScoresForSharingData,
    [weeklyScoresForSharingData]
  );

  const generateTextForWeeklyScoreSharing = (currentData, isPWA) => {
    if (currentData === undefined) return "NO_GAMES";
    const data = currentData;
    if (data.noOfGames === 0) return "NO_GAMES";

    const title = "🟣🟧My -le games for the past 7 days";
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

    const footer = `Stats by ${
      isPWA ? "Nerdle League" : "nerdleleague.com"
    }`;

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
      <DiaryTitle />
      {data.map((diary) => (
        <DiaryData
          key={diary.day}
          theDay={diary.day}
          date={diary.date}
          played={diary.played}
          won={diary.won}
          points={diary.points}
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
