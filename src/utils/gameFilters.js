// Utility function to check if a game is a Nerdle game based on the nGame property
export const isNerdleGame = (game) => {
  // Check if the game has the nGame flag set to true (this is the most reliable indicator)
  return game?.nGame === true;
};

// Filter games to only include Nerdle games (URLs containing 'nerdlegame.com')
export const filterNerdleGames = (games) => {
  if (!Array.isArray(games)) return [];
  return games.filter(isNerdleGame);
};

// Get game filter options with conditional Nerdle-only filtering
export const getGameFilterOptions = (games, allGamesOption, allNerdleGamesOption, scoreLoggingEnabled = false) => {
  if (!Array.isArray(games)) return [];

  let individualGames = games.map((game) => ({ 
    label: game.name, 
    value: game.value,
    url: game.url,
    nGame: game.nGame
  }));

  // If score logging is disabled, filter to only show Nerdle games
  if (!scoreLoggingEnabled) {
    const originalCount = individualGames.length;
    individualGames = individualGames.filter(game => isNerdleGame(game));
    console.log(`Score logging disabled: Filtered games from ${originalCount} to ${individualGames.length} Nerdle games`);
  } else {
    console.log(`Score logging enabled: Showing all ${individualGames.length} games`);
  }

  // Find Nerdle (nerdlegame) game to put it first
  const nerdleGame = individualGames.find(game => 
    game.value === 'nerdlegame'
  );
  // Update the label to show "Nerdle (Classic)" instead of just "Nerdle"
  if (nerdleGame) {
    nerdleGame.label = 'Nerdle (Classic)';
  }
  const otherGames = individualGames.filter(game => 
    game !== nerdleGame
  ).sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

  // Build options array - start with "All Nerdle Games" as default
  const options = [];
  
  // Always add "All Nerdle Games" first as the default
  if (allNerdleGamesOption) {
    options.push(allNerdleGamesOption);
  }
  
  if (nerdleGame) options.push(nerdleGame);
  
  // Add "All Games" after nerdle options
  options.push(allGamesOption);
  
  options.push(...otherGames);
  
  return options;
};