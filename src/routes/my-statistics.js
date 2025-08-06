import React from "react";
import { useState } from "react";

import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

import { useGameDiary } from "../api/gameDiary";
import { useGames } from "../api/games";
import { useGetWeeklyScoresForSharing } from "../api/getWeeklyScoresForSharing";
import { useProfile } from "../api/profile";
import { useProfilePhoto } from "../api/profilePhoto";
import { useStatistics } from "../api/statistics";
import { useStatisticsWvw } from "../api/statisticsWvw";
import GameAndDateFilters from "../components/GameAndDateFilters";
import GameDiary from "../components/GameDiary";
import GameStats from "../components/GameStats";
import RecentGames from "../components/RecentGames";
import ScoreDistribution from "../components/ScoreDistribution";
import Spinner from "../components/Spinner";
import UserDetails from "../components/UserDetails";
import useAuth from "../hooks/useAuth";
import useAnalyticsEventTracker from '../lib/useAnalyticsEventTracker';
import useMyStatisticsStore from "../store/useMyStatisticsStore";
import useOptionsStore from "../store/useOptionsStore";



let counter = 0;
const MyStatistics = () => {
  const games = useGames();
  const [prevRefresherValue, setPrevRefresherValue] = useState(0);
  // `timestamp` is used for throttling requests. Only
  // allowed users to refresh
  // data every 30 seconds.
  const [timestamp, setTimestamp] = useState(Math.floor(new Date().getTime() / 1000));
  const [refresher,] = useOutletContext();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker('My Statistics');
  const auth = useAuth();
  const isUsingApp = React.useMemo(() => auth? auth.isPWA: undefined, [auth]);

  const { allGamesOption, allNerdleGamesOption, dateFilterOptions } = useOptionsStore((state) => ({
    allGamesOption: state.allGamesOption,
    allNerdleGamesOption: state.allNerdleGamesOption,
    dateFilterOptions: state.dateOptions,
  }));

  const allGames = React.useMemo(() => games.data?.data, [games.data?.data]);

  const gameFilterOptions = React.useMemo(() => {
    const data = games.data?.data;
    const individualGames = Array.isArray(data)
      ? data.map((game) => ({ label: game.name, value: game.value }))
      : [];
    
    // Find Nerdle (classic) game to put it first
    const nerdleGame = individualGames.find(game => 
      game.value === 'classic' || game.label.toLowerCase().includes('classic')
    );
    const otherGames = individualGames.filter(game => 
      game !== nerdleGame
    );
    
    const options = [
      ...(nerdleGame ? [nerdleGame] : []),
      allGamesOption,
      allNerdleGamesOption,
      ...otherGames.filter(game => game !== nerdleGame),
    ];
    return options;
  }, [allGamesOption, allNerdleGamesOption, games.data?.data]);

  const { gameFilter, setGameFilter, dateFilter, setDateFilter } =
    useMyStatisticsStore();

  const onGameFilterChange = React.useCallback(
    (value) => {
      const option = gameFilterOptions.find((option) => option.value === value);
      setGameFilter(option);
    },
    [gameFilterOptions, setGameFilter]
  );

  const onDateFilterChange = React.useCallback(
    (value) => {
      const option = dateFilterOptions.find((option) => option.value === value);
      setDateFilter(option);
    },
    [dateFilterOptions, setDateFilter]
  );

  const { data: profile} = useProfile();

  const { data: photo} = useProfilePhoto();

  const user = React.useMemo(() => ({ ...profile, photo }), [photo, profile]);

  let { data: apiData, mutate: mutateStatistics } = useStatistics({
    game: gameFilter.value,
    date: dateFilter.value,
  });

  let { data: wvwData, mutate: mutateStatisticsWvw } = useStatisticsWvw({
    game: gameFilter.value,
    date: dateFilter.value,
  });

  let { data: gameDiaryData, mutate: mutateGameDiary } = useGameDiary({
    game: gameFilter.value,
    date: dateFilter.value,
  });

  const data = React.useMemo(() => apiData?.data, [apiData?.data]);

  const gameStats = React.useMemo(
    () => ({ ...data?.stat, ww: wvwData?.data }),
    [data?.stat, wvwData?.data]
  );

  const gameDiary = React.useMemo(
    () =>
    {
      return gameDiaryData?.data
        ? Object.entries(gameDiaryData?.data).map(([key, value]) => ({
          day: key,
          ...value,
        }))
        : null
      },
    [gameDiaryData?.data]
  );

  const gamesToday = React.useMemo(() => data?.gamesToday, [data?.gamesToday]);

  const gamesPastTwoWeeks = React.useMemo(
    () => data?.gamesPastTwoWeeks,
    [data?.gamesPastTwoWeeks]
  );

  const guessDistribution = React.useMemo(
    () =>
      data
        ? {
          totalScore: data.guessDistribution.totalScore,
          bestScore: data.guessDistribution.bestScore,
          winStreak: data.guessDistribution.winStreak,
          maxStreak: data.guessDistribution.maxStreak,
          winPercentage: data.stat.winPercentage,
          graph: Object.entries(data.graph)
            .map(([, value], index) => ({
              game: index + 1,
              value,
            }))
            .sort((a, b) => b.game - a.game),
        }
        : null,
    [data]
  );

  //WEEKLY SCORES SHARING
  let { data: weeklyScoresForSharing, mutate: mutateGetWeeklyScoresForSharing } = useGetWeeklyScoresForSharing();
  const weeklyScoresForSharingData = React.useMemo(() => weeklyScoresForSharing?.data, [weeklyScoresForSharing?.data]);

  if (!data || !gameStats || !gameDiary) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  //FOR REFRESHING EVERYTHING
  if(prevRefresherValue === 0) {
    //FIRST TIME LOADED.
    //console.log('FIRST TIME LOADED.');

    if(counter !== refresher) {
      if(isUsingApp) {
        //console.log('USING APP!');
        gaEventTracker('page_load_stats_pwa'); 
      }
      else {
        //console.log('USING WEB!');
        gaEventTracker('page_load_stats_web');
      }
    }

    counter = refresher;
    setPrevRefresherValue(refresher);
    gaEventTracker('page_load_stats');
  } else if (prevRefresherValue !== refresher) {
    //VIEW IS LOADED AND USER CLICKED THE TAB.
    //console.log('VIEW IS LOADED AND USER CLICKED THE TAB')
    setPrevRefresherValue(refresher);

    try {
      if (toast && counter !== refresher) {
        counter = refresher;
        const message =  Math.floor(new Date().getTime() / 1000) > timestamp + 30
          ? "Refreshing your stats." : "Data refresh available in 30s";
        toast.loading(message, { duration: 3000});
      }
    } catch(e) {

    }

    // only allow if request is more than 30s
    if (Math.floor(new Date().getTime() / 1000) > timestamp + 30) {
      games.mutate();
      mutateStatistics();
      mutateStatisticsWvw();
      mutateGameDiary();
      mutateGetWeeklyScoresForSharing();
      setTimestamp(Math.floor(new Date().getTime() / 1000));
    }

    /* mutateProfile();
    mutateProfilePhoto(); */
  }

  return (
    <div className="pb-20">
      <UserDetails user={user} />
      <RecentGames
        allGames={allGames}
        gamesToday={gamesToday}
        gamesPastTwoWeeks={gamesPastTwoWeeks}
      />
      <GameAndDateFilters
        gameFilter={gameFilter}
        gameFilterOptions={gameFilterOptions}
        onGameFilterChange={onGameFilterChange}
        dateFilter={dateFilter}
        dateFilterOptions={dateFilterOptions}
        onDateFilterChange={onDateFilterChange}
      />
      <GameStats data={gameStats} />
      <ScoreDistribution
        data={guessDistribution}
        isMultipleGames={gameFilter.value === "all"}
      />
      <GameDiary data={gameDiary} weeklyScoresForSharingData={weeklyScoresForSharingData} />
    </div>
  );
};

export default MyStatistics;
