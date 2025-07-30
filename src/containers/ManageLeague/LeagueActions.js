import React from "react";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { useDeleteLeague } from "../../api/deleteLeague";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import OutlineButton from "../../components/OutlineButton";
import TextButton from "../../components/TextButton";

const LeagueActions = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { execute } = useDeleteLeague();

  const deleteLeague = React.useCallback(async () => {
    try {
      await execute({ id: params.leagueId });
      toast.success("Deleted league");
      navigate("../my-leagues");
    } catch (e) {
      toast.error("Cannot delete league");
    }
  }, [execute, navigate, params.leagueId]);

  const reportLeague = React.useCallback((e) => {
    window.location.href = "mailto:contact@leaderboardle.com";
    e.preventDefault();
  }, []);

  const [showLeagueModal, setShowLeagueModal] = React.useState(false);

  return (
    <>
      <ConfirmationDialog
        showModal={showLeagueModal}
        setShowModal={setShowLeagueModal}
        title="Are you sure you want to delete this league?"
        click={deleteLeague}
      />
      <div className="mt-11 flex flex-col items-stretch">
        <OutlineButton onClick={() => setShowLeagueModal(true)}>
          Delete this League
        </OutlineButton>
        <TextButton
          onClick={(e) => reportLeague(e)}
          className="text-xs font-normal">
          Report Offensive Name
        </TextButton>
      </div>
    </>
  );
};

export default LeagueActions;
