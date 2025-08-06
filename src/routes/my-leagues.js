import React, { useEffect } from "react";
import { useState } from "react";

import { useGames } from "../api/games";
import { useLeagues } from "../api/leagues";
import GameAndDateFilters from "../components/GameAndDateFilters";
import Buttons from "../containers/MyLeagues/Buttons";
import CreatedLeagueModal from "../containers/MyLeagues/CreatedLeagueModal";
import CreateLeagueDialog from "../containers/MyLeagues/CreateLeagueDialog";
import JoinLeagueDialog from "../containers/MyLeagues/JoinLeagueDialog";
import LeagueList from "../containers/MyLeagues/LeagueList";
import useAuth from "../hooks/useAuth";
import useAnalyticsEventTracker from '../lib/useAnalyticsEventTracker';
import useMyLeaguesStore from "../store/useMyLeaguesStore";
import useOptionsStore from "../store/useOptionsStore";

const MyLeagues = () => {
  const games = useGames();

  const [firstTimeLoaded, setFirstTimeLoaded] = useState(true);
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker('My Leagues');
  const auth = useAuth();
  const isUsingApp = React.useMemo(() => auth? auth.isPWA: undefined, [auth]);



  useEffect(() =>
  {

    if(firstTimeLoaded)
    {
      setFirstTimeLoaded(false);
      gaEventTracker('page_load_leagues'); 
      if(isUsingApp)
      {
        //console.log('MY LEAGUES: USING APP!');
        gaEventTracker('page_load_leagues_pwa'); 
      }
      else
      {
        //console.log('MY LEAGUES: USING WEB!');
        gaEventTracker('page_load_leagues_web');
      }
    }
  }, [isUsingApp, gaEventTracker, firstTimeLoaded]);

  const { allGamesOption, dateFilterOptions } = useOptionsStore((state) => ({
    allGamesOption: state.allGamesOption,
    dateFilterOptions: state.dateOptions,
  }));

  const gameFilterOptions = React.useMemo(() => {
    const data = games.data?.data;
    const individualGames = Array.isArray(data)
      ? data.map((game) => ({ label: game.name, value: game.value }))
      : [];
    
    // Find Nerdle (classic) game to put it first
    const nerdleGame = individualGames.find(game => 
      game.value === 'classic'
    );
    // Update the label to show "Nerdle" instead of "classic"
    if (nerdleGame && nerdleGame.label === 'classic') {
      nerdleGame.label = 'Nerdle';
    }
    const otherGames = individualGames.filter(game => 
      game !== nerdleGame
    );
    
    const options = [
      ...(nerdleGame ? [nerdleGame] : []),
      allGamesOption,
      ...otherGames,
    ];
    return options;
  }, [allGamesOption, games.data?.data]);

  const { gameFilter, setGameFilter, dateFilter, setDateFilter } =
    useMyLeaguesStore();

  // Ensure the Nerdle filter is properly set when games data loads
  React.useEffect(() => {
    if (gameFilterOptions.length > 0) {
      const nerdleOption = gameFilterOptions.find(option => option.value === "classic");
      if (nerdleOption && gameFilter.value === "classic" && gameFilter.label !== nerdleOption.label) {
        setGameFilter(nerdleOption);
      }
    }
  }, [gameFilterOptions, gameFilter, setGameFilter]);

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

  const { isValidating, mutate, data } = useLeagues({
    game: gameFilter.value,
    date: dateFilter.value,
  });

  const leagues = React.useMemo(() => data?.data, [data?.data]);

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showJoinDialog, setShowJoinDialog] = React.useState(false);
  const [showCreatedLeagueModal, setShowCreatedLeagueModal] =
    React.useState(false);
  const [createdLeague, setCreatedLeague] = React.useState(null);

  const handleOpenCreateDialog = React.useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const handleCloseCreateDialog = React.useCallback(() => {
    setShowCreateDialog(false);
  }, []);

  const handleCreateLeague = React.useCallback((data) => {
    setShowCreateDialog(false);
    setCreatedLeague(data);
    setShowCreatedLeagueModal(true);
  }, []);

  const handleOpenJoinDialog = React.useCallback(() => {
    setShowJoinDialog(true);
  }, []);

  const handleCloseJoinDialog = React.useCallback(() => {
    setShowJoinDialog(false);
  }, []);

  const handleJoinLeague = React.useCallback(() => {
    setShowJoinDialog(false);
  }, []);

  const handleCloseCreatedLeagueModal = React.useCallback(() => {
    setShowCreatedLeagueModal(false);
    setCreatedLeague(null);
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <Buttons
        onCreate={handleOpenCreateDialog}
        onJoin={handleOpenJoinDialog}
      />
      <h1 className="mt-7 text-xl font-semibold text-gray-900">My Leagues</h1>
      <GameAndDateFilters
        className="mt-5"
        dateFilter={dateFilter}
        dateFilterOptions={dateFilterOptions}
        onDateFilterChange={onDateFilterChange}
        gameFilter={gameFilter}
        gameFilterOptions={gameFilterOptions}
        onGameFilterChange={onGameFilterChange}
      />
      <LeagueList leagues={leagues} isValidating={isValidating} />
      <CreateLeagueDialog
        open={showCreateDialog}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateLeague}
        mutate={mutate}
      />
      <JoinLeagueDialog
        open={showJoinDialog}
        onClose={handleCloseJoinDialog}
        onSubmit={handleJoinLeague}
        mutate={mutate}
      />
      <CreatedLeagueModal
        open={showCreatedLeagueModal}
        onClose={handleCloseCreatedLeagueModal}
        league={createdLeague}
      />
    </div>
  );
};

export default MyLeagues;
