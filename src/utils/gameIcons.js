// Game icon mapping based on nerdle/src/lib/gameList.ts
const gameIconMap = {
  // Nerdle games (from nerdle gameList.ts) - prepend https://nerdlegame.com for relative paths
  'nerdlegame': 'https://nerdlegame.com/newicons/classic.png',
  'classic': 'https://nerdlegame.com/newicons/classic.png',
  'nerdle (classic)': 'https://nerdlegame.com/newicons/classic.png',
  'micro nerdlegame': 'https://nerdlegame.com/newicons/micro.png',
  'micro': 'https://nerdlegame.com/newicons/micro.png',
  'mini nerdlegame': 'https://nerdlegame.com/newicons/mini.png',
  'mini': 'https://nerdlegame.com/newicons/mini.png',
  'midi nerdlegame': 'https://nerdlegame.com/newicons/midi.png',
  'midi': 'https://nerdlegame.com/newicons/midi.png',
  'maxi nerdlegame': 'https://nerdlegame.com/newicons/maxi.png',
  'maxi': 'https://nerdlegame.com/newicons/maxi.png',
  'mini-bi nerdlegame': 'https://nerdlegame.com/newicons/mini-bi.png',
  'mini-bi': 'https://nerdlegame.com/newicons/mini-bi.png',
  'bi nerdlegame': 'https://nerdlegame.com/newicons/bi.png',
  'bi': 'https://nerdlegame.com/newicons/bi.png',
  'quad nerdlegame': 'https://nerdlegame.com/newicons/quad.png',
  'quad': 'https://nerdlegame.com/newicons/quad.png',
  'decoy nerdlegame': 'https://nerdlegame.com/newicons/decoy-logo.png',
  'decoy': 'https://nerdlegame.com/newicons/decoy-logo.png',
  'speed nerdlegame': 'https://nerdlegame.com/newicons/speed.png',
  'speed': 'https://nerdlegame.com/newicons/speed.png',
  'instant nerdlegame': 'https://nerdlegame.com/newicons/instant.png',
  'instant': 'https://nerdlegame.com/newicons/instant.png',
  'twords': 'https://nerdlegame.com/newicons/twords-logo.png',
  'shuffle': 'https://nerdlegame.com/s/shuffleSm.png',
  'crossnerdle': 'https://nerdlegame.com/crossnerdle/crossnerdle_icon.png',
  'nanagrams': 'https://nerdlegame.com/nanagram/favicon.png',
  '2d nerdle': 'https://nerdlegame.com/s/nerdle2dSm.png',
  'targets': 'https://nerdlegame.com/s/targetsSm.png',
  'maffdoku': 'https://nerdlegame.com/maffdoku/maffdokuSm.png',
};

// Utility to check if a game is a Nerdle game (imported from gameFilters.js)
const isNerdleGame = (game) => {
  return game?.nGame === true;
};

// Get icon URL for a game, or return null if no icon exists
export const getGameIcon = (gameName, gameData = null) => {
  if (!gameName) return null;
  
  // Normalize the game name for lookup (lowercase, handle variations)
  const normalizedName = gameName.toLowerCase().trim();
  
  // Direct match
  if (gameIconMap[normalizedName]) {
    return gameIconMap[normalizedName];
  }
  
  // Check variations (remove common suffixes/prefixes)
  const variations = [
    normalizedName.replace(' nerdle', ''),
    normalizedName.replace('nerdle ', ''),
    normalizedName.replace(' nerdlegame', ''),
    normalizedName.replace('nerdlegame ', ''),
    normalizedName.replace(/\s+/g, ''), // Remove all spaces
  ];
  
  for (const variation of variations) {
    if (gameIconMap[variation]) {
      return gameIconMap[variation];
    }
  }
  
  return null;
};

// Get the first letter of a game name for fallback icons
export const getGameInitial = (gameName) => {
  if (!gameName) return '?';
  return gameName.charAt(0).toUpperCase();
};

// Determine if we should use green or black background for fallback icon
export const getFallbackIconColor = (gameData) => {
  return isNerdleGame(gameData) ? 'bg-green-500' : 'bg-black';
};

// React component for game icon
export const GameIcon = ({ gameName, gameData, className = "w-4 h-4" }) => {
  const iconUrl = getGameIcon(gameName, gameData);
  const initial = getGameInitial(gameName);
  const bgColor = getFallbackIconColor(gameData);
  
  if (iconUrl) {
    return (
      <div className="relative">
        <img 
          src={iconUrl} 
          alt={`${gameName} icon`}
          className={`${className} object-contain`}
          onError={(e) => {
            // If image fails to load, hide it and show fallback
            e.target.style.display = 'none';
            const fallback = e.target.nextElementSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div 
          className={`${className} ${bgColor} text-white text-xs font-bold rounded items-center justify-center hidden`}
          title={gameName}
          style={{ display: 'none' }}
        >
          {initial}
        </div>
      </div>
    );
  }
  
  // Fallback: colored square with first letter
  return (
    <div 
      className={`${className} ${bgColor} text-white text-xs font-bold rounded flex items-center justify-center`}
      title={gameName}
    >
      {initial}
    </div>
  );
};