import React from "react";

import { MdAdd } from "react-icons/md";

import useAddScoreStore, { dialogStates } from "../../store/useAddScoreStore";

import AddScoreDialog from "./AddScoreDialog";
import OverwriteScoreDialog from "./OverwriteScoreDialog";
import ScoreAddedDialog from "./ScoreAddedDialog";

const AddScore = () => {
  const { dialogState, setDialogState, score, setScore } = useAddScoreStore();

  const addScoreDialogCallback = React.useCallback(
    (data) => {
      if (data?.status === "overwrite") {
        setScore(data.score);
        setDialogState(dialogStates.overwrite);
      } else {
        setScore(data);
        setDialogState(dialogStates.added);
      }
    },
    [setDialogState, setScore]
  );

  const scoreAddedDialogCallback = React.useCallback(() => {
    setDialogState(dialogStates.adding);
    setScore(null);
  }, [setDialogState, setScore]);

  const overwriteScoreDialogCallback = React.useCallback(
    (data) => {
      if (data.status === "overwrite") {
        setScore(data.score);
        setDialogState(dialogStates.added);
      } else {
        setScore(null);
        setDialogState(dialogStates.adding);
      }
    },
    [setDialogState, setScore]
  );

  const onClose = React.useCallback(() => {
    setDialogState(dialogStates.closed);
    setScore(null);
  }, [setDialogState, setScore]);

  return (
    <>
      <button
        className="absolute bottom-20 right-4 h-14 w-14 rounded-full bg-nerdle-primary p-3 hover:bg-nerdle-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-nerdle-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={() => setDialogState(dialogStates.adding)}>
        <MdAdd className="h-full w-full text-white" />
      </button>
      <AddScoreDialog
        open={dialogState === dialogStates.adding}
        callback={addScoreDialogCallback}
        onClose={onClose}
      />
      <ScoreAddedDialog
        open={dialogState === dialogStates.added}
        callback={scoreAddedDialogCallback}
        onClose={onClose}
        score={score}
      />
      <OverwriteScoreDialog
        open={dialogState === dialogStates.overwrite}
        callback={overwriteScoreDialogCallback}
        onClose={onClose}
        score={score}
      />
    </>
  );
};

export default AddScore;
