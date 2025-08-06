import React from "react";

import { Link, useNavigate } from "react-router-dom";

import { useProfile } from "../../api/profile";
import { ReactComponent as DecreaseIcon } from "../../assets/icons/decrease.svg";
import { ReactComponent as GoldCrownIcon } from "../../assets/icons/gold-crown.svg";
import { ReactComponent as IncreaseIcon } from "../../assets/icons/increase.svg";
import Spinner from "../../components/Spinner";
import { nth } from "../../utils";
import TopRankingMember from "../League/TopRankingMember";

const LeagueList = ({ leagues, isValidating }) => {
  const navigate = useNavigate();
  const { data } = useProfile();
  const noLeagueMessage = React.useMemo(() => 
  {
    if(data !== undefined)
    {
      const memberData = {
        details:
        {
          fullname: data.name,
        },
        memberId: data.id,
        rankStatus: 'rankStatus',
        total: '',

      }
      return (<div className="flex flex-1 place-items-center">
        <div>
          <TopRankingMember
            key={0}
            member={memberData}
            index={1}
            nameAlternative='This could be you!'
          />
          <p className='text-gray-700 dark:text-gray-300 text-center text-sm mt-10 px-8 mb-20'>Leagues (for 1 to 50 people) allow you to compare your scores with friends.<br/><br/>Create your own league here or join someone else's once they share their league code.</p>
        </div>
      </div>)
    }
    else
    {
      <div></div>
    }
  }, [data]);

  const handleManageClick = React.useCallback(
    (e, leagueId) => {
      e.preventDefault();
      navigate(`${String(leagueId)}/manage`);
    },
    [navigate]
  );

  const getCurrentUser = React.useCallback(
    (leagueId) => {
      const league = leagues?.find((league) => league.ID === leagueId);
      const members = league?.members.map((member) => member);

      const user = members?.find(
        (member) => member.memberId === data?.id
      );

      const userRank = members?.findIndex((member) => member.memberId === data?.id) + 1;
      const userScore = user.total
      const userAdmin = user.details.makeAdmin;
      return { userRank, userScore, userAdmin };
    }
    , [leagues, data]
  );

  if (!leagues || isValidating) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (leagues.length === 0) {
    return ( noLeagueMessage );
  }

  return (
    <div className="mt-5 flex flex-col gap-3">
      {leagues?.map((league) => {
        const { userRank, userScore, userAdmin } = getCurrentUser(league.ID);
        return (
          <Link
            key={league.ID}
            to={String(league.ID)}
            className="flex min-w-fit items-center justify-between gap-4 rounded-lg bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 p-4 ring-nerdle-primary hover:ring-2 hover:border-nerdle-primary/20 transition-all duration-200 shadow-sm">
            <div className="flex-1 truncate">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {league.details.title}
              </h4>
              <div>
                <span className="text-xs font-light text-gray-600 dark:text-gray-300">
                  {league.members?.length || 0} members •
                </span>
                {userAdmin && (
                  <button
                    onClick={(e) => handleManageClick(e, league.ID)}
                    className="mx-1 text-xs text-black dark:text-white underline hover:text-gray-600 dark:hover:text-gray-300">
                    Manage
                  </button>
                )}
              </div>
            </div>
            <div className="flex w-1/3 min-w-fit justify-between gap-4">
              <span className="text-sm text-gray-900 dark:text-white font-medium">{userScore}</span>
              <div className="flex items-center gap-2">
                <span
                  className={
                    userRank === 1 ? "text-amber-500" : "text-gray-900 dark:text-white"
                  }>
                  {userRank === 1 ? <GoldCrownIcon /> : null}
                </span>
                <span
                  className={`text-sm font-medium ${userRank === 1 ? "text-amber-500" : "text-gray-900 dark:text-white"
                    }`}>
                  {`${userRank}${nth(userRank)}`}
                </span>
                <span>
                  {league.userRankStatus ? (
                    league.userRankStatus === "increased" ? (
                      <IncreaseIcon />
                    ) : (
                      <DecreaseIcon />
                    )
                  ) : null}
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  );
};

export default LeagueList;
