import useSWR from "swr";

export const useMultipleGameDiary = ({ games = [], date = "This week", enabled = false }) => {
  const params = new URLSearchParams();
  params.append("date", date);

  //SEND LOCAL DATE IN MILLISECONDS.
  let d = new Date();
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  const completeDate = `${ye}-${mo}-${da}T00:00:00.000Z`;
  const currentDayForGameDate = Date.parse(completeDate);

  params.append("localDate", currentDayForGameDate);
  
  // Add all games to the query
  games.forEach(game => {
    params.append("games[]", game);
  });
  
  const queryParams = params.toString();
  const response = useSWR(
    enabled && games.length > 0 ? `/user/multiple-game-diary?${queryParams}` : null
  );
  return response;
};