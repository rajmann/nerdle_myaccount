import React, { useEffect } from "react";

import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";
//import { gapi } from "gapi-script";
import jwtDecode from "jwt-decode";
// import GoogleLogin from "react-google-login";
import {
  Navigate,
  Link,
  useNavigate,
  createSearchParams
} from "react-router-dom";

import AppleIcon from "../assets/icons/appleIcon.svg";
// import GoogleIcon from "../assets/icons/googleIcon.svg";
import AppleSignInButton from "../components/AppleSignInButton";
import Button from "../components/Button";
import Drawer from "../components/Drawer";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Header from "../components/Header";
import NerdleMenuIcon from "../components/icons/NerdleMenuIcon";
import NerdleLogo from "../components/NerdleLogo";
import NerdleText from "../components/NerdleText";
import useAuth from "../hooks/useAuth";
import useLeagueCodeStore from "../store/useLeagueCodeStore";
import useOAuthParamsStore from "../store/useOAuthParamsStore";

const Landing = () => {
  const { token, isPWA, appPlatform } = useAuth();
  const { leagueCode } = useLeagueCodeStore();
  const { clientID, redirectURI } = useOAuthParamsStore();
  const navigate = useNavigate();
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  const onDrawerToggle = React.useCallback(() => {
    setDrawerIsOpen(prev => !prev);
  }, []);

  const onDrawerClose = React.useCallback(() => {
    setDrawerIsOpen(false);
  }, []);

  useEffect(() => {
    //function start() {
      //gapi.client.init({
        //client_Id:
          //"987197032798-q36obh48bkuj71fk7455hfs3c2hfvrpq.apps.googleusercontent.com",
        //scope: "",
      //});
    //}

    //gapi.load("client:auth2", start);
  });

  const handleSocialLogin = async (val) => {
    let data = {};
    if (val.authorization) {
      const payload = jwtDecode(val.authorization.id_token);
      const appleId = payload.sub;
      const email = payload.email;
      data = {
        provider: "apple",
        appleId,
        fullname: val.user
          ? `${val.user.name.firstName} ${val.user.name.lastName}`
          : "",
        email,
      };
    }
    if (val.google) {
      // we need to do extra call since the new library we used
      // only return the `access_token` that is valid
      // for calling endpoints with given `scopes`.
      const response = await axios.get("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${val.access_token}`
        }
      })
      data = {
        provider: "google",
        googleId: response.data.sub,
        email: response.data.email,
        fullname: response.data.name,
      };
    }
    if (val._provider) {
      data = {
        provider: val._provider,
        fbId: val._profile.id,
        fullname: val._profile.name,
        email: val._profile.email,
      };
    }
    navigate({
      pathname: "/sso",
      search: createSearchParams({ ...data }).toString(),
    });
  };

  // const handleSocialLoginFailure = (err) => {
  //   console.log(err);
  //   toast.error("There's a problem in logging in. Please try again!");
  // };

  // Redirect user to join league page if they have a league code
  if (token && leagueCode) {
    localStorage.removeItem("leagueCode");
    return <Navigate to={`join/${leagueCode}`} />;
  }

  // Redirect user to join league page if they have a pending authorization to a client app.
  if (token && clientID && redirectURI) {
    localStorage.removeItem('clientID');
    localStorage.removeItem('redirectURI');
    return <Navigate to={`oauth/authorize/${clientID}/${encodeURIComponent(redirectURI)}`} />;
  }

  // Redirect user after signing in
  if (token) {
    return <Navigate to="my-statistics" replace />;
  }

  return (
    <div className="relative flex h-screen max-h-[-webkit-fill-available] flex-col overflow-hidden">
      <Header className="z-50">
        <Header.Left>
          <div className="flex items-center gap-4">
            <button
              onClick={onDrawerToggle}
              className="text-gray-700 hover:text-nerdle-primary dark:text-gray-300 dark:hover:text-white p-1">
              <NerdleMenuIcon />
            </button>
            <NerdleLogo />
            <NerdleText />
          </div>
        </Header.Left>
        <Header.Right>
          <div className="flex items-center gap-3">
            <span 
              className="text-sm font-normal text-black dark:text-white"
              style={{ fontSize: '0.975em', fontFamily: "'Barlow', sans-serif" }}
            >
              account stats
            </span>
          </div>
        </Header.Right>
      </Header>
      <Drawer isOpen={drawerIsOpen} onClose={onDrawerClose} />
      <main className="flex-1 overflow-y-auto p-4 flex flex-col items-stretch justify-center text-center">
        <h1 className="mt-5 text-3xl font-semibold text-gray-900 dark:text-white">My account</h1>
        <p className="mt-5 text-xl text-gray-600 dark:text-gray-300">
          With a nerdle account, you can see your score history across all nerdle games here. You can add scores from other popular games like Wordle and Worldle too and even compete in leagues with other nerdle players.
        </p>
      <div className="mt-10 flex flex-col items-stretch gap-2">
        <hr className="mb-2" />
        <GoogleOAuthProvider clientId="987197032798-q36obh48bkuj71fk7455hfs3c2hfvrpq.apps.googleusercontent.com">
          <GoogleLoginButton onSuccess={handleSocialLogin} onFailure={(err) => console.log(err)} />
        </GoogleOAuthProvider>
        {/* Facebook login commented out per user request
        <div className="h-16">
          <SocialButton
            className="facebook"
            social="facebook"
            // autoLogin
            provider="facebook"
            appId="426743862785551"
            isPWA={isPWA}
            onLoginSuccess={handleSocialLogin}
          // onLoginFailure={handleSocialLoginFailure}
          />
        </div>
        */}
        <div>
          {(appPlatform === "ios" || !isPWA) && (
            <AppleSignInButton
              authOptions={{
                clientId: "com.nerdleleague.web.sid",
                redirectURI: (process.env.REACT_APP_API_URL || '').includes("dev") ? "https://dev.nerdleleague.com/sso" : "https://nerdleleague.com/sso",
                scope: "email name",
                state: "",
                nonce: "nonce",
                usePopup: true,
              }}
              onSuccess={handleSocialLogin}
              onError={(err) => console.log(err)}
              render={(renderProps) => (
                <button
                  className="relative flex h-[55px] w-full items-center justify-center rounded-lg bg-white p-4 text-[19px] text-black shadow-lg hover:bg-stone-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  {...renderProps}>
                  <img
                    src={AppleIcon}
                    className="absolute left-2 h-8 w-8"
                    alt="appleicon"
                  />
                  <span>Log in with Apple</span>
                </button>
              )}
              isPWA={isPWA}
            />
          )}
        </div>
      </div>
      <h3 className="mt-8 text-lg text-gray-600 dark:text-gray-300">OR</h3>

      <Link to="sign-up" className="mt-4">
        <Button className="w-full shadow-lg focus-visible:ring-offset-white">
          Create an account manually
        </Button>
      </Link>
      <div className="mt-7 text-sm text-gray-600 dark:text-gray-300 flex flex-col items-center">
        <span className="mb-2">Already have an account?</span>
        <Link to="sign-in">
          <Button className="py-2 px-4 text-sm shadow-lg focus-visible:ring-offset-white">
            Sign In
          </Button>
        </Link>
      </div>
        <p className="mt-4 text-sm text-gray-500">
          {localStorage.getItem("appVersion")}
        </p>
      </main>
    </div>
  );
};

export default Landing;
