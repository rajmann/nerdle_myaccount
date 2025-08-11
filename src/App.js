import React from "react";

import ReactGA from "react-ga4";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import BasicLayout from "./components/layouts/BasicLayout";
import BottomTabsLayout from "./components/layouts/BottomTabsLayout";
import LeagueLayout from "./components/layouts/LeagueLayout";
import UserProfileLayout from "./components/layouts/UserProfileLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";
import AllGames from "./routes/all-games";
import ChangePassword from "./routes/change-password";
import ChangePasswordSuccess from "./routes/change-password-success";
import ForgotPassword from "./routes/forgot-password";
import JoinLeague from "./routes/join-league";
import Landing from "./routes/landing";
import League from "./routes/league";
import Logout from "./routes/logout";
import ManageLeague from "./routes/manage-league";
import MyLeagues from "./routes/my-leagues";
import MyStatistics from "./routes/my-statistics";
import NotFound from "./routes/not-found";
import OAuth from "./routes/oauth";
import Profile from "./routes/profile";
import ResetPassword from "./routes/reset-password";
import SignIn from "./routes/sign-in";
import SignUp from "./routes/sign-up";
import SSO from "./routes/sso";
import UserProfile from "./routes/user-profile";
import VerifyEmail from "./routes/verify-email";

const MEASUREMENT_ID = (process.env.REACT_APP_API_URL || '').includes("dev") ? 'G-22XDR6CGC3': 'G-83J58K2PLZ';
ReactGA.initialize(MEASUREMENT_ID);

const App = () => {
  const auth = useAuth();

  return (
    <div className="mx-auto h-screen min-w-min max-w-md bg-white dark:bg-gray-900 shadow-2xl shadow-gray-200 dark:shadow-gray-800">
    {/* <div className="mx-auto h-screen max-h-[-webkit-fill-available] min-w-min max-w-md bg-background shadow-2xl shadow-background"> */}
      <Toaster />
      <Routes>
        <Route element={<BasicLayout />}>
          <Route index element={<Landing />} />
          <Route path="sso" element={<SSO />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute isAllowed={auth.token} />}>
          <Route element={<BottomTabsLayout />}>
            <Route
                path="my-statistics"
                element={<MyStatistics />}
              />
              <Route
                path="my-statistics/:dateFilter"
                element={<MyStatistics />}
              />
            <Route path="my-leagues" element={<MyLeagues />} />
            <Route path="profile" element={<Profile />} />
            <Route path="all-games" element={<AllGames />} />
          </Route>
          <Route element={<LeagueLayout />}>
            <Route
              path="my-leagues/:leagueId/manage"
              element={<ManageLeague />}
            />
          </Route>
          <Route element={<UserProfileLayout />}>
            <Route path=":userId" element={<UserProfile />} />
          </Route>
          <Route path="change-password" element={<BasicLayout />}>
            <Route index element={<ChangePassword />} />
            <Route path="success" element={<ChangePasswordSuccess />} />
          </Route>
        </Route>
        <Route element={<LeagueLayout />}>
          <Route path="my-leagues/:leagueId" element={<League />} />
        </Route>
        <Route path="join/:leagueCode" element={<JoinLeague />} />
        <Route path="oauth/authorize/:client_id/:redirect_uri" element={<OAuth />} />
        <Route path="verify-email/:token" element={<VerifyEmail />} />
        <Route path="logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;