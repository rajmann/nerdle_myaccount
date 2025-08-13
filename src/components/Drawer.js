import React, { useState } from "react";

import {
  QuestionMarkCircleIcon,
  HomeIcon,
  LoginIcon,
  ShareIcon,
  ChartBarIcon,
  CogIcon,
  XIcon,
  CalculatorIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  NewspaperIcon,
  CheckIcon,
  UserIcon,
  LogoutIcon as HeroLogoutIcon,
  CollectionIcon,
} from "@heroicons/react/outline";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { games } from "../lib/gameList";
import useAddScoreStore, { dialogStates } from "../store/useAddScoreStore";

// Using Heroicons instead of custom icons for better compatibility

// Simple game tracking for played games (placeholder implementation)
const getGamesPlayedToday = () => {
  const played = localStorage.getItem("gamesPlayedToday");
  return played ? JSON.parse(played) : [];
};

// const setGamesPlayedToday = (gameMode) => {
//   const played = getGamesPlayedToday();
//   if (!played.includes(gameMode)) {
//     played.push(gameMode);
//     localStorage.setItem("gamesPlayedToday", JSON.stringify(played));
//   }
//   return played.length;
// };

const Drawer = ({ isOpen, onClose }) => {
  const { setDialogState } = useAddScoreStore();
  const auth = useAuth();
  const [isLoggedIn] = useState(
    localStorage.getItem("lbl_token") ? true : false,
  );
  const [gamesPlayed] = useState(1); // Placeholder - in real app this would track actual games

  const onSignOut = React.useCallback(() => {
    if (auth.isPWA) {
      window.ReactNativeWebView.postMessage("LOGOUT");
    }
    auth.signOut();
  }, [auth]);

  // Create game list with session tracking (simplified version)
  let gameList = "?gp=" + getGamesPlayedToday().length;
  if (typeof window !== "undefined" && window.sessionTime) {
    gameList = gameList + "&st=" + window.sessionTime;
  }

  // Sort games (simplified version of the original logic)
  const sortedGames = games;

  // Handle menu action (placeholder for modal/dialog actions)
  const handleAction = (action) => {
    onClose();
    console.log("Menu action:", action); // In real app, this would trigger modals/dialogs
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 z-[9999]"
      onClick={onClose}
    >
      <div
        className="absolute top-0 left-0 bottom-0 bg-white dark:bg-gray-800 z-50 pr-4 pt-4 pl-4 max-w-[420px] w-full dark:text-[#D7DADC] overflow-auto flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button positioned at top-right */}
        <XIcon 
          className="h-6 w-6 cursor-pointer dark:text-[#D7DADC] absolute top-4 right-4 z-10" 
          onClick={onClose}
        />
        
        <div className="w-full">
          {/* Header with logo */}
          <div className="flex items-center mb-4">
            <img
              src="https://nerdlegame.com/logo192.png"
              alt="Nerdlegame - the daily numbers game"
              className="h-8"
              aria-label="Nerdle logo - close menu"
            />
          </div>

          <div className="mt-8 pt-4 ml-2 max-w-[95%] mr-8 mx-auto items-center mb-4 h-full">
            {/* Login button (if not logged in) */}
            {!isLoggedIn && (
              <div
                className="flex mb-4 cursor-pointer active:bg-slate-400"
                onClick={() => {
                  onClose();
                  // In real app, this would open login modal
                  console.log("Open login modal");
                }}
                aria-label="Login"
                role="navigation"
              >
                <LoginIcon
                  className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                  style={{ marginRight: 10 }}
                />
                Login
              </div>
            )}

            {/* Home */}
            <div
              className="flex cursor-pointer active:bg-slate-400"
              onClick={() => {
                window.location.href =
                  "https://www.nerdlegame.com" + gameList + "&v002";
              }}
              aria-label="Home"
              role="navigation"
            >
              <HomeIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              Home
            </div>

            {/* How to play */}
            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => handleAction("info")}
              aria-label="Help"
              role="navigation"
            >
              <QuestionMarkCircleIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              How to play
            </div>

            {/* FAQs */}
            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => handleAction("faqs")}
              aria-label="FAQs"
              role="navigation"
            >
              <DocumentTextIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              FAQs
            </div>

            {/* Blog */}
            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => handleAction("blog")}
              aria-label="Blog"
              role="navigation"
            >
              <NewspaperIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              Blog
            </div>

            {/* Profile/Stats - Navigate to My Statistics */}
            {gamesPlayed > 0 && (
              <Link
                to="/my-statistics"
                className="flex mt-4 cursor-pointer active:bg-slate-400"
                onClick={onClose}
                aria-label="Stats"
                role="navigation"
              >
                <ChartBarIcon
                  className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                  style={{ marginRight: 10, color: "#398874" }}
                />
                Profile/Stats
              </Link>
            )}

            {/* Share */}
            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => handleAction("share")}
              aria-label="Share"
              role="navigation"
            >
              <ShareIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              Share
            </div>

            {/* Calculator */}
            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => handleAction("calc")}
              aria-label="Calculator"
              role="navigation"
            >
              <CalculatorIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              Calculator
            </div>

            {/* Replay games */}
            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => handleAction("previous")}
              aria-label="Previous games"
              role="navigation"
            >
              <CalendarIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              Replay games
            </div>

            {/* Merch */}
            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                window.location.href =
                  "https://www.nerdlegame.com/index.html#merch";
              }}
              aria-label="Merch"
              role="navigation"
            >
              <ShoppingBagIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              Merch etc
            </div>

            {/* Settings */}
            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => handleAction("settings")}
              aria-label="Settings"
              role="navigation"
              style={{ borderBottom: "1px solid black", paddingBottom: "10px" }}
            >
              <CogIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />
              Settings
            </div>

            {/* Arcade math games */}
            <div className="flex mt-2">Arcade math games</div>
            <div
              className="flex mt-0 cursor-pointer active:bg-slate-400"
              aria-label="Arcade games"
              role="navigation"
              style={{
                border: "1px solid gray",
                fontSize: "0.8rem",
                padding: "3px",
                marginRight: "5px",
              }}
            >
              <table>
                <tbody>
                  <tr style={{ width: "100%" }}>
                    <td
                      style={{ width: "50%" }}
                      onClick={() => {
                        window.location.href = "https://maff.games/digitdrop";
                      }}
                    >
                      <img
                        src="https://maff.games/digitdrop/assets/images/whiteDDPromo.gif"
                        style={{ width: "100%", margin: "0 0", border: "0px" }}
                        alt="Digit Drop"
                      />
                    </td>
                    <td
                      style={{ width: "50%" }}
                      onClick={() => {
                        window.location.href = "https://maff.games/adder?v002";
                      }}
                    >
                      <img
                        src="https://maff.games/digitdrop/assets/images/whiteAdderPromo.gif"
                        style={{ width: "100%", margin: "0 0", border: "0px" }}
                        alt="Adder"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* League menu items */}
            <div className="mt-8">
              <button
                onClick={() => {
                  onClose();
                  setDialogState(dialogStates.adding);
                }}
                className="flex w-full items-center gap-2 rounded-lg p-2 font-semibold text-nerdle-primary hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <MdAdd className="h-6 w-6" />
                <h6>Add Score</h6>
              </button>

              <Link
                to="/my-leagues"
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg p-2 mt-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <CollectionIcon className="h-6 w-6 flex-shrink-0 cursor-pointer dark:text-[#D7DADC]" style={{ marginRight: 10 }} />
                My Leagues
              </Link>

              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg p-2 mt-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <UserIcon className="h-6 w-6 flex-shrink-0 cursor-pointer dark:text-[#D7DADC]" style={{ marginRight: 10 }} />
                Profile
              </Link>

              {isLoggedIn && (
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 rounded-lg p-2 mt-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                >
                  <HeroLogoutIcon className="h-6 w-6 flex-shrink-0 cursor-pointer dark:text-[#D7DADC]" style={{ marginRight: 10 }} />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Other games section */}
        <div className="w-full">
          <div className="flex mt-1 mb-2 pt-1">Other games</div>

          <div>
            {sortedGames.map((game) => {
              let includeGame = true;
              if (game.startDate) {
                const startDate = new Date(game.startDate);
                const today = new Date();
                if (startDate > today) {
                  includeGame = false;
                }
              }

              if (includeGame) {
                let gamePlayedToday = getGamesPlayedToday().includes(
                  game.name || game.gameMode,
                );

                if (game.lastPlayedStartsWith) {
                  gamePlayedToday = getGamesPlayedToday().some((b) =>
                    b.startsWith(game.gameMode),
                  );
                }

                return (
                  <div
                    key={game.name}
                    className="flex leading-[2.6rem] cursor-pointer"
                    onClick={() => {
                      window.location.href = game.url + gameList;
                    }}
                    aria-label={game.name}
                    role="navigation"
                    style={{ position: "relative" }}
                  >
                    <div style={{ width: 65 }}>
                      <img
                        src={game.img}
                        className="mr-2"
                        alt={game.name}
                        aria-label={game.name}
                        style={{
                          height: 32,
                        }}
                      />
                    </div>
                    <div
                      className="text-[#398874] dark:text-[#D7DADC]"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      {game.name}
                    </div>

                    {gamePlayedToday && (
                      <div
                        style={{
                          position: "absolute",
                          right: -10,
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div className="mx-auto flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-[#398874]">
                          <CheckIcon
                            className="h-6 w-6 text-green-600 dark:text-green-100"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div style={{ height: 60 }} />
        </div>
      </div>
    </div>
  );
};

export default Drawer;
