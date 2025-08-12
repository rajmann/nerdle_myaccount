import React from "react";

import useSWR from "swr";

import { getDateRange, getCurrentDayForGameDate } from "../utils/dateRange";

export const useGameDiary = ({ game = "nerdlegame", date = "This week", id, dateFilter }) => {
  const params = new URLSearchParams();
  params.append("game", game);
  
  // Use startDate and endDate if dateFilter is provided (new API format)
  if (dateFilter) {
    const { startDate, endDate } = getDateRange(dateFilter);
    console.log(`Game Diary API: Using new format with dateFilter "${dateFilter.label}" (${dateFilter.value})`);
    console.log(`Date range: ${new Date(startDate).toISOString()} to ${new Date(endDate).toISOString()}`);
    params.append("startDate", startDate.toString());
    params.append("endDate", endDate.toString());
  } else {
    // Fallback to old format for backward compatibility
    console.log(`Game Diary API: Using old format with date "${date}"`);
    params.append("date", date);
    const currentDayForGameDate = getCurrentDayForGameDate();
    params.append("localDate", currentDayForGameDate);
  }

  if (id) {
    params.append("id", id);
  }
  const queryParams = params.toString();
  const response = useSWR(`/user/game-diary?${queryParams}`);
  return response;
};

// Hook for fetching multiple game diaries for enhanced multi-game display
export const useMultiGameDiary = ({ games = [], date = "This week", id, dateFilter }) => {
  // Helper function to create query params (same as single game diary)
  const createQueryParams = React.useCallback((gameValue) => {
    const params = new URLSearchParams();
    params.append("game", gameValue);
    
    // Use startDate and endDate if dateFilter is provided (new API format)
    if (dateFilter) {
      const { startDate, endDate } = getDateRange(dateFilter);
      console.log(`Multi-Game Diary API (${gameValue}): Using new format with dateFilter "${dateFilter.label}" (${dateFilter.value})`);
      params.append("startDate", startDate.toString());
      params.append("endDate", endDate.toString());
    } else {
      // Fallback to old format for backward compatibility
      console.log(`Multi-Game Diary API (${gameValue}): Using old format with date "${date}"`);
      params.append("date", date);
      const currentDayForGameDate = getCurrentDayForGameDate();
      params.append("localDate", currentDayForGameDate);
    }

    if (id) {
      params.append("id", id);
    }
    return params.toString();
  }, [date, dateFilter, id]);

  // Fixed number of hook calls to avoid hooks order violations
  const maxGames = 10;
  const responses = [];
  
  for (let i = 0; i < maxGames; i++) {
    const gameValue = i < games.length ? games[i] : null;
    const queryParams = gameValue ? createQueryParams(gameValue) : null;
    const url = queryParams ? `/user/game-diary?${queryParams}` : null;
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const response = useSWR(url);
    
    if (i < games.length) {
      responses.push(response);
    }
  }

  return responses;
};
