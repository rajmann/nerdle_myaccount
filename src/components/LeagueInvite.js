import React from "react";

import toast from "react-hot-toast";

import { useRefreshLeagueCode } from "../api/refreshLeagueCode";
import useAuth from "../hooks/useAuth";

import Button from "./Button";
import Spinner from "./Spinner";

const LeagueInvite = ({
  className,
  leagueId,
  code,
  mutate,
  isValidating,
  title,
}) => {
  const { isPWA } = useAuth();
  const copyInviteCode = React.useCallback(async () => {
    const shareText = `🧮✨Nerdle League: Please join my math puzzle league! \n League: ${title} \n League code: ${code}\n\n${window.location.origin}/join/${code}`;

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
  }, [code, title, isPWA]);

  const { execute } = useRefreshLeagueCode();

  const [isLoading, setIsLoading] = React.useState(false);

  const refreshInviteCode = React.useCallback(async () => {
    try {
      setIsLoading(true);
      await execute({ id: leagueId });
      mutate();
      toast.success("Refreshed league code");
    } catch (e) {
      toast.error("Cannot refresh league code");
      setIsLoading(false);
    }
  }, [execute, leagueId, mutate]);

  React.useEffect(() => {
    if (!isValidating) {
      setIsLoading(false);
    }
  }, [isValidating]);

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl bg-violet-400 bg-opacity-30 bg-[url('/src/assets/images/shield.svg')] bg-cover bg-right bg-no-repeat p-5 ${className}`}
    >
      <h3 className="font-semibold text-white">Invite Players</h3>
      <p className="text-xs text-white">
        Anyone with your league code can join your league.
      </p>
      <div className="flex items-center gap-2 rounded-lg bg-white p-1">
        <span className="flex flex-1 justify-center text-center text-xl text-violet-400">
          {isLoading ? <Spinner /> : code}
        </span>
        <Button
          onClick={copyInviteCode}
          className="focus-visible:ring-offset-white"
        >
          Share code
        </Button>
      </div>
      <button
        onClick={refreshInviteCode}
        className="self-start text-xs text-white underline hover:text-violet-300"
      >
        Refresh share code
      </button>
    </div>
  );
};

export default LeagueInvite;
