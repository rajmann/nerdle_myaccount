import React from "react";

import { useSWRConfig } from "swr";

import useMyLeaguesStore from "../store/useMyLeaguesStore";

const useRefreshUserLeagues = () => {
  const { mutate } = useSWRConfig();

  const { gameFilter, dateFilter } = useMyLeaguesStore();

  const refresh = React.useCallback(() => {
    const params = new URLSearchParams();
    params.append("game", gameFilter.value);
    params.append("date", dateFilter.value);
      
    //SEND LOCAL DATE IN MILLISECONDS.
    
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const completeDate = `${ye}-${mo}-${da}T00:00:00.000Z`;
    const currentDayForGameDate = Date.parse(completeDate);
    //console.log(completeDate + ' = ' + currentDayForGameDate);

    params.append("localDate", currentDayForGameDate);
    
    const queryString = params.toString();
    mutate(`/league/list?${queryString}`);
  }, [dateFilter.value, gameFilter.value, mutate]);

  return { refresh };
};

export default useRefreshUserLeagues;
