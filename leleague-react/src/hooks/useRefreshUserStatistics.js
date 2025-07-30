import React from "react";

import { useSWRConfig } from "swr";

import useMyStatisticsStore from "../store/useMyStatisticsStore";

const useRefreshUserStatistics = () => {
  const { mutate } = useSWRConfig();

  const { gameFilter, dateFilter } = useMyStatisticsStore();

  const refresh = React.useCallback(() => {
    const params = new URLSearchParams();
    params.append("game", gameFilter.value);
    params.append("date", dateFilter.value);

      
    //SEND LOCAL DATE IN MILLISECONDS.
      
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const completeDate = `${ye}-${mo}-${da}T00:00:00.000Z`;
    const currentDayForGameDate = Date.parse(completeDate);
    //console.log(completeDate + ' = ' + currentDayForGameDate);

    params.append("localDate", currentDayForGameDate);
    
    const queryString = params.toString();
    mutate(`/user/statistics?${queryString}`);
    mutate(`/user/wvw?${queryString}`);
    mutate(`/user/game-diary?${queryString}`);
    mutate(`/user/getWeeklyScoresForSharing`);
    //console.log('REFRESHING STATS');
  }, [dateFilter.value, gameFilter.value, mutate]);

  return { refresh };
};

export default useRefreshUserStatistics;
