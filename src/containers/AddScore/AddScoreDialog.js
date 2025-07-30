import React from "react";

import { Adsense } from "@ctrl/react-adsense";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdChevronRight, MdClose } from "react-icons/md";
import * as yup from "yup";

import { useAddScore } from "../../api/addScore";
import { useCheckScore } from "../../api/checkScore";
import ShareApp from "../../assets/images/share-app.svg";
import BaseDialog from "../../components/BaseDialog";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth";
import useRefreshUserLeagues from "../../hooks/useRefreshUserLeagues";
import useRefreshUserStatistics from "../../hooks/useRefreshUserStatistics";

const schema = yup
  .object({
    score: yup.string().required("Score is required"),
  })
  .required();

const AddScoreDialog = ({ open, callback, onClose }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { isPWA } = useAuth();

  const checkScoreApi = useCheckScore();
  const addScoreApi = useAddScore();

  const isLoading = React.useMemo(
    () => checkScoreApi.isLoading || addScoreApi.isLoading,
    [addScoreApi.isLoading, checkScoreApi.isLoading]
  );

  const refreshUserStatistics = useRefreshUserStatistics();
  const refreshUserLeagues = useRefreshUserLeagues();

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const score = data.score;
        const checkScoreResponse = await checkScoreApi.execute(score);
        if (checkScoreResponse.data?.data) {
          callback({ status: "overwrite", score });
        } else {
          const addScoreResponse = await addScoreApi.execute(score);
          refreshUserStatistics.refresh();
          refreshUserLeagues.refresh();
          callback(addScoreResponse.data?.item);
        }
        reset();
      } catch (error) {
        toast.error(error.message);
      }
    },
    [
      addScoreApi,
      callback,
      checkScoreApi,
      refreshUserLeagues,
      refreshUserStatistics,
      reset,
    ]
  );

  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  return (
    <BaseDialog open={open} closeDialog={handleClose}>
      <div className="flex items-center justify-end">
        <button
          className="rounded-full p-2 hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          onClick={handleClose}>
          <MdClose className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-7 flex flex-1 flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start gap-2">
          <h2 className="text-xl font-semibold">Add Score</h2>
          <p className="font-semibold">3 ways to add your score:</p>
          <div className="mt-2 flex">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">1. Share to mobile app</p>
              <p className="text-sm">
                On mobile, share direct to the Leaderboardle app
              </p>
              {!!isPWA === false && (
                <a
                  href="https://www.leaderboardle.com/download.html?external=true"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 text-xs font-semibold text-violet-400 underline hover:text-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2">
                  Download app now
                </a>
              )}
            </div>
            <img src={ShareApp} alt="share-app" className="w-36" />
          </div>
          <p className="text-sm font-semibold">2. For all nerdle games</p>
          <p className="text-sm">
            Log-in on the nerdle share screen to share all games automatically.
          </p>
          <p className="text-sm font-semibold">
            3. Or paste share text here and submit
          </p>
          <textarea
            {...register("score")}
            className="w-full resize-none rounded-md border-gray-200 p-5 text-sm"
            rows={4}
          />
          {errors.score && (
            <span className="mt-1 text-sm text-red-400">
              {errors.score.message}
            </span>
          )}
          {isLoading ? (
            <Button
              type="submit"
              disabled
              className="focus-visible:ring-offset-dialog">
              <Spinner />
              Submitting...
            </Button>
          ) : (
            <Button type="submit" className="focus-visible:ring-offset-dialog">
              Submit Score
              <div className="flex items-center justify-center rounded-full bg-white">
                <MdChevronRight className="h-6 w-6 text-violet-400" />
              </div>
            </Button>
          )}
        </form>
        <a
          href="https://www.leaderboardle.com/faqs.html?external=true"
          target="_blank"
          rel="noreferrer"
          className="mt-12 text-sm font-semibold text-violet-400 underline hover:text-violet-500">
          For help with adding scores by game
        </a>
        <div className="mt-12 flex justify-center">
          <Adsense
            client="ca-pub-1008130700664775"
            slot="8564472809"
            style={{ display: "inline-block", width: 320, height: 100 }}
            format=""
          />
        </div>
      </div>
    </BaseDialog>
  );
};

export default AddScoreDialog;
