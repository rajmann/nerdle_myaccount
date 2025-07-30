import React from "react";

import toast from "react-hot-toast";

import { useAddScore } from "../../api/addScore";
import BaseDialog from "../../components/BaseDialog";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import TextButton from "../../components/TextButton";
import useRefreshUserLeagues from "../../hooks/useRefreshUserLeagues";
import useRefreshUserStatistics from "../../hooks/useRefreshUserStatistics";

const OverwriteScoreDialog = ({ open, onClose, callback, score }) => {
  const { isLoading, execute } = useAddScore();

  const refreshUserStatistics = useRefreshUserStatistics();
  const refreshUserLeagues = useRefreshUserLeagues();

  const onOverwrite = React.useCallback(async () => {
    try {
      const response = await execute(score);
      refreshUserStatistics.refresh();
      refreshUserLeagues.refresh();
      callback({ status: "overwrite", score: response.data?.item });
    } catch (error) {
      toast.error(error.message);
    }
  }, [callback, execute, refreshUserLeagues, refreshUserStatistics, score]);

  return (
    <BaseDialog open={open} closeDialog={onClose}>
      <div className="flex flex-1 flex-col justify-center p-5 text-center">
        <h2 className="text-xl font-semibold">Just Checking!</h2>
        <div className="mt-2 flex flex-col gap-4 text-center">
          <p className="text-sm">
            You already have a score for this game and day. Nerdle League will
            based on trust - please be fair.
          </p>
          <p className="text-sm">
            Are you sure you want to overwrite your score?
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          {isLoading ? (
            <Button disabled className="focus-visible:ring-offset-dialog">
              <Spinner />
              Submitting...
            </Button>
          ) : (
            <Button
              onClick={onOverwrite}
              className="focus-visible:ring-offset-dialog"
            >
              <span className="font-semibold">Continue</span>
            </Button>
          )}
          <TextButton
            onClick={callback}
            className="focus-visible:ring-offset-dialog"
          >
            Back to Add Score
          </TextButton>
        </div>
      </div>
    </BaseDialog>
  );
};

export default OverwriteScoreDialog;
