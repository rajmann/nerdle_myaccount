import React from "react";

import { format, toDate } from "date-fns";
import { useNavigate } from "react-router-dom";

import { ReactComponent as SuccessIcon } from "../../assets/icons/success-icon.svg";
import BaseDialog from "../../components/BaseDialog";
import Button from "../../components/Button";
import TextButton from "../../components/TextButton";

const ScoreAddedDialog = ({ open, onClose, callback, score }) => {
  const navigate = useNavigate();

  const goToMyStatistics = React.useCallback(() => {
    navigate("../my-statistics");
    onClose();
  }, [navigate, onClose]);

  const date = React.useMemo(
    () =>
      score?.gameDate ? format(toDate(score.gameDate), "dd MMMM yyyy") : null,
    [score?.gameDate]
  );

  return (
    <BaseDialog open={open} closeDialog={onClose}>
      <div className="flex flex-1 flex-col justify-center p-5 text-center">
        <SuccessIcon className="h-16 w-16 self-center" />
        <h2 className="mt-4 text-xl font-semibold">Score Added!</h2>
        <p className="mt-2 text-sm">
          Your score for{" "}
          <span className={`font-semibold ${
            score?.gameName?.toLowerCase().includes('nerdle') ? 'nerdle-game-name' : ''
          }`}>
            {score?.gameName}
          </span> on{" "}
          <span className="font-semibold">{date}</span> has been successfully
          added.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={callback}
            className="focus-visible:ring-offset-dialog"
          >
            <span className="font-semibold">Add Another Score</span>
          </Button>
          <TextButton
            className="focus-visible:ring-offset-dialog"
            onClick={goToMyStatistics}
          >
            Check my stats
          </TextButton>
        </div>
      </div>
    </BaseDialog>
  );
};

export default ScoreAddedDialog;
