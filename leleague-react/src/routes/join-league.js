import React from "react";

import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";

import JoinLeagueDialog from "../containers/JoinLeague/JoinLeagueDialog";
import useAuth from "../hooks/useAuth";
import useLeagueCodeStore from "../store/useLeagueCodeStore";

const JoinLeague = () => {
  const params = useParams();
  const { token } = useAuth();
  const { setLeagueCode } = useLeagueCodeStore();

  React.useEffect(() => {
    if (!token) {
      toast.error("You must be logged in to join a league.");
      setLeagueCode(params?.leagueCode);
      localStorage.setItem("leagueCode", params?.leagueCode);
    }
  }, [params?.leagueCode, setLeagueCode, token]);

  if (!token) {
    return <Navigate to="../" />;
  }

  return (
    <div className="grid h-full place-items-center">
      <JoinLeagueDialog open={true} code={params?.leagueCode} />
    </div>
  );
};

export default JoinLeague;
