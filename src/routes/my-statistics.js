import React from "react";
import { useState } from "react";

import toast from "react-hot-toast";
import { useOutletContext, useParams, useLocation, useNavigate } from "react-router-dom";

import { useGameDiary } from "../api/gameDiary";
import { useGames } from "../api/games";
import { useGetWeeklyScoresForSharing } from "../api/getWeeklyScoresForSharing";
import { useProfile } from "../api/profile";
import { useProfilePhoto } from "../api/profilePhoto";
import { useStatistics } from "../api/statistics";
import { useStatisticsWvw } from "../api/statisticsWvw";
import EnableNonNerdleDialog from "../components/EnableNonNerdleDialog";
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
import useScoreLoggingStore from "../store/useScoreLoggingStore";
import { getGameFilterOptions } from "../utils/gameFilters";



let counter = 0;
const MyStatistics = () => {
  const games = useGames();
  const [prevRefresherValue, setPrevRefresherValue] = useState(0);
  // `timestamp` is used for throttling requests. Only
  // allowed users to refresh
  // data every 30 seconds.
  const [timestamp, setTimestamp] = useState(Math.floor(new Date().getTime() / 1000));
  const [refresher,] = useOutletContext();
  const [showEnableNonNerdleDialog, setShowEnableNonNerdleDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker('My Statistics');
  const auth = useAuth();
  const isUsingApp = React.useMemo(() => auth? auth.isPWA: undefined, [auth]);

  const { allGamesOption, allNerdleGamesOption, dateFilterOptions } = useOptionsStore((state) => ({
    allGamesOption: state.allGamesOption,
    allNerdleGamesOption: state.allNerdleGamesOption,
    dateFilterOptions: state.dateOptions,
  }));
  const { scoreLoggingEnabled, setScoreLoggingEnabled } = useScoreLoggingStore();

  const allGames = React.useMemo(() => games.data?.data, [games.data?.data]);

  const gameFilterOptions = React.useMemo(() => {
    const data = games.data?.data;
    return getGameFilterOptions(data, allGamesOption, allNerdleGamesOption, scoreLoggingEnabled);
  }, [allGamesOption, allNerdleGamesOption, games.data?.data, scoreLoggingEnabled]);

  const { gameFilter, setGameFilter, dateFilter, setDateFilter } =
    useMyStatisticsStore();

  // Auto-forward from parameterized URLs to /my-statistics with correct date filter
  React.useEffect(() => {
    if (dateFilterOptions.length === 0) return;
    
    const pathSegments = location.pathname.split('/');
    const dateParam = pathSegments[pathSegments.length - 1];
    
    // Map URL parameters to date filter options
    const urlToDateMap = {
      'lastmonth': 'Last month',
      'last-month': 'Last month',
      'thisweek': 'This week',
      'this-week': 'This week',
      'lastweek': 'Last week',
      'last-week': 'Last week',
      'alltime': 'All time',
      'all-time': 'All time'
    };

    // Check if we have a URL parameter that maps to a date filter
    if (urlToDateMap[dateParam]) {
      const targetDateOption = dateFilterOptions.find(option => 
        option.label === urlToDateMap[dateParam]
      );
      
      if (targetDateOption) {
        setDateFilter(targetDateOption);
        
        // For /lastmonth, also set games filter to "All Games"
        if (dateParam === 'lastmonth' && allGamesOption) {
          // Check if score logging is disabled and show dialog
          if (!scoreLoggingEnabled) {
            setShowEnableNonNerdleDialog(true);
          } else {
            setGameFilter(allGamesOption);
          }
        }
        
        // Auto-forward to standard URL with the filters applied
        navigate('/my-statistics', { replace: true });
        return;
      }
    }
    
    // If no valid dateFilter is set, set default to first option
    if (!dateFilter) {
      const defaultDateOption = dateFilterOptions[0];
      if (defaultDateOption) {
        setDateFilter(defaultDateOption);
      }
    }
  }, [location.pathname, dateFilterOptions, dateFilter, setDateFilter, navigate, allGamesOption, scoreLoggingEnabled, setGameFilter, setShowEnableNonNerdleDialog]);



  const handleEnableNonNerdleConfirm = () => {
    setScoreLoggingEnabled(true);
    if (allGamesOption) {
      setGameFilter(allGamesOption);
    }
    setShowEnableNonNerdleDialog(false);
    toast.success('Non-nerdle games enabled');
  };

  const handleEnableNonNerdleCancel = () => {
    setShowEnableNonNerdleDialog(false);
  };

  // Ensure the Nerdle filter is properly set when games data loads
  React.useEffect(() => {
    if (gameFilterOptions.length > 0) {
      const nerdleOption = gameFilterOptions.find(option => option.value === "nerdlegame");
      if (nerdleOption && gameFilter?.value === "nerdlegame" && gameFilter?.label !== nerdleOption.label) {
        setGameFilter(nerdleOption);
      }
    }
  }, [gameFilterOptions, gameFilter, setGameFilter]);

  const onGameFilterChange = React.useCallback(
    (value) => {
      const option = gameFilterOptions.find((option) => option.value === value);
      if (!option) return;
      
      // Check if "All Games" is selected while non-nerdle games are disabled
      if (option.value === allGamesOption?.value && !scoreLoggingEnabled) {
        setShowEnableNonNerdleDialog(true);
        return;
      }
      
      setGameFilter(option);
    },
    [gameFilterOptions, setGameFilter, allGamesOption, scoreLoggingEnabled, setShowEnableNonNerdleDialog]
  );

  const onDateFilterChange = React.useCallback(
    (value) => {
      const option = dateFilterOptions.find((option) => option.value === value);
      if (option) {
        setDateFilter(option);
        // Navigate to standard URL when date filter changes
        if (location.pathname !== '/my-statistics') {
          navigate('/my-statistics');
        }
      }
    },
    [dateFilterOptions, setDateFilter, location.pathname, navigate]
  );

  const { data: profile} = useProfile();

  const { data: photo} = useProfilePhoto();

  const user = React.useMemo(() => ({ ...profile, photo }), [photo, profile]);


  
  let { data: apiData, mutate: mutateStatistics } = useStatistics({
    game: gameFilter?.value,
    date: dateFilter?.value,
  });

  let { data: wvwData, mutate: mutateStatisticsWvw } = useStatisticsWvw({
    game: gameFilter?.value,
    date: dateFilter?.value,
  });

  let { data: gameDiaryData, mutate: mutateGameDiary } = useGameDiary({
    game: gameFilter?.value,
    date: dateFilter?.value,
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
        isMultipleGames={gameFilter?.value === "all"}
      />
      <GameDiary 
        data={gameDiary} 
        weeklyScoresForSharingData={weeklyScoresForSharingData}
        gameFilter={gameFilter}
        allGames={allGames}
      />
      
      <EnableNonNerdleDialog
        isOpen={showEnableNonNerdleDialog}
        onClose={handleEnableNonNerdleCancel}
        onConfirm={handleEnableNonNerdleConfirm}
      />
    </div>
  );
};

export default MyStatistics;
