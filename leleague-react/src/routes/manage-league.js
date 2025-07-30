import React from "react";

import { useParams } from "react-router-dom";

import { useGames } from "../api/games";
import { useLeague } from "../api/league";
import LeagueInvite from "../components/LeagueInvite";
import Spinner from "../components/Spinner";
import LeagueActions from "../containers/ManageLeague/LeagueActions";
import LeagueGames from "../containers/ManageLeague/LeagueGames";
import LeagueMembers from "../containers/ManageLeague/LeagueMembers";
import LeagueName from "../containers/ManageLeague/LeagueName";

const ManageLeague = () => {
  const params = useParams();

  const { isValidating, mutate, data } = useLeague({ id: params.leagueId });

  const league = React.useMemo(() => data?.data, [data?.data]);

  const name = React.useMemo(
    () => league?.details.title,
    [league?.details.title]
  );

  const games = React.useMemo(() => league?.games, [league?.games]);

  const scoringSystem = React.useMemo(
    () => league?.details.scoringSystem,
    [league?.details.scoringSystem]
  );

  const members = React.useMemo(
    () =>
      league?.members?.map((member, index) => ({
        id: member.ID,
        rank: index + 1,
        ...member.details,
        SK: member.SK,
        memberId: member.memberId,
      })),
    [league?.members]
  );

  const code = React.useMemo(
    () => league?.invitationCode,
    [league?.invitationCode]
  );

  const { data: gamesList } = useGames();

  const allGames = React.useMemo(
    () =>
      gamesList?.data.map((game) => ({ label: game.name, value: game.value })),
    [gamesList?.data]
  );

  if (!league) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <LeagueName
        name={name}
        games={games}
        scoringSystem={scoringSystem}
        mutate={mutate}
        isValidating={isValidating}
      />
      <LeagueMembers
        members={members}
        mutate={mutate}
        isValidating={isValidating}
      />
      <LeagueInvite
        className="mt-10"
        leagueId={params.leagueId}
        title={name}
        code={code}
        mutate={mutate}
        isValidating={isValidating}
      />
      <LeagueGames
        name={name}
        games={games}
        scoringSystem={scoringSystem}
        allGames={allGames}
        mutate={mutate}
      />
      <LeagueActions />
    </div>
  );
};

export default ManageLeague;
