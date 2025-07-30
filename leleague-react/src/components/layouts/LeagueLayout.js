import React from "react";

import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi";
import {
  Link,
  Outlet,
  matchPath,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";

import { useDeleteMember } from "../../api/deleteMember";
import { useLeague } from "../../api/league";
import { useLeagues } from "../../api/leagues";
import { useProfile } from "../../api/profile";
import useAuth from "../../hooks/useAuth";
import Button from "../Button";
import ConfirmationDialog from "../ConfirmationDialog";
import Header from "../Header";

const LeagueLayout = ({ children }) => {
  const { token } = useAuth();
  const params = useParams();
  const { pathname } = useLocation();
  const isManage = matchPath("/my-leagues/:leagueId/manage", pathname);
  const { data: currentUser } = useProfile()
  const { data } = useLeague({ id: params.leagueId });

  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const league = React.useMemo(() => data?.data, [data?.data]);

  const leaguesApi = useLeagues({ game: "all", date: "All time" });

  const leagues = React.useMemo(
    () => leaguesApi.data?.data,
    [leaguesApi.data?.data]
  );

  const navigate = useNavigate()

  const { execute } = useDeleteMember()

  const user = React.useMemo(() => {
    const league = leagues?.find((league) => league.ID === params.leagueId);
    const members = league?.members.map((member) => member);

    const user = members?.find(
      (member) => member.memberId === currentUser?.id
    );

    return user;

  }, [leagues, params.leagueId, currentUser]);


  const handleDeleteMember = React.useCallback(async () => {
    await execute({ ID: user?.ID, SK: user?.SK })
    setShowConfirmation(false);
    toast.success("You have left the league");
    navigate(`/my-leagues/`)
  }, [execute, user?.ID, user?.SK, navigate]);


  const isMember = React.useMemo(
    () =>
      (!leaguesApi.isValidating)
        ? token &&
        leagues.filter(
          (league) =>
            league.ID === params.leagueId ||
            league.invitationCode === params.leagueId
        ).length > 0
        : true,
    [leagues, leaguesApi.isValidating, params.leagueId, token]
  );

  React.useEffect(() => {
    if (user) {
      setIsAdmin(user?.details.makeAdmin);
    }
  }, [user])

  if (isManage) {
    return (
      <div className="flex h-screen flex-col">
        <Header>
          <Header.Left>
            <Link to="../my-leagues">
              <HiArrowLeft className="h-6 w-6 text-white" />
            </Link>
          </Header.Left>
          <Header.Center>
            <span className="font-semibold text-white">Manage League</span>
          </Header.Center>
          <Header.Right />
        </Header>
        <main className="flex-1 overflow-y-auto p-4">
          {children ? children : <Outlet />}
        </main>
      </div>
    );
  }

  return (
    <>
      <ConfirmationDialog
        showModal={showConfirmation}
        setShowModal={setShowConfirmation}
        title="Are you sure you want to leave this league?"
        click={handleDeleteMember}
      />
      <div className="flex h-screen flex-col">
        <Header>
          <Header.Left>
            <Link to="../my-leagues">
              <HiArrowLeft className="h-6 w-6 text-white" />
            </Link>
          </Header.Left>
          <Header.Center>
            <span className="font-semibold text-white">
              {league?.details.title}
            </span>
          </Header.Center>
          <Header.Right>
            {!isMember ? (
              <Link
                to={`join/${league?.invitationCode}`}
                className="text-violet-400 hover:underline"
              >
                Join
              </Link>
            ) : (<>
              {isAdmin === false && (
                <Button onClick={() => setShowConfirmation(true)} className="text-white text-sm py-1 rounded-md">Leave</Button>
              )}
            </>
            )}
          </Header.Right>
        </Header>
        <main className="flex-1 overflow-y-auto p-4">
          {children ? children : <Outlet />}
        </main>
      </div>
    </>
  );
};

export default LeagueLayout;
