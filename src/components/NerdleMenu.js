import React from "react";

import { 
  MdClose, 
  MdHome, 
  MdHelp, 
  MdDescription, 
  MdNewspaper,
  MdBarChart,
  MdShare,
  MdCalculate,
  MdCalendarToday,
  MdShoppingBag,
  MdSettings,
  MdLogin,
  MdCheck
} from "react-icons/md";
import { Link } from "react-router-dom";

import NerdleLogo from "../assets/images/nerdle-logo.png";
import useAuth from "../hooks/useAuth";

const NerdleMenu = ({ isOpen, onClose }) => {
  const { user, signOut, isAuthenticated } = useAuth();
  
  // Mock game data - in real implementation this would come from props or context
  const gamesPlayed = user ? 5 : 0; // Mock number of games played
  
  const handleAction = (action) => {
    onClose();
    
    switch (action) {
      case 'info':
        window.open('https://nerdlegame.com/faqs.html', '_blank');
        break;
      case 'faqs':
        window.open('https://nerdlegame.com/faqs.html', '_blank');
        break;
      case 'blog':
        window.open('https://nerdlegame.com/', '_blank');
        break;
      case 'share':
        // Handle share action
        break;
      case 'calc':
        window.open('https://nerdlegame.com/', '_blank');
        break;
      case 'previous':
        window.open('https://nerdlegame.com/', '_blank');
        break;
      case 'settings':
        // Navigate to settings if available
        break;
      default:
        break;
    }
  };

  const nerdleGames = [
    {
      name: "nerdle",
      gameMode: "classic",
      url: "https://nerdlegame.com",
      img: "/logo192.png"
    },
    {
      name: "mini nerdle",
      gameMode: "mini", 
      url: "https://nerdlegame.com/mini",
      img: "/logo192.png"
    },
    {
      name: "speed nerdle",
      gameMode: "speed",
      url: "https://nerdlegame.com/speed", 
      img: "/logo192.png"
    },
    {
      name: "instant nerdle",
      gameMode: "instant",
      url: "https://nerdlegame.com/instant",
      img: "/logo192.png"
    }
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 z-[9999]"
      onClick={onClose}
    >
      <div
        className="absolute top-0 left-0 bottom-0 bg-white dark:bg-gray-800 z-50 max-w-[420px] w-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={NerdleLogo}
                alt="Nerdle logo"
                className="h-8 w-8"
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MdClose className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Main Menu Content */}
        <div className="p-4 space-y-1">
          {/* Login/User Section */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={onClose}
            >
              <MdLogin className="h-5 w-5" />
              <span>Login</span>
            </Link>
          ) : null}

          {/* Home */}
          <button
            onClick={() => window.open('https://nerdlegame.com', '_blank')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <MdHome className="h-5 w-5" />
            <span>Home</span>
          </button>

          {/* How to play */}
          <button
            onClick={() => handleAction('info')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <MdHelp className="h-5 w-5" />
            <span>How to play</span>
          </button>

          {/* FAQs */}
          <button
            onClick={() => handleAction('faqs')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <MdDescription className="h-5 w-5" />
            <span>FAQs</span>
          </button>

          {/* Blog */}
          <button
            onClick={() => handleAction('blog')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <MdNewspaper className="h-5 w-5" />
            <span>Blog</span>
          </button>

          {/* Profile/Stats - only show if games played */}
          {gamesPlayed > 0 && (
            <Link
              to="/my-statistics"
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={onClose}
            >
              <MdBarChart className="h-5 w-5 text-nerdle-primary" />
              <span>Profile/Stats</span>
            </Link>
          )}

          {/* Share */}
          <button
            onClick={() => handleAction('share')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <MdShare className="h-5 w-5" />
            <span>Share</span>
          </button>

          {/* Calculator */}
          <button
            onClick={() => handleAction('calc')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <MdCalculate className="h-5 w-5" />
            <span>Calculator</span>
          </button>

          {/* Replay games */}
          <button
            onClick={() => handleAction('previous')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <MdCalendarToday className="h-5 w-5" />
            <span>Replay games</span>
          </button>

          {/* Merch */}
          <button
            onClick={() => window.open('https://nerdlegame.com/index.html#merch', '_blank')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <MdShoppingBag className="h-5 w-5" />
            <span>Merch etc</span>
          </button>

          {/* Settings */}
          <Link
            to="/profile"
            className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-3 mb-3"
            onClick={onClose}
          >
            <MdSettings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>

        {/* Arcade Games Section */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Arcade math games
          </h3>
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => window.open('https://maff.games/digitdrop', '_blank')}
                className="block"
              >
                <img 
                  src="https://maff.games/digitdrop/assets/images/whiteDDPromo.gif" 
                  alt="Digit Drop"
                  className="w-full rounded"
                />
              </button>
              <button
                onClick={() => window.open('https://maff.games/adder?v002', '_blank')}
                className="block"
              >
                <img 
                  src="https://maff.games/digitdrop/assets/images/whiteAdderPromo.gif" 
                  alt="Adder"
                  className="w-full rounded"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Other Games Section */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Other games
          </h3>
          <div className="space-y-2">
            {nerdleGames.map((game, index) => (
              <button
                key={index}
                onClick={() => window.open(game.url, '_blank')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src={game.img}
                  alt={game.name}
                  className="h-8 w-8"
                />
                <span 
                  className="text-nerdle-primary dark:text-gray-200 font-medium"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  {game.name}
                </span>
                {/* Mock check icon for played games */}
                {index === 0 && (
                  <div className="ml-auto">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-nerdle-primary">
                      <MdCheck className="h-4 w-4 text-green-600 dark:text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NerdleMenu;