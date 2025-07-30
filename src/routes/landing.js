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
import GoogleLoginButton from "../components/GoogleLoginButton";
import LogoMain from "../components/LogoMain";
import SocialButton from "../components/SocialButton";
import useAuth from "../hooks/useAuth";
import useLeagueCodeStore from "../store/useLeagueCodeStore";
import useOAuthParamsStore from "../store/useOAuthParamsStore";

const Landing = () => {
  const { token, isPWA, appPlatform } = useAuth();
  const { leagueCode } = useLeagueCodeStore();
  const { clientID, redirectURI } = useOAuthParamsStore();
  const navigate = useNavigate();

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
    //<div className="relative flex h-full flex-col items-stretch justify-center text-center"></div>
    <div className="flex flex-col items-stretch justify-center text-center">
      <LogoMain className="w-1/2 self-center" />
      <h1 className="mt-5 text-3xl font-semibold nerdle-name">{`Welcome to Nerdle League!`}</h1>
      <p className="mt-5 text-xl text-gray-400">
        Track your Nerdle scores and compete in leagues with friends. Join the math puzzle community!
      </p>
      <div className="mt-10 flex flex-col items-stretch gap-2">
        <hr className="mb-2" />
        <GoogleOAuthProvider clientId="987197032798-q36obh48bkuj71fk7455hfs3c2hfvrpq.apps.googleusercontent.com">
          <GoogleLoginButton onSuccess={handleSocialLogin} onFailure={(err) => console.log(err)} />
        </GoogleOAuthProvider>
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
                  className="relative flex h-[55px] w-full items-center justify-center rounded-lg bg-white p-4 text-[19px] shadow-lg hover:bg-stone-100"
                  {...renderProps}>
                  <img
                    src={AppleIcon}
                    className="absolute left-2 h-8 w-8"
                    alt="googleicon"
                  />
                  <span>Log in with Apple</span>
                </button>
              )}
              isPWA={isPWA}
            />
          )}
        </div>
      </div>
      <h3 className="mt-8 text-lg text-gray-400">OR</h3>

      <Link to="sign-up" className="mt-4">
        <Button className="w-full shadow-lg focus-visible:ring-offset-white">
          Create an account manually
        </Button>
      </Link>
      <span className="mt-7 text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          to="sign-in"
          className="text-violet-400 underline hover:text-violet-500">
          Sign In
        </Link>
      </span>
      <p className="mt-4 text-sm text-gray-300">
        {localStorage.getItem("appVersion")}
      </p>
    </div>
  );
};

export default Landing;
