// Utility function to check if a game is a Nerdle game based on its URL
export const isNerdleGame = (game) => {
  if (!game?.url) return false;
  return game.url.includes('nerdlegame.com');
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
    url: game.url 
  }));

  // If score logging is disabled, filter to only show Nerdle games
  if (!scoreLoggingEnabled) {
    individualGames = individualGames.filter(game => isNerdleGame(game));
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

  // Build options array
  const options = [];
  
  if (nerdleGame) options.push(nerdleGame);
  
  // Only add "All Games" and "All Nerdle Games" if score logging is enabled
  if (scoreLoggingEnabled) {
    options.push(allGamesOption);
    if (allNerdleGamesOption) {
      options.push(allNerdleGamesOption);
    }
  }
  
  options.push(...otherGames);
  
  return options;
};