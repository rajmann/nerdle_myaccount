import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import * as yup from "yup";

import { useCreateLeague } from "../../api/createLeague";
import { useGames } from "../../api/games";
import BaseDialog from "../../components/BaseDialog";
import Button from "../../components/Button";
import GameCheckbox from "../../components/GameCheckbox";
// import RadioButton from "../../components/RadioButton";
import Spinner from "../../components/Spinner";
// import useOptionsStore from "../../store/useOptionsStore";

const schema = yup
  .object({
    name: yup
      .string()
      .min(4, "League Name must be at least 4 characters")
      .max(32, "League Name must be at most 32 characters")
      .required("League Name is required"),
    games: yup
      .array()
      .min(1, "League must have at least 1 game")
      .required()
      .typeError("League must have at least 1 game"),
    // scoring: yup
    //   .string()
    //   .required("Scoring System is required")
    //   .typeError("Scoring System is required"),
  })
  .required();

const CreateLeagueDialog = ({ open, onClose, onSubmit, mutate }) => {
  const games = useGames();

  const gameOptions = React.useMemo(() => {
    const data = games.data?.data;
    return Array.isArray(data)
      ? data.map((game) => ({ label: game.name, value: game.value }))
      : [];
  }, [games.data?.data]);

  // const scoringSystems = useOptionsStore((state) => state.scoringSystems);

  const form = useForm({ resolver: yupResolver(schema) });

  const {
    register,
    formState: { errors },
  } = form;

  const { isLoading, execute } = useCreateLeague();

  const [selectedGames, setSelectedGames] = React.useState([]);

  const handleSubmit = React.useCallback(
    async (data) => {
      const { name, games,
        //  scoring
      } = data;

      const payload = {
        title: name,
        games: games.filter((game) => Boolean(game)),
        scoringSystem: "All 7 days/week", // scoring,
      };

      try {
        const response = await execute(payload);
        mutate();
        toast.success("Created league");
        onSubmit(response.data.data);
      } catch (error) {
        toast.error("Cannot create league");
      } finally {
        form.reset();
        setSelectedGames([]);
      }
    },
    [execute, form, mutate, onSubmit]
  );

  const handleClose = React.useCallback(() => {
    setSelectedGames([]);
    form.reset();
    onClose();
  }, [form, onClose]);

  return (
    <BaseDialog open={open} closeDialog={handleClose}>
      <div className="flex items-center justify-end">
        <button
          className="rounded-full p-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          onClick={handleClose}
        >
          <MdClose className="h-5 w-5" />
        </button>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-7 flex flex-1 flex-col"
      >
        <h1 className="text-xl font-semibold text-black">Create League</h1>
        <label className="mt-2 flex flex-col text-sm font-semibold text-black">
          League Name
          <input
            {...register("name")}
            type="text"
            placeholder="Enter Name here"
            className="mt-2 rounded-lg border-gray-200 p-5 text-sm text-black"
          />
        </label>
        {errors.name && (
          <span className="mt-1 text-sm text-red-400">
            {errors.name.message}
          </span>
        )}
        <p className="mt-5 text-sm font-semibold text-black">
          Select games to include:
        </p>
        <small className="mt-2 text-xs text-gray-400">
          Share a game score with your account to make any game available here.
        </small>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {gameOptions.map((game) => (
            <GameCheckbox
              {...register("games")}
              key={game?.value}
              value={game?.value}
              label={game?.label}
              checked={selectedGames.includes(game?.value)}
              onChange={(e) =>
                e.target.checked
                  ? setSelectedGames((selectedGames) => [
                    ...selectedGames,
                    game.value,
                  ])
                  : setSelectedGames((selectedGames) =>
                    selectedGames.filter(
                      (selectedGame) => selectedGame !== game.value
                    )
                  )
              }
            />
          ))}
        </div>
        {errors.games && (
          <span className="mt-1 text-sm text-red-400">
            {errors.games.message}
          </span>
        )}
        {/* <p className="mt-5 text-sm font-semibold text-black">Scoring System</p>
        <div className="mt-2 flex flex-col gap-2">
          {scoringSystems.map((scoringSystem) => (
            <RadioButton
              key={scoringSystem}
              control={form.control}
              name="scoring"
              value={scoringSystem}
              label={scoringSystem}
            />
          ))}
        </div>
        {errors.scoring && (
          <span className="mt-1 text-sm text-red-400">
            {errors.scoring.message}
          </span>
        )} */}
        <div className="mt-7 flex flex-col items-stretch">
          {isLoading ? (
            <Button type="submit" disabled>
              <Spinner />
              Creating League...
            </Button>
          ) : (
            <Button type="submit" className="focus-visible:ring-offset-dialog">
              Create League
            </Button>
          )}
        </div>
      </form>
    </BaseDialog>
  );
};

export default CreateLeagueDialog;
