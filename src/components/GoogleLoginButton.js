import React from "react";

import { useGoogleLogin } from "@react-oauth/google";

import GoogleIcon from "../assets/icons/googleIcon.svg";
import useAuth from "../hooks/useAuth";



export default function GoogleLoginButton({ onSuccess, onFailure }) {
  const { isPWA } = useAuth();
  console.log({ isPWA })
  const login = useGoogleLogin({
    onSuccess: credentials => onSuccess({ ...credentials, google: true }),
    onFailure: console.log,
    scope: "email profile"
        });
  return <button
        onClick={() => {
                return isPWA
                  ? window.ReactNativeWebView.postMessage("GOOGLE_LOGIN")
                  : login()
        }
              }
              className="relative my-[10px] flex h-[55px] w-full items-center justify-center rounded-lg bg-white p-4 text-[19px] text-black shadow-lg hover:bg-stone-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
              <img
                src={GoogleIcon}
                className="absolute left-2 h-8 w-8"
                alt="googleicon"
              />
              <span className="ml-2">Log in with Google</span>
            </button>
}
