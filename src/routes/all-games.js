import React from "react";
import { useState } from "react";

import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

import { useGameDiary } from "../api/gameDiary";
import { useGames } from "../api/games";
import { useProfile } from "../api/profile";
import { useProfilePhoto } from "../api/profilePhoto";
import { useStatistics } from "../api/statistics";
import { useStatisticsWvw } from "../api/statisticsWvw";
import CompleteGameList from "../components/CompleteGameList";
import Spinner from "../components/Spinner";
import UserDetails from "../components/UserDetails";
import useAuth from "../hooks/useAuth";
import useAnalyticsEventTracker from '../lib/useAnalyticsEventTracker';
import useMyStatisticsStore from "../store/useMyStatisticsStore";



let counter = 0;
const AllGames = () => {
  const games = useGames();
  const [prevRefresherValue, setPrevRefresherValue] = useState(0);
  const [refresher,] = useOutletContext();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker('All Games');
  const auth = useAuth();
  const isUsingApp = React.useMemo(() => auth? auth.isPWA: undefined, [auth]);




  const allGames = React.useMemo(() => games.data?.data, [games.data?.data]);

  const { gameFilter,dateFilter,  } =
    useMyStatisticsStore();

  const { data: profile} = useProfile();

  const { data: photo} = useProfilePhoto();

  const user = React.useMemo(() => ({ ...profile, photo }), [photo, profile]);

  let { data: apiData, mutate: mutateStatistics } = useStatistics({
    game: gameFilter.value,
    date: dateFilter.value,
  });

  let { data: wvwData, mutate: mutateStatisticsWvw } = useStatisticsWvw({
    game: gameFilter.value,
    date: dateFilter.value,
  });

  let { data: gameDiaryData, mutate: mutateGameDiary } = useGameDiary({
    game: gameFilter.value,
    date: dateFilter.value,
  });

  const data = React.useMemo(() => apiData?.data, [apiData?.data]);

  const gameStats = React.useMemo(
    () => ({ ...data?.stat, ww: wvwData?.data }),
    [data?.stat, wvwData?.data]
  );

  const gameDiary = React.useMemo(
    () =>
    {
      /* console.log('game diary:');
      console.log(gameDiaryData?.data) */
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


  if (!data || !gameStats || !gameDiary) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  //FOR REFRESHING EVERYTHING
  /* console.log('refresher0 = ' + refresher);
  console.log('PrevRefresherValue0 = ' + prevRefresherValue); */
  //if(counter === 0)
  
  if(prevRefresherValue === 0)
  {
    //FIRST TIME LOADED.
    //console.log('FIRST TIME LOADED.');

    if(counter !== refresher)
    {
      if(isUsingApp)
      {
        //console.log('USING APP!');
        gaEventTracker('page_load_all_games_pwa'); 
      }
      else
      {
        //console.log('USING WEB!');
        gaEventTracker('page_load_all_games_web');
      }
    }

    counter = refresher;
    //console.log('counter = ' + counter);
    setPrevRefresherValue(refresher);
    gaEventTracker('page_load_all_games');
    
  }
  else if (prevRefresherValue !== refresher)
  {
    //VIEW IS LOADED AND USER CLICKED THE TAB.
    //console.log('VIEW IS LOADED AND USER CLICKED THE TAB')
    //console.log('counter = ' + counter);
    setPrevRefresherValue(refresher);

    /* console.log('refresher1 = ' + refresher);
    console.log('PrevRefresherValue1 = ' + prevRefresherValue); */
    try
    {


      if(counter !== refresher)
      {
        counter = refresher;
        if(toast)
          toast.loading("Refreshing your stats.", { duration: 3000});
      }
    }
    catch(e)
    {}
    games.mutate();
    mutateStatistics();
    mutateStatisticsWvw();
    mutateGameDiary();
    /* mutateProfile();
    mutateProfilePhoto(); */
  }

  return (
    <div className="pb-20">
      <UserDetails user={user} />
      <CompleteGameList
        allGames={allGames}
        gamesToday={gamesToday}
        gamesPastTwoWeeks={gamesPastTwoWeeks}
      />
    </div>
  );
};

export default AllGames;
