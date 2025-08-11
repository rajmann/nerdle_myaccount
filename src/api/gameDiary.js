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
  // Create stable URLs for SWR to avoid hooks order violations
  const urls = React.useMemo(() => {
    if (!games.length) return [];
    
    return games.map(gameValue => {
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
      const queryParams = params.toString();
      return `/user/game-diary?${queryParams}`;
    });
  }, [games, date, id]);

  // Use a single SWR call with all URLs combined
  const combinedKey = urls.length ? ['multi-game-diary', ...urls] : null;
  const response = useSWR(combinedKey, async () => {
    if (!urls.length) return [];
    
    // Fetch all game diaries in parallel
    const fetcher = (url) => fetch(url).then(res => res.json());
    const results = await Promise.allSettled(urls.map(fetcher));
    
    return results.map((result, index) => ({
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
      isLoading: false
    }));
  });

  // Return array of responses that matches the original interface
  if (!urls.length) {
    return [];
  }

  if (response.isLoading) {
    return urls.map(() => ({ data: null, error: null, isLoading: true }));
  }

  if (response.error) {
    return urls.map(() => ({ data: null, error: response.error, isLoading: false }));
  }

  return response.data || [];
};
