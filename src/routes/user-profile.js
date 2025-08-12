import React from "react";

import { useParams } from "react-router-dom";

import { useGameDiary } from "../api/gameDiary";
import { useGames } from "../api/games";
import { usePublicProfile } from "../api/publicProfile";
import { usePublicProfilePhoto } from "../api/publicProfilePhoto";
import { useStatistics } from "../api/statistics";
import { useStatisticsWvw } from "../api/statisticsWvw";
import GameAndDateFilters from "../components/GameAndDateFilters";
import GameDiary from "../components/GameDiary";
import GameStats from "../components/GameStats";
import RecentGames from "../components/RecentGames";
import ScoreDistribution from "../components/ScoreDistribution";
import Spinner from "../components/Spinner";
import UserDetails from "../components/UserDetails";
import useOptionsStore from "../store/useOptionsStore";
import useScoreLoggingStore from "../store/useScoreLoggingStore";
import { fillMissingDates } from "../utils/dateRange";
import { getGameFilterOptions } from "../utils/gameFilters";

const UserProfile = () => {
  const games = useGames();

  const { allGamesOption, allNerdleGamesOption, dateFilterOptions } = useOptionsStore((state) => ({
    allGamesOption: state.allGamesOption,
    allNerdleGamesOption: state.allNerdleGamesOption,
    dateFilterOptions: state.dateOptions,
  }));
  const { scoreLoggingEnabled } = useScoreLoggingStore();

  const allGames = React.useMemo(() => games.data?.data, [games.data?.data]);

  const gameFilterOptions = React.useMemo(() => {
    const data = games.data?.data;
    return getGameFilterOptions(data, allGamesOption, allNerdleGamesOption, scoreLoggingEnabled);
  }, [allGamesOption, allNerdleGamesOption, games.data?.data, scoreLoggingEnabled]);

  const [gameFilter, setGameFilter] = React.useState(allGamesOption);
  const [dateFilter, setDateFilter] = React.useState(dateFilterOptions[0]);

  const onGameFilterChange = React.useCallback(
    (option) => {
      setGameFilter(option);
    },
    []
  );

  const onDateFilterChange = React.useCallback(
    (option) => {
      setDateFilter(option);
    },
    []
  );

  const params = useParams();

  const { data: profile } = usePublicProfile({ userId: params.userId });

  const { data: photo } = usePublicProfilePhoto({ userId: params.userId });

  const { data: apiData } = useStatistics({
    game: gameFilter.value,
    date: dateFilter.value,
    id: params.userId,
  });

  const { data: wvwData } = useStatisticsWvw({
    game: gameFilter.value,
    date: dateFilter.value,
    id: params.userId,
  });

  const { data: gameDiaryData } = useGameDiary({
    game: gameFilter.value,
    date: dateFilter.value,
    id: params.userId,
    dateFilter: dateFilter
  });

  const data = React.useMemo(() => apiData?.data, [apiData?.data]);

  const user = React.useMemo(() => ({ ...profile, photo }), [photo, profile]);

  const gameStats = React.useMemo(
    () => ({ ...data?.stat, ww: wvwData?.data }),
    [data?.stat, wvwData?.data]
  );

  const gameDiary = React.useMemo(
    () => {
      if (!gameDiaryData?.data) return null;
      
      const rawDiary = Object.entries(gameDiaryData.data).map(([key, value]) => ({
        day: key,
        ...value,
      }));
      
      // Fill missing dates with zero values
      return fillMissingDates(rawDiary, dateFilter);
    },
    [gameDiaryData?.data, dateFilter]
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

  if (!data || !gameStats || !gameDiary) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <UserDetails user={user} />
      <RecentGames
        allGames={allGames}
        gamesToday={gamesToday}
        gamesPastTwoWeeks={gamesPastTwoWeeks}
        showShareButton={false}
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
      <GameDiary data={gameDiary} dateFilter={dateFilter} />
    </div>
  );
};

export default UserProfile;
