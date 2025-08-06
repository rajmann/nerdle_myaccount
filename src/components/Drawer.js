import React from "react";

import { FiExternalLink } from "react-icons/fi";
import { MdClose, MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

import NerdleLogo from "../assets/images/nerdle-logo.png";
import useAuth from "../hooks/useAuth";
import useDarkMode from "../hooks/useDarkMode";
import useAddScoreStore, { dialogStates } from "../store/useAddScoreStore";

import LeagueIcon from "./icons/LeagueIcon";
import LogoutIcon from "./icons/LogoutIcon";
import MoonIcon from "./icons/MoonIcon";
import ProfileIcon from "./icons/ProfileIcon";
import StatisticsIcon from "./icons/StatisticsIcon";
import SunIcon from "./icons/SunIcon";

const pages = [
  {
    label: "My Statistics",
    path: "my-statistics",
    icon: StatisticsIcon,
  },
  {
    label: "My Leagues",
    path: "my-leagues",
    icon: LeagueIcon,
  },
  {
    label: "Profile",
    path: "profile",
    icon: ProfileIcon,
  },
];

const externalPages = [
  {
    label: "About",
    path: "https://nerdlegame.com/",
  },
  {
    label: "FAQs",
    path: "https://nerdlegame.com/faqs.html",
  },
  {
    label: "T&Cs",
    path: "https://nerdlegame.com/",
  },
];


const Drawer = ({ isOpen, onClose }) => {
  const { setDialogState } = useAddScoreStore();
  const { isPWA } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const auth = useAuth();


  const onSignOut = React.useCallback(() => {
    if (auth.isPWA) {
      window.ReactNativeWebView.postMessage("LOGOUT");
    }
    auth.signOut();
  }, [auth]);

  return (
    <nav
      className={`absolute z-20 h-full w-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 ${isOpen
        ? "translate-x-0 transition-all duration-200"
        : "-translate-x-full transition-all duration-200"
        }`}>
      <div className="p-4">
        <div>
          <button
            onClick={onClose}
            className="h-11 w-11 rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[rgb(152,148,132)]">
            <MdClose className="h-full w-full" />
          </button>
        </div>
        <div className="mt-8">
          <button
            onClick={() => {
              onClose();
              setDialogState(dialogStates.adding);
            }}
            className="flex w-full items-center gap-2 rounded-lg p-2 font-semibold text-nerdle-primary hover:bg-gray-100 dark:hover:bg-[rgb(152,148,132)]">
            <MdAdd className="h-8 w-8" />
            <h6>Add Score</h6>
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {pages.map((page) => (
            <li key={page.label} onClick={onClose} className="flex">
              <Link
                to={page.path}
                className="flex flex-1 items-center gap-2 rounded-lg p-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[rgb(152,148,132)]">
                <page.icon />
                {page.label}
              </Link>
            </li>
          ))}
          <li key={"signout"} onClick={onSignOut} className="flex">  
            <Link
                to='#'
                className="flex flex-1 items-center gap-2 rounded-lg p-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[rgb(152,148,132)]">
                <LogoutIcon />
                Sign Out
              </Link>
            </li>
          <li key={"darkmode"} className="flex">
            <button
              onClick={toggleDarkMode}
              className="flex flex-1 items-center gap-2 rounded-lg p-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[rgb(152,148,132)]">
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
          <div className="h-8" />
          {externalPages.map((page) => (
            <li key={page.label} onClick={onClose} className="flex">
              <a
                href={page.path + "?external=true"}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center gap-4 rounded-lg px-5 py-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[rgb(152,148,132)]">
                <FiExternalLink />
                {page.label}
              </a>
            </li>
          ))}
          <div className="h-8" />
          {!!isPWA === false && (
            <li className="flex items-center">
              <a
                href="https://nerdlegame.com/"
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center gap-4 rounded-lg px-5 py-2 font-semibold text-nerdle-primary hover:bg-gray-100 dark:hover:bg-[rgb(152,148,132)]">
                <img
                  src={NerdleLogo}
                  alt="Visit Nerdle"
                  className="h-8 w-8 rounded"
                />
                Visit Nerdle
              </a>
            </li>
          )}
        </ul>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm self-center absolute bottom-0 pb-10">{localStorage.getItem("appVersion")}</p>
    </nav>
  );
};

export default Drawer;
