import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import { useUpdateLeague } from "../../api/updateLeague";
import GameCheckBox from "../../components/GameCheckbox";

const schema = yup
  .object({
    games: yup.array().min(1, "League must have at least 1 game").required(),
  })
  .required();

const LeagueGames = ({ name, games = [], scoringSystem, allGames, mutate }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const params = useParams();

  const { execute } = useUpdateLeague();

  console.log({ scoringSystem, games })

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const payload = {
          leagueId: params.leagueId,
          body: {
            title: name,
            games: data.games,
            scoringSystem,
          },
        };
        await execute(payload);
        mutate();
        toast.success("Updated league games");
      } catch (e) {
        toast.error("Cannot update league games");
      }
    },
    [execute, mutate, name, params.leagueId, scoringSystem]
  );

  React.useEffect(() => {
    const subscription = watch(handleSubmit(onSubmit));
    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  return (
    <div className="mt-7">
      <h4 className="text-sm font-semibold text-white">
        Select games to include:
      </h4>
      <p className="mt-2 text-xs text-white">
        Share a game score with your account to make any game available here
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 grid grid-cols-3 gap-2"
      >
        {allGames.map((game) => (
          <GameCheckBox
            {...register("games")}
            key={game.value}
            label={game.label}
            value={game.value || game.value.toLowerCase()}
            defaultChecked={games.includes(game.value) || games.includes(game.value.toLowerCase())}
          />
        ))}
      </form>
      {errors.games && (
        <span className="mt-1 text-sm text-red-400">
          {errors.games.message}
        </span>
      )}
    </div>
  );
};

export default LeagueGames;
