import React from "react";

import { format } from "date-fns";
import toast from "react-hot-toast";

import Button from "../components/Button";
import PlayLinkDialog from "../components/PlayLinkDialog";
import useAuth from "../hooks/useAuth";
import useAnalyticsEventTracker from '../lib/useAnalyticsEventTracker';
import { GameIcon, getGameDetails } from "../utils/gameIcons";

const RecentGames = ({ allGames, gamesToday, gamesPastTwoWeeks, showShareButton = true, onGameFilterChange }) => {

  const { isPWA } = useAuth();
  //FOR GOOGLE ANALYTICS
  const gaEventTracker = useAnalyticsEventTracker('My Statistics');

  // Dialog state for play link choices
  const [playLinkDialog, setPlayLinkDialog] = React.useState({
    isOpen: false,
    gameLink: '',
    gameName: ''
  });

  let gamesTodayUnique = gamesToday?.filter(
    (game, index) =>
      gamesToday?.findIndex(
        (g) => g.gameName.toLowerCase() === game.gameName.toLowerCase()
      ) === index
  );

  var byScore = gamesTodayUnique.slice(0);
  byScore.sort(function (a, b) {
    return b.calculatedScore - a.calculatedScore;
  });

  gamesTodayUnique = byScore;



  const gamesPastTwoWeeksUnique = gamesPastTwoWeeks?.filter(
    (game, index) =>
      gamesPastTwoWeeks?.findIndex(
        (g) => g.gameName.toLowerCase() === game.gameName.toLowerCase()
      ) === index
  );

  const gamesTodayWithDetails = React.useMemo(
    () =>
      gamesTodayUnique?.map((game) => {
        const detail = allGames?.find(
          (g) => g?.value.toLowerCase() === game?.gameName?.toLowerCase()
        );
        // Transform "nerdle" to "nerdle (classic)" for display
        let displayName = detail?.name;
        if (detail?.value === 'nerdlegame' && detail?.name === 'nerdle') {
          displayName = 'nerdle (classic)';
        }
        // Fallback: also check if game name from API data is "nerdle" or if gameName is "nerdlegame"
        if (!displayName || displayName === 'nerdle' || game?.gameName?.toLowerCase() === 'nerdlegame') {
          displayName = 'nerdle (classic)';
        }
        return {
          ...game,
          name: displayName,
          value: detail?.value,
          url: detail?.url,
        };
      }).sort((a, b) => {
        // Nerdle (Classic) always first
        if (a.name === 'nerdle (classic)') return -1;
        if (b.name === 'nerdle (classic)') return 1;
        
        // Then alphabetical by name
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }),
    [gamesTodayUnique, allGames]
  );

  const recentlyPlayedWithDetails = React.useMemo(
    () =>
      gamesPastTwoWeeksUnique?.map((game) => {
        const detail = allGames?.find(
          (g) => g?.value.toLowerCase() === game?.gameName?.toLowerCase()
        );
        // Transform "nerdle" to "nerdle (classic)" for display
        let displayName = detail?.name;
        if (detail?.value === 'nerdlegame' && detail?.name === 'nerdle') {
          displayName = 'nerdle (classic)';
        }
        // Fallback: also check if game name from API data is "nerdle" or if gameName is "nerdlegame"
        if (!displayName || displayName === 'nerdle' || game?.gameName?.toLowerCase() === 'nerdlegame') {
          displayName = 'nerdle (classic)';
        }
        return {
          ...game,
          name: displayName,
          value: detail?.value,
          url: detail?.url,
        };
      }).sort((a, b) => {
        // Nerdle (Classic) always first
        if (a.name === 'nerdle (classic)') return -1;
        if (b.name === 'nerdle (classic)') return 1;
        
        // Then alphabetical by name
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }),
    [gamesPastTwoWeeksUnique, allGames]
  );

  // get recently played games without today
  const recentlyPlayed = React.useMemo(
    () =>
      recentlyPlayedWithDetails?.filter(
        (game) =>
          gamesTodayWithDetails?.findIndex(
            (g) => g.gameName.toLowerCase() === game.gameName.toLowerCase()
          ) === -1
      ),
    [gamesTodayWithDetails, recentlyPlayedWithDetails]
  );

  // Get a suggested Nerdle game that hasn't been played recently
  const suggestedGame = React.useMemo(() => {

    if (!allGames || !recentlyPlayedWithDetails) return null;
    
    // Get all recent game names (today + past two weeks) for comparison
    const recentGameNames = [
      ...(gamesTodayWithDetails?.map(g => g.value?.toLowerCase()) || []),
      ...(recentlyPlayedWithDetails?.map(g => g.value?.toLowerCase()) || [])
    ];
    
    // Filter to only Nerdle games (nerdlegame.com domain) and exclude nDigits
    const nerdleGames = allGames.filter(game => 
      game?.url && game.url.includes('nerdlegame.com') && game?.value?.toLowerCase() !== 'ndigits'
    );
    
    // Filter out Nerdle games that have been played recently
    const unplayedNerdleGames = nerdleGames.filter(game => 
      game?.value && !recentGameNames.includes(game.value.toLowerCase())
    );
    
    // If no unplayed Nerdle games, return special message
    if (!unplayedNerdleGames.length) {
      return { showAllPlayedMessage: true };
    }
    
    // Pick a random game from unplayed Nerdle games
    const randomIndex = Math.floor(Math.random() * unplayedNerdleGames.length);
    const selectedGame = unplayedNerdleGames[randomIndex];
    
    // Use the same lookup logic as icons to get description
    const gameDetails = getGameDetails(selectedGame.value, allGames);
    const description = gameDetails.description || '';
    
    // Debug log for description lookup
    console.log('Description lookup result:', { 
      gameValue: selectedGame.value, 
      description: description,
      found: !!gameDetails.gameDetail
    });
    

    
    return {
      ...selectedGame,
      description
    };
  }, [allGames, gamesTodayWithDetails, recentlyPlayedWithDetails]);

  const purpleSquare = "\u{1f7ea}";

  const shareTodaysScore = React.useMemo(() => {
    const today = new Date();
    const gamesToday = gamesTodayWithDetails?.slice(0, 4);
    const extraGamesToday = gamesTodayWithDetails?.slice(4);

    const games = gamesToday?.map((game) => {
      const numberOfSquares = game?.calculatedScore;
      const squares = Array(numberOfSquares).fill(purpleSquare);
      return `${squares.join("")} ${game?.gameName} ${game?.calculatedScore
        }pt${game?.calculatedScore === 1 ? '' : 's'}`;
    });

    //console.log('games count = ' + gamesTodayWithDetails?.length);
    let totalPoints = 0;
    let totalGames = gamesTodayWithDetails?.length;
    for (var ctr = 0; ctr < gamesTodayWithDetails?.length; ctr++) {
      const game = gamesTodayWithDetails[ctr];
      totalPoints += game.calculatedScore;
    }

    //NAN ERROR W/ INSTANT NERDLE
    /* const totalPoints = games?.reduce((acc, game) => {
      const score = game?.split(" ")[2];
      return acc + parseInt(score);
    }, 0); */

    const averagePoints = Math.round((totalPoints * 10) / totalGames) / 10;
    const title = `🟪🟩⬛️My nerdleverse games for ${format(today, "dd MMM")}.`;
    const summary = `${averagePoints} point${averagePoints === 1 ? '' : 's'} per game (${totalGames} game${totalGames === 1 ? '' : 's'}, ${totalPoints} point${totalPoints === 1 ? '' : 's'}).`;
    const gameTexts = games?.join("\n");
    const extraGamesCount = `${extraGamesToday?.length > 0 ? `\n+${extraGamesToday?.length} more` : ""
      }`;
    /* const gamesPlayed = `Games Played = ${games?.length}`;
    const totalPointsText = `Points total = ${totalPoints}`;
    const averagePointsText = `avg = ${averagePoints}`; */

    const texts = `${title}\n\n${summary}\n${gameTexts}${extraGamesCount}.\n\nnerdlegame.com`;

    return texts;
  }, [gamesTodayWithDetails, isPWA]);

  const onShareScore = React.useCallback(async () => {
    if (gamesTodayUnique <= 0) {
      toast.error("Add scores for today in order to share.");
      return;
    }

    if (isPWA) {
      window.ReactNativeWebView.postMessage(`COPIED_FROM_CLIPBOARD:${shareTodaysScore}`);
    }
    else {
      try {
        await navigator.clipboard.writeText(shareTodaysScore);
        toast.success("Copied todays scores");
      } catch (error) {
        toast.error("Failed to copy todays scores");
      }
    }

    //console.log('GA: SHARED TODAY');
    gaEventTracker('shared_today');
  }, [gamesTodayUnique, isPWA, gaEventTracker, shareTodaysScore]);

  // Handle play link click
  const handlePlayLinkClick = React.useCallback((gameLink, gameName) => {
    setPlayLinkDialog({
      isOpen: true,
      gameLink,
      gameName
    });
  }, []);

  // Handle viewing game diary - filter to the selected game and close dialog
  const handleViewGameDiary = React.useCallback(() => {
    // Find the game in allGames to get the filter value
    // Handle special case for "nerdle (classic)" display name
    let searchName = playLinkDialog.gameName;
    if (searchName === 'nerdle (classic)') {
      searchName = 'Nerdle';
    }
    
    const gameDetail = allGames?.find(g => 
      g.name === searchName || 
      g.name.toLowerCase() === searchName.toLowerCase() ||
      (g.value === 'nerdlegame' && playLinkDialog.gameName === 'nerdle (classic)')
    );
    
    if (gameDetail && onGameFilterChange) {
      // Use the display name for the label if it's nerdle classic
      const displayLabel = gameDetail.value === 'nerdlegame' ? 'Nerdle (Classic)' : gameDetail.name;
      onGameFilterChange({ label: displayLabel, value: gameDetail.value });
    }
    setPlayLinkDialog({ isOpen: false, gameLink: '', gameName: '' });
  }, [allGames, onGameFilterChange, playLinkDialog.gameName]);

  // Handle going to game directly
  const handleGoToGame = React.useCallback(() => {
    window.open(playLinkDialog.gameLink, '_blank', 'noreferrer');
    setPlayLinkDialog({ isOpen: false, gameLink: '', gameName: '' });
  }, [playLinkDialog.gameLink]);

  return (
    <div className="mt-8">
      {/* <div className="text-sm font-semibold text-gray-900 mb-2">
        <h2>Played Today</h2>
      </div>

      <div className="h-full rounded-md bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 p-4">
        <div className="max-h-[125px] overflow-y-auto pr-4">
          {!gamesTodayWithDetails?.length ? (
            <p className="text-sm text-gray-500">No games played today</p>
          ) : (
            <>
              {gamesTodayWithDetails?.map(
                ({ name, calculatedScore, url }, index) => (
                  <div
                    key={index}
                    className="mb-1 flex items-center justify-between">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-black dark:text-white underline underline-offset-2 game-name">
                      {name}
                    </a>
                    <p className="text-sm text-gray-900">{calculatedScore}</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      <div className="text-sm font-semibold text-gray-900 dark:text-white mt-3 mb-2">
        <h2>Not Played Today</h2>
      </div>
      <div className="h-full rounded-md bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 p-4">
        <div className="max-h-[100px] overflow-y-auto pr-4">
          {!recentlyPlayed?.length ? (
            <p className="text-sm text-gray-500">All games played today</p>
          ) : (
            <>
              {recentlyPlayed?.map(({ name, url }, index) => (
                <div
                  key={index}
                  className="mb-1 flex items-center justify-between">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-nerdle-primary underline underline-offset-2">
                    {name}
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
 */}

      <div className="mb-3 grid grid-cols-2 gap-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <h3 style={{ fontFamily: 'Barlow, sans-serif' }}>Played Today</h3>
        <h3 style={{ fontFamily: 'Barlow, sans-serif' }}>Not Played Today</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="h-full rounded-lg bg-white border border-gray-200 p-2 shadow-sm relative overflow-hidden">
          {/* Paper texture lines */}
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-6 left-0 right-0 h-px bg-blue-100 opacity-30"></div>
          <div className="absolute top-12 left-0 right-0 h-px bg-blue-100 opacity-30"></div>
          <div className="absolute top-18 left-0 right-0 h-px bg-blue-100 opacity-30"></div>
          
          <div className="h-full relative z-10">
            {!gamesTodayWithDetails?.length ? (
              <p className="text-sm text-gray-500">No games played today</p>
            ) : (
              <>
                {gamesTodayWithDetails?.map(
                  ({ name, calculatedScore, url }, index) => (
                    <div
                      key={index}
                      className="mb-2 flex items-center">
                      <GameIcon 
                        gameName={name} 
                        gameData={{ nGame: url && url.includes('nerdlegame.com') }}
                        className="w-8 h-8 flex-shrink-0"
                      />
                      <span className="text-xs text-black game-name flex-1 min-w-0 ml-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                        {name}
                      </span>
                      <p className="text-xs text-black ml-4 font-medium">{calculatedScore}</p>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
        <div className="h-full">
          <div className="h-full rounded-lg bg-white border border-gray-200 p-2 shadow-sm relative overflow-hidden">
            {/* Paper texture lines */}
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-amber-50/20 to-transparent pointer-events-none"></div>
            <div className="absolute top-6 left-0 right-0 h-px bg-amber-100 opacity-30"></div>
            <div className="absolute top-12 left-0 right-0 h-px bg-amber-100 opacity-30"></div>
            <div className="absolute top-18 left-0 right-0 h-px bg-amber-100 opacity-30"></div>
            
            <div className="h-full relative z-10">
              {!recentlyPlayed?.length ? (
                <p className="text-sm text-gray-500">All games played today</p>
              ) : (
                <>
                  {recentlyPlayed?.map(({ name, url }, index) => (
                    <div
                      key={index}
                      className="mb-2 flex items-center">
                      <GameIcon 
                        gameName={name} 
                        gameData={{ nGame: url && url.includes('nerdlegame.com') }}
                        className="w-8 h-8 flex-shrink-0"
                      />
                      <span className="text-xs text-black game-name flex-1 min-w-0 ml-3" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                        {name}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-3 inline-block bg-nerdle-primary text-white text-xs px-2 py-1 rounded hover:bg-nerdle-primary/90 transition-colors font-medium no-underline">
                        play
                      </a>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      { showShareButton === true && (
        <div className="flex h-full flex-col items-stretch">
          <Button className="mt-4" onClick={onShareScore}>
            {`Share Today's Score${(gamesTodayUnique.length > 1) ? 's' : ''}`}
          </Button>
        </div>
      )}

      {/* Try a new game section */}
      {suggestedGame && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <h3 style={{ fontFamily: 'Barlow, sans-serif' }}>New game?</h3>
          </div>
          <div className="rounded-md bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 p-4">
            {suggestedGame.showAllPlayedMessage ? (
              <p className="text-sm text-black dark:text-white text-center" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Wow, you seem to have played them all!
              </p>
            ) : (
              <>
                <p className="text-xs text-black dark:text-white mb-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                  How about trying a game of...
                </p>
                <div className="flex items-start gap-3">
                  <GameIcon 
                    gameName={suggestedGame.name} 
                    gameData={{ nGame: suggestedGame.url && suggestedGame.url.includes('nerdlegame.com') }}
                    className="w-10 h-10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-black dark:text-white" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                        {suggestedGame.name === 'nerdle' ? 'Nerdle (Classic)' : suggestedGame.name}
                      </h4>
                      <button
                        onClick={() => window.open(suggestedGame.url, '_blank', 'noreferrer')}
                        className="inline-block bg-nerdle-primary text-white text-xs px-3 py-1.5 rounded hover:bg-nerdle-primary/90 transition-colors font-medium">
                        play
                      </button>
                    </div>
                    {(() => {
                      const gameDetails = getGameDetails(suggestedGame.name);
                      return gameDetails.description ? (
                        <p className="text-xs text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                          {gameDetails.description}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <PlayLinkDialog
        isOpen={playLinkDialog.isOpen}
        onClose={() => setPlayLinkDialog({ isOpen: false, gameLink: '', gameName: '' })}
        onViewGameDiary={handleViewGameDiary}
        onGoToGame={handleGoToGame}
        gameName={playLinkDialog.gameName}
      />
    </div>
  );
};

export default RecentGames;
