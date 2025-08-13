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

// Game data from nerdle/src/lib/gameList.ts - contains both icons and descriptions
const gameListData = [
  {
    gameMode: '',
    name: 'classic',
    url: 'https://nerdlegame.com',
    img: '/newicons/classic.png',
    description: "The original - 8 digits, 6 guesses"
  },
  {
    gameMode: 'micro',
    name: 'micro',
    url: 'https://micro.nerdlegame.com',
    img: '/newicons/micro.png',
    description: "Micro nerdle - 5 digit nerdle"
  },
  {
    gameMode: 'mini',
    name: 'mini',
    url: 'https://mini.nerdlegame.com',
    img: '/newicons/mini.png',
    description: "Mini nerdle - 6 digit nerdle"
  },
  {
    gameMode: 'midi',
    name: 'midi',
    url: 'https://midi.nerdlegame.com',
    img: '/newicons/midi.png',
    description: "Midi nerdle - 7 digit nerdle"
  },
  {
    gameMode: 'maxi',
    name: 'maxi',
    url: 'https://maxi.nerdlegame.com',
    img: '/newicons/maxi.png',
    description: "Maxi nerdle - 10 digits, more operators"
  },
  {
    gameMode: 'mini-bi',
    name: 'mini-bi',
    url: 'https://mini.bi.nerdlegame.com',
    img: '/newicons/mini-bi.png',
    description: "Mini bi nerdle - 2 mini nerdles at once"
  },
  {
    gameMode: 'bi',
    name: 'bi',
    url: 'https://bi.nerdlegame.com',
    img: '/newicons/bi.png',
    description: "Bi nerdle - 2 classic nerdles at once"
  },
  {
    gameMode: 'quad',
    name: 'quad',
    url: 'https://quad.nerdlegame.com/',
    img: '/newicons/quad.png',
    description: "Quad nerdle - 4 classic nerdles at once"
  },
  {
    gameMode: 'decoy',
    name: 'decoy',
    url: 'https://nerdlegame.com/decoy',
    img: '/newicons/decoy-logo.png',
    description: "Find the calculation or word, one character is a decoy"
  },
  {
    gameMode: 'speed',
    name: 'speed',
    url: 'https://speed.nerdlegame.com',
    img: '/newicons/speed.png',
    description: "Nerdle against the clock"
  },
  {
    gameMode: 'instant',
    name: 'instant',
    url: 'https://instant.nerdlegame.com',
    img: '/newicons/instant.png',
    description: "Instant nerdle - only one guess!"
  },
  {
    gameMode: 'twords',
    name: 'twords',
    url: 'https://nerdlegame.com/twords',
    img: '/newicons/twords-logo.png',
    description: "Word puzzles with a nerdle twist"
  },
  {
    gameMode: 'crossnerdle',
    name: 'crossnerdle',
    url: 'https://nerdlegame.com/crossnerdle',
    img: '/crossnerdle/crossnerdle_icon.png',
    description: "Cross nerdle - like a crossword but with nerdles"
  },
  {
    gameMode: 'nanagrams',
    name: 'nanagrams',
    url: 'https://nerdlegame.com/nanagrams',
    img: '/nanagram/favicon.png',
    description: "Nanagrams - find all the calculations using the numbers given"
  },
  {
    gameMode: 'shuffle',
    name: 'shuffle',
    url: 'https://nerdlegame.com/s/shuffle//1234/',
    img: 'https://nerdlegame.com/s/shuffleSm.png',
    description: "Shuffle nerdle - rearrange the equation"
  },
  {
    gameMode: 'swapnumbers',
    name: '2d nerdle',
    url: 'https://nerdlegame.com/s/2d',
    img: 'https://nerdlegame.com/s/nerdle2dSm.png',
    description: "2d nerdle - swap digits to make a magic square"
  },
  {
    gameMode: 'targets',
    name: 'targets',
    url: 'https://nerdlegame.com/s/targets',
    img: 'https://nerdlegame.com/s/targetsSm.png',
    description: "Targets - hit the target number"
  },
  {
    gameMode: 'maffdoku',
    name: 'maffdoku',
    url: 'https://nerdlegame.com/maffdoku',
    img: 'https://nerdlegame.com/maffdoku/maffdokuSm.png',
    description: "Maffdoku - sudoku meets nerdle"
  },
  {
    gameMode: 'connect',
    name: 'connect',
    url: 'https://www.nerdlegame.com/connect',
    img: 'https://www.nerdlegame.com/assets/images/connectSm.png',
    description: "Connect - link the numbers"
  }
];

// Get game details (icon + description) using gameList data
export const getGameDetails = (gameName, allGames = null) => {
  if (!gameName) {
    return { iconUrl: null, description: null };
  }
  
  // Normalize the game name for lookup (lowercase, handle variations)
  const normalizedName = gameName.toLowerCase().trim();
  
  // Helper function to find game in gameListData by various keys
  const findGameByKey = (lookupKey) => {
    return gameListData.find(g => 
      g?.gameMode?.toLowerCase() === lookupKey ||
      g?.name?.toLowerCase() === lookupKey ||
      `${g?.name?.toLowerCase()} nerdle` === lookupKey ||
      `${g?.name?.toLowerCase()} nerdlegame` === lookupKey
    );
  };
  
  let gameDetail = null;
  
  // Try direct match first
  gameDetail = findGameByKey(normalizedName);
  
  // If not found, try variations (same logic as icon lookup)
  if (!gameDetail) {
    const variations = [
      normalizedName.replace(' nerdle', ''),
      normalizedName.replace('nerdle ', ''),  
      normalizedName.replace(' nerdlegame', ''),
      normalizedName.replace('nerdlegame ', ''),
      normalizedName.replace(/\s+/g, ''), // Remove all spaces
    ];
    
    for (const variation of variations) {
      gameDetail = findGameByKey(variation);
      if (gameDetail) break;
    }
  }
  
  // Special case for nerdlegame -> classic
  if (!gameDetail && (normalizedName === 'nerdlegame' || normalizedName === 'nerdle')) {
    gameDetail = gameListData.find(g => g.name === 'classic');
  }
  
  // Get icon using existing logic (prepend https://nerdlegame.com for relative paths)
  let iconUrl = null;
  if (gameDetail?.img) {
    iconUrl = gameDetail.img.startsWith('http') ? gameDetail.img : `https://nerdlegame.com${gameDetail.img}`;
  } else {
    iconUrl = getGameIcon(gameName);
  }
  
  return {
    iconUrl,
    description: gameDetail?.description || null,
    gameDetail
  };
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