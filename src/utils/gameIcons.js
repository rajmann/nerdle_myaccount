// Game icon mapping based on nerdle/src/lib/gameList.ts
const gameIconMap = {
  // Nerdle games (from nerdle gameList.ts) - prepend https://nerdlegame.com for relative paths
  'nerdlegame': 'https://nerdlegame.com/newicons/classic.png',
  'classic': 'https://nerdlegame.com/newicons/classic.png',
  'nerdle': 'https://nerdlegame.com/newicons/classic.png',
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
  'minibinerdle': 'https://nerdlegame.com/newicons/mini-bi.png',
  'bi nerdlegame': 'https://nerdlegame.com/newicons/bi.png',
  'bi': 'https://nerdlegame.com/newicons/bi.png',
  'binerdle': 'https://nerdlegame.com/newicons/bi.png',
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
  'nanagram': 'https://nerdlegame.com/nanagram/favicon.png',
  'mini nanagrams': 'https://nerdlegame.com/nanagram/favicon.png',
  'micro nanagrams': 'https://nerdlegame.com/nanagram/favicon.png',
  'maxi nanagrams': 'https://nerdlegame.com/nanagram/favicon.png',
  '2d nerdle': 'https://nerdlegame.com/s/nerdle2dSm.png',
  'targets': 'https://nerdlegame.com/s/targetsSm.png',
  'maffdoku': 'https://nerdlegame.com/maffdoku/maffdokuSm.png',
  'mini maffdoku': 'https://nerdlegame.com/maffdoku/maffdokuSm.png',
  'micro maffdoku': 'https://nerdlegame.com/maffdoku/maffdokuSm.png',
  'maxi maffdoku': 'https://nerdlegame.com/maffdoku/maffdokuSm.png',
  'connect': 'https://www.nerdlegame.com/assets/images/connectSm.png',
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
  
  // Check for special keywords and map to appropriate icons
  if (normalizedName.includes('decoy')) {
    return gameIconMap['decoy'];
  }
  if (normalizedName.includes('shuffle')) {
    return gameIconMap['shuffle'];
  }
  if (normalizedName.includes('2d')) {
    return gameIconMap['2d nerdle'];
  }
  if (normalizedName.includes('maffdoku')) {
    return gameIconMap['maffdoku'];
  }
  if (normalizedName.includes('nanagrams') || normalizedName.includes('nanagram')) {
    return gameIconMap['nanagrams'];
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

// Determine border color for fallback icon based on game type
export const getFallbackIconBorderColor = (gameData) => {
  return isNerdleGame(gameData) ? '#398874' : '#000000';
};

// React component for game icon - forces consistent 32x32px size
export const GameIcon = ({ gameName, gameData, className = "w-8 h-8" }) => {
  const iconUrl = getGameIcon(gameName, gameData);
  const initial = getGameInitial(gameName);
  const isNerdle = isNerdleGame(gameData);
  const borderColor = isNerdle ? '#398874' : '#000000'; // Teal border for Nerdle games, black for others
  
  // Force consistent size - always use w-8 h-8 (32x32px)
  const forcedSize = "w-8 h-8";
  
  if (iconUrl) {
    return (
      <div className="relative">
        <div className={`${forcedSize} bg-white rounded flex items-center justify-center`}>
          <img 
            src={iconUrl} 
            alt={`${gameName} icon`}
            className={`${forcedSize} object-contain rounded`}
            onError={(e) => {
              // If image fails to load, hide it and show fallback
              e.target.style.display = 'none';
              const fallback = e.target.parentElement.nextElementSibling;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        </div>
        <div 
          className={`${forcedSize} bg-white text-black text-lg font-bold rounded border flex items-center justify-center hidden p-0`}
          style={{ display: 'none', borderColor: borderColor }}
          title={gameName}
        >
          {initial}
        </div>
      </div>
    );
  }
  
  // Fallback: white background with black text and colored border
  return (
    <div 
      className={`${forcedSize} bg-white text-black text-lg font-bold rounded border flex items-center justify-center p-0`}
      style={{ borderColor: borderColor }}
      title={gameName}
    >
      {initial}
    </div>
  );
};