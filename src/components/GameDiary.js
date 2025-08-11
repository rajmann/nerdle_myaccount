import React from "react";

import { format } from "date-fns";
import toast from "react-hot-toast";

import { useMultiGameDiary } from "../api/gameDiary";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import useAnalyticsEventTracker from "../lib/useAnalyticsEventTracker";
import { GameIcon } from "../utils/gameIcons";

const DiaryTitle = ({ showPlayColumn }) => {
  const columns = showPlayColumn ? ["", "Played", "Won", "Points"] : ["Played", "Won", "Points"];
  
  return (
    <div className="flex w-full">
      <span className="py-2 text-sm font-semibold text-gray-900 dark:text-white" style={{ width: '40%' }}>
        Game Diary
      </span>
      {showPlayColumn && (
        <span className="flex items-center justify-end border-r border-gray-700 pr-2 text-sm text-gray-900 dark:text-white" style={{ width: '20%' }}>
          {columns[0]}
        </span>
      )}
      {columns.slice(showPlayColumn ? 1 : 0).map((title, index) => (
        <span
          key={index}
          className="flex items-center justify-end border-r border-gray-700 pr-2 text-sm text-gray-900 dark:text-white"
          style={{ width: '20%' }}>
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
    // Extract just the date part and format as YYYYMMDD
    const datePart = date.split('T')[0]; // Remove time part if present
    return datePart.replace(/-/g, ''); // Convert 2020-10-10 to 20201010
  }, [date]);

  if(theDay === 'tomorrow' && played === 0 && won === 0 && points === 0) return null;

// Removed unused gridCols variable
  const values = showPlayColumn ? [played, won, points] : [played, won, points];

  return (
    <div className="flex w-full">
      <span className="py-2 text-sm font-semibold text-gray-900 dark:text-white" style={{ width: '40%' }}>
        {theDay === 'today'
          ? "Today"
          : theDay === 'yesterday'
          ? "Yesterday"
          : theDay === 'tomorrow'
          ? "Tomorrow"
          : format(parsedDate, "d MMMM")}
      </span>
      {showPlayColumn && (
        <span className="flex items-center justify-end border-r border-gray-700 pr-2 text-sm" style={{ width: '20%' }}>
          {played === 0 && theDay !== 'tomorrow' ? (
            <a
              href={theDay === 'today' ? gameUrl : `${gameUrl}/${urlDate}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-nerdle-primary text-white text-xs px-2 py-1 rounded hover:bg-nerdle-primary/90 transition-colors">
              play
            </a>
          ) : null}
        </span>
      )}
      {values.map((value, index) => (
        <span
          key={index}
          className="flex items-center justify-end border-r border-gray-700 pr-2 text-sm text-gray-900 dark:text-white"
          style={{ width: '20%' }}>
          {value}
        </span>
      ))}
    </div>
  );
};

// Enhanced diary components for multi-game view
const EnhancedDiaryDay = ({ dayData, isFirstDay = false }) => {
  // Handle date parsing more safely
  let parsedDate;
  let urlDate = '';
  
  try {
    // Try to parse the date, handling various formats
    if (dayData.date.includes('T')) {
      parsedDate = new Date(dayData.date);
    } else {
      parsedDate = new Date(dayData.date + "T00:00:00.000Z");
    }
    
    if (isNaN(parsedDate.getTime())) {
      // Fallback: use current date
      parsedDate = new Date();
    }
    
    urlDate = format(parsedDate, "yyyyMMdd");
  } catch (error) {
    console.error('Date parsing error:', error, dayData.date);
    parsedDate = new Date();
    urlDate = format(parsedDate, "yyyyMMdd");
  }

  return (
    <div className="mb-6 relative">
      {/* Simple diary decoration */}
      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-nerdle-primary/60 via-nerdle-primary to-nerdle-primary/60 rounded-full opacity-80"></div>
      
      {/* Date and totals header with diary styling */}
      <div className="flex w-full border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-3 relative">
        {/* Corner decoration */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-gray-300 dark:border-gray-600"></div>
        
        <span className="flex items-center text-sm font-semibold text-black dark:text-white" style={{ width: '40%', fontFamily: 'Barlow, sans-serif' }}>
          {dayData.day === 'today'
            ? "📝 Today"
            : dayData.day === 'yesterday'
            ? "📝 Yesterday"
            : dayData.day === 'tomorrow'
            ? "📝 Tomorrow"
            : `📝 ${format(parsedDate, "d MMMM")}`}
        </span>
        <span className="flex items-center justify-end pr-2 text-sm text-black dark:text-white" style={{ width: '20%' }}>
          {dayData.totalPlayed}
        </span>
        <span className="flex items-center justify-end pr-2 text-sm text-black dark:text-white" style={{ width: '20%' }}>
          {dayData.totalWon}
        </span>
        <span className="flex items-center justify-end pr-2 text-sm text-black dark:text-white" style={{ width: '20%' }}>
          {dayData.totalPoints}
        </span>
      </div>

      {/* Game breakdowns styled like diary pages */}
      <div className="mt-4 relative">
        {/* Notebook lines effect */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-200 opacity-30"></div>
        <div className="absolute left-12 top-0 bottom-0 w-px bg-blue-200 opacity-20"></div>
        
        <div className="mb-3 grid grid-cols-2 gap-x-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <h3 style={{ fontFamily: 'Barlow, sans-serif' }}>Played</h3>
          <h3 style={{ fontFamily: 'Barlow, sans-serif' }}>Not Played</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-x-3">
          {/* Played games - diary page style */}
          <div className="h-full rounded-lg bg-white border border-gray-200 p-2 shadow-sm relative overflow-hidden">
            {/* Paper texture lines */}
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none"></div>
            <div className="absolute top-6 left-0 right-0 h-px bg-blue-100 opacity-30"></div>
            <div className="absolute top-12 left-0 right-0 h-px bg-blue-100 opacity-30"></div>
            <div className="absolute top-18 left-0 right-0 h-px bg-blue-100 opacity-30"></div>
            
            <div className="h-full relative z-10">
              {!dayData.games.filter(g => g.played > 0).length ? (
                <p className="text-sm text-gray-500">No games played {dayData.day === 'today' ? 'today' : dayData.day === 'yesterday' ? 'yesterday' : dayData.day === 'tomorrow' ? 'tomorrow' : 'this day'}</p>
              ) : (
                <>
                  {dayData.games
                    .filter(game => game.played > 0)
                    .map((game, index) => (
                      <div
                        key={index}
                        className="mb-1 flex items-center">
                        <GameIcon 
                          gameName={game.name} 
                          gameData={{ nGame: game.value && (game.value.includes('nerdlegame') || game.value.includes('nerdle')) }}
                          className="w-8 h-8 flex-shrink-0"
                        />
                        <span className="text-xs text-black game-name flex-1 min-w-0 ml-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                          {game.name}
                        </span>
                        <p className="text-xs text-black ml-4 font-medium">{game.points}</p>
                      </div>
                    ))
                  }
                </>
              )}
            </div>
          </div>

          {/* Not played games - diary page style */}
          <div className="h-full">
            <div className="h-full rounded-lg bg-white border border-gray-200 p-2 shadow-sm relative overflow-hidden">
              {/* Paper texture lines */}
              <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-amber-50/20 to-transparent pointer-events-none"></div>
              <div className="absolute top-6 left-0 right-0 h-px bg-amber-100 opacity-30"></div>
              <div className="absolute top-12 left-0 right-0 h-px bg-amber-100 opacity-30"></div>
              <div className="absolute top-18 left-0 right-0 h-px bg-amber-100 opacity-30"></div>
              
              <div className="h-full relative z-10">
                {!dayData.games.filter(g => g.played === 0).length ? (
                  <p className="text-sm text-gray-500">All games played {dayData.day === 'today' ? 'today' : dayData.day === 'yesterday' ? 'yesterday' : dayData.day === 'tomorrow' ? 'tomorrow' : 'this day'}</p>
                ) : (
                  <>
                    {dayData.games
                      .filter(game => game.played === 0)
                      .map((game, index) => (
                        <div
                          key={index}
                          className="mb-1 flex items-center">
                          <GameIcon 
                            gameName={game.name} 
                            gameData={{ nGame: game.value && (game.value.includes('nerdlegame') || game.value.includes('nerdle')) }}
                            className="w-8 h-8 flex-shrink-0"
                          />
                          <span className="text-xs text-black game-name flex-1 min-w-0 ml-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                            {game.name}
                          </span>
                          {dayData.day !== 'tomorrow' && (
                            <a
                              href={dayData.day === 'today' ? `${game.url}?external=true` : `${game.url}/${urlDate}?external=true`}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-3 inline-block bg-nerdle-primary text-white text-xs px-2 py-1 rounded hover:bg-nerdle-primary/90 transition-colors font-medium no-underline">
                              play
                            </a>
                          )}
                        </div>
                      ))
                    }
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GameDiary = ({ data, weeklyScoresForSharingData, gameFilter, allGames, recentGamesData = {} }) => {
  const { isPWA } = useAuth();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker("My Statistics");

  // Check if this is a multi-game view that needs enhanced diary
  const isMultiGameView = gameFilter && (
    gameFilter.value === 'all' || 
    gameFilter.value === 'allnerdle' ||
    gameFilter.label?.includes('All ')
  );

  // Get list of games that appeared in recent games for multi-game diary - wrapped in useMemo to avoid dependency issues
  const recentGamesForDiary = React.useMemo(() => {
    if (!isMultiGameView || !recentGamesData || !allGames) return [];
    
    const { gamesToday = [], gamesPastTwoWeeks = [] } = recentGamesData;
    const allRecentGames = [...(gamesToday || []), ...(gamesPastTwoWeeks || [])];
    
    // Get unique game values, prioritizing those that match our filter
    const uniqueGames = allRecentGames
      .filter((game, index) => 
        allRecentGames.findIndex(g => g.gameName?.toLowerCase() === game.gameName?.toLowerCase()) === index
      )
      .map(game => {
        const gameDetail = allGames.find(g => g.value?.toLowerCase() === game.gameName?.toLowerCase());
        return gameDetail ? gameDetail.value : game.gameName?.toLowerCase();
      })
      .filter(Boolean);
    
    return uniqueGames;
  }, [isMultiGameView, recentGamesData, allGames]);

  // Fetch multi-game diary data if needed - MOVED TO TOP to avoid hooks order violation
  const multiGameDiaryResponses = useMultiGameDiary({
    games: isMultiGameView ? recentGamesForDiary : [],
    date: "This week",
    id: null
  });

  const currentData = React.useMemo(
    () => weeklyScoresForSharingData,
    [weeklyScoresForSharingData]
  );

  // Determine if we should show the play column (only for single games, not "all" or "all nerdle games")
  const showPlayColumn = React.useMemo(() => {
    return gameFilter && 
           gameFilter.value !== 'all' && 
           gameFilter.value !== 'allnerdle' &&
           !gameFilter.label?.includes('All '); // Hide for any filter with "All" in the label
  }, [gameFilter]);

  // Process multi-game diary data into organized structure
  const enhancedDiaryData = React.useMemo(() => {
    if (!isMultiGameView || !multiGameDiaryResponses?.length || !recentGamesForDiary?.length || !allGames?.length) {
      console.log('Enhanced diary not active:', { 
        isMultiGameView, 
        responsesLength: multiGameDiaryResponses?.length,
        recentGamesLength: recentGamesForDiary?.length,
        allGamesLength: allGames?.length 
      });
      return null;
    }

    // Create a map of date -> games data
    const dateGameMap = new Map();
    
    console.log('Processing multi-game diary responses:', {
      responsesCount: multiGameDiaryResponses.length,
      recentGamesCount: recentGamesForDiary.length,
      responses: multiGameDiaryResponses.map((r, i) => ({
        game: recentGamesForDiary[i],
        hasData: !!r?.data,
        isLoading: r?.isLoading,
        error: r?.error,
        dataType: Array.isArray(r?.data) ? 'array' : typeof r?.data
      }))
    });

    multiGameDiaryResponses.forEach((response, index) => {
      const gameValue = recentGamesForDiary[index];
      if (!response?.data || response.isLoading || response.error) {
        console.log(`Skipping response ${index}:`, { gameValue, hasData: !!response?.data, isLoading: response?.isLoading, error: response?.error });
        return;
      }

      const gameDetail = allGames?.find(g => g.value === gameValue);
      if (!gameDetail) {
        console.log(`No game detail found for:`, gameValue);
        return;
      }

      // Handle the nested data structure from API response
      const apiData = response.data.data || response.data;
      console.log(`Processing diary data for ${gameValue}:`, { apiData });
      
      // Transform the API response structure to match expected format
      Object.entries(apiData).forEach(([dayKey, dayData]) => {
        if (!dayData || typeof dayData !== 'object') return;
        
        const dateKey = dayData.date;
        if (!dateKey) return;
        
        // Skip tomorrow entries with no activity (same logic as single-game diary)
        if (dayKey === 'tomorrow' && dayData.played === 0 && dayData.won === 0 && dayData.points === 0) {
          return;
        }
        
        if (!dateGameMap.has(dateKey)) {
          dateGameMap.set(dateKey, {
            day: dayKey,
            date: dateKey,
            totalPlayed: 0,
            totalWon: 0,
            totalPoints: 0,
            games: []
          });
        }

        const aggregatedDayData = dateGameMap.get(dateKey);
        aggregatedDayData.totalPlayed += dayData.played || 0;
        aggregatedDayData.totalWon += dayData.won || 0;
        aggregatedDayData.totalPoints += dayData.points || 0;
        aggregatedDayData.games.push({
          name: gameDetail.name === 'Nerdle' ? 'nerdle (classic)' : gameDetail.name,
          value: gameDetail.value,
          url: gameDetail.url,
          played: dayData.played || 0,
          won: dayData.won || 0,
          points: dayData.points || 0
        });
      });
    });

    // Sort games within each day and convert to array
    const sortedDays = Array.from(dateGameMap.values())
      .map(dayData => ({
        ...dayData,
        games: dayData.games.sort((a, b) => b.points - a.points) // Sort by points descending
      }))
      .sort((a, b) => {
        // Sort days chronologically with proper order: tomorrow, today, yesterday, then chronological
        if (a.day === 'tomorrow') return -1;
        if (b.day === 'tomorrow') return 1;
        if (a.day === 'today') return -1;
        if (b.day === 'today') return 1;
        if (a.day === 'yesterday') return -1;
        if (b.day === 'yesterday') return 1;
        
        try {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        } catch (error) {
          console.error('Date sorting error:', error);
          return 0;
        }
      });

    return sortedDays;
  }, [isMultiGameView, multiGameDiaryResponses, recentGamesForDiary, allGames]);



  // Get the game URL for play links
  const gameUrl = React.useMemo(() => {
    if (!showPlayColumn || !allGames || !gameFilter) return '';
    
    const game = allGames.find(g => g.value === gameFilter.value);
    return game ? game.url : '';
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
  // Render enhanced multi-game diary or regular single-game diary
  if (isMultiGameView && enhancedDiaryData) {
    return (
      <div className="mt-12">
        <DiaryTitle showPlayColumn={false} />
        {enhancedDiaryData.map((dayData, index) => (
          <React.Fragment key={`${dayData.date}-${index}`}>
            <EnhancedDiaryDay dayData={dayData} isFirstDay={index === 0} />
            {index < enhancedDiaryData.length - 1 && (
              <hr className="border-white my-4" />
            )}
          </React.Fragment>
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
  }

  // Regular single-game diary
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
