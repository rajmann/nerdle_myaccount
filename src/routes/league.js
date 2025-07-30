import React from "react";

import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { useGames } from "../api/games";
import { useLeague } from "../api/league";
import Button from "../components/Button";
import GameAndDateFilters from "../components/GameAndDateFilters";
import Spinner from "../components/Spinner";
import LeagueScoringSystem from "../containers/League/LeagueScoringSystem";
import Member from "../containers/League/Member";
import TopRankingMember from "../containers/League/TopRankingMember";
import useAuth from "../hooks/useAuth";
import useOptionsStore from "../store/useOptionsStore";

const League = () => {
  const games = useGames();

  const { isPWA } = useAuth();

  const { allGamesOption, dateFilterOptions } = useOptionsStore((state) => ({
    allGamesOption: state.allGamesOption,
    dateFilterOptions: state.dateOptions,
  }));

  const [gameFilter, setGameFilter] = React.useState(allGamesOption);
  const [dateFilter, setDateFilter] = React.useState(dateFilterOptions[0]);

  const onDateFilterChange = React.useCallback(
    (value) => {
      const option = dateFilterOptions.find((option) => option.value === value);
      setDateFilter(option);
    },
    [dateFilterOptions]
  );

  const params = useParams();

  const { isValidating, data } = useLeague({
    id: params.leagueId,
    game: gameFilter.value,
    date: dateFilter.value,
  });

  const league = React.useMemo(() => data?.data, [data?.data]);
  const leagueGames = React.useMemo(
    () =>
      league?.games.map((game) => {
        return game;
      }),
    [league?.games]
  );

  const gameFilterOptions = React.useMemo(() => {
    const data = games.data?.data;
    const options = [
      allGamesOption,
      ...(Array.isArray(data)
        ? data
          .map((game) => ({ label: game.name, value: game.value }))
          .filter((game) => leagueGames?.includes(game.value) || leagueGames?.includes(game.value.toLowerCase()))
        : []),
    ];
    return options;
  }, [allGamesOption, games.data?.data, league?.games]);

  const onGameFilterChange = React.useCallback(
    (value) => {
      const option = gameFilterOptions.find((option) => option.value === value);
      setGameFilter(option);
    },
    [gameFilterOptions]
  );

  const members = React.useMemo(() => league?.members, [league?.members]);

  const shareText = React.useMemo(() => {
    const getText = (icon, rank) => {
      if (!league?.members[rank - 1]) return "";
      const member = league?.members[rank - 1];
      return `${icon} ${member?.details?.fullname} (${member.total} points)\n`;
    };
    const text = `🧮✨Nerdle League stats update for "${league?.details.title
      }" league (${dateFilter?.label}):\n\n${getText("🥇", 1)}${getText(
        "🥈",
        2
      )}${getText("🥉", 3)}\n${window.location.origin}/my-leagues/${league?.ID}`;

    return text;
  }, [dateFilter?.label, league?.ID, league?.details.title, league?.members]);

  const onShareLeague = React.useCallback(async () => {
    if (isPWA) {
      window.ReactNativeWebView.postMessage(`COPIED_FROM_CLIPBOARD:${shareText}`);
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Copied league scores");
      } catch (e) {
        toast.error("Cannot copy league scores");
      }
    }
  }, [shareText, isPWA]);

  const onShareLeagueCode = React.useCallback(async () => {
    const shareText = `🟣🟧LeaderboardLe: Please join my -le game league. \n League: ${league?.details.title} \n League code: ${league?.invitationCode}\n\n${window.location.origin}/join/${league?.invitationCode}`;

    if (isPWA) {
      window.ReactNativeWebView.postMessage(`COPIED_FROM_CLIPBOARD:${shareText}`);
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Copied league code");
      } catch (e) {
        toast.error("Cannot copy league code");
      }
    }
  }, [league?.details.title, league?.invitationCode, isPWA]);

  if (isValidating) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!league) {
    return (
      <div>
        <LeagueScoringSystem scoringSystem={league?.details.scoringSystem} />
        <GameAndDateFilters
          className="mt-2"
          gameFilter={gameFilter}
          gameFilterOptions={gameFilterOptions}
          onGameFilterChange={onGameFilterChange}
          dateFilter={dateFilter}
          dateFilterOptions={dateFilterOptions}
          onDateFilterChange={onDateFilterChange}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-stretch">
      <LeagueScoringSystem scoringSystem={league?.details.scoringSystem} />
      <GameAndDateFilters
        className="mt-2"
        gameFilter={gameFilter}
        gameFilterOptions={gameFilterOptions}
        onGameFilterChange={onGameFilterChange}
        dateFilter={dateFilter}
        dateFilterOptions={dateFilterOptions}
        onDateFilterChange={onDateFilterChange}
      />
      {/* Top 3 */}
      <div className="mt-8 flex gap-2">
        {[members[1], members[0], members[2]].map((member, index) => (
          <TopRankingMember
            key={member?.memberId || index}
            member={member}
            index={index}
          />
        ))}
      </div>
      {/* All Members */}
      <div className="mt-7 flex flex-1 flex-col gap-3 overflow-y-auto">
        {members.slice(3, members.length).map((member, index) => (
          <Member
            key={member?.memberId || index}
            member={member}
            index={index}
          />
        ))}
      </div>
      <Button className="mt-7" onClick={onShareLeague}>
        Share League Scores
      </Button>
      <Button className="my-4" onClick={onShareLeagueCode}>
        Share League Code
      </Button>
    </div>
  );
};

export default League;
