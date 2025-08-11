// Game icon mapping based on nerdle/src/lib/gameList.ts
const gameIconMap = {
  // Nerdle games (from nerdle gameList.ts)
  'nerdlegame': '/newicons/classic.png',
  'classic': '/newicons/classic.png',
  'micro nerdlegame': '/newicons/micro.png',
  'micro': '/newicons/micro.png',
  'mini nerdlegame': '/newicons/mini.png',
  'mini': '/newicons/mini.png',
  'midi nerdlegame': '/newicons/midi.png',
  'midi': '/newicons/midi.png',
  'maxi nerdlegame': '/newicons/maxi.png',
  'maxi': '/newicons/maxi.png',
  'mini-bi nerdlegame': '/newicons/mini-bi.png',
  'mini-bi': '/newicons/mini-bi.png',
  'bi nerdlegame': '/newicons/bi.png',
  'bi': '/newicons/bi.png',
  'quad nerdlegame': '/newicons/quad.png',
  'quad': '/newicons/quad.png',
  'decoy nerdlegame': '/newicons/decoy-logo.png',
  'decoy': '/newicons/decoy-logo.png',
  'speed nerdlegame': '/newicons/speed.png',
  'speed': '/newicons/speed.png',
  'instant nerdlegame': '/newicons/instant.png',
  'instant': '/newicons/instant.png',
  'shuffle': 'https://nerdlegame.com/s/shuffleSm.png',
  'crossnerdle': 'https://nerdlegame.com/crossnerdle/crossnerdle_icon.png',
  'nanagrams': 'https://nerdlegame.com/nanagram/favicon.png',
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
  
  if (iconUrl) {
    return (
      <img 
        src={iconUrl} 
        alt={`${gameName} icon`}
        className={`${className} object-contain`}
        onError={(e) => {
          // If image fails to load, hide it and show fallback
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }
  
  // Fallback: colored square with first letter
  const initial = getGameInitial(gameName);
  const bgColor = getFallbackIconColor(gameData);
  
  return (
    <div 
      className={`${className} ${bgColor} text-white text-xs font-bold rounded flex items-center justify-center`}
      title={gameName}
    >
      {initial}
    </div>
  );
};