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
