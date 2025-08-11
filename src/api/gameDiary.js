import React from "react";

import useSWR from "swr";

export const useGameDiary = ({ game = "nerdlegame", date = "This week", id }) => {
  const params = new URLSearchParams();
  params.append("game", game);
  params.append("date", date);

  //SEND LOCAL DATE IN MILLISECONDS.
  let d = new Date();
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  const completeDate = `${ye}-${mo}-${da}T00:00:00.000Z`;
  const currentDayForGameDate = Date.parse(completeDate);
  //console.log(completeDate + ' = ' + currentDayForGameDate);

  params.append("localDate", currentDayForGameDate);
  //var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  //console.log('formatted: ' + localDate.toLocaleDateString("en-US", options));

  if (id) {
    params.append("id", id);
  }
  const queryParams = params.toString();
  const response = useSWR(`/user/game-diary?${queryParams}`);
  return response;
};

// Hook for fetching multiple game diaries for enhanced multi-game display
export const useMultiGameDiary = ({ games = [], date = "This week", id }) => {
  // Helper function to create query params (same as single game diary)
  const createQueryParams = React.useCallback((gameValue) => {
    const params = new URLSearchParams();
    params.append("game", gameValue);
    params.append("date", date);

    //SEND LOCAL DATE IN MILLISECONDS.
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const completeDate = `${ye}-${mo}-${da}T00:00:00.000Z`;
    const currentDayForGameDate = Date.parse(completeDate);

    params.append("localDate", currentDayForGameDate);

    if (id) {
      params.append("id", id);
    }
    return params.toString();
  }, [date, id]);

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
