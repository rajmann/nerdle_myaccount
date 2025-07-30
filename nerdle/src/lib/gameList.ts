export const games = [
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
      gameMode: 'shuffle',
      name: 'shuffle',
      url: 'https://nerdlegame.com/s/shuffle//1234/',
      img: 'https://nerdlegame.com/s/shuffleSm.png',
      lastPlayedStartsWith: true,
      excludeFromWinModal: true,
      description: "Shuffle the tiles to solve the square"
    },

    // {
    //   gameMode: 'shufflenumbers',
    //   name: 'shuffle123',
    //   url: 'https://nerdlegame.com/s/shuffle/1234/',
    //   img: 'https://nerdlegame.com/crossnerdle/shuffle_123_170x100.png',
    //   excludeFromWinModal: true
    // },
    // {
    //   gameMode: 'shufflewords',
    //   name: 'shuffleABC',
    //   url: 'https://nerdlegame.com/s/shuffle/abcd/',
    //   img: 'https://nerdlegame.com/crossnerdle/shuffle_abc_170x100.png',
    //   excludeFromWinModal: true
    // },
    {
      gameMode: 'crossnerdle',
      name: 'crossnerdle',
      url: 'https://nerdlegame.com/crossnerdle',
      img: 'https://nerdlegame.com/crossnerdle/crossnerdle_icon.png',
      startDate: '2023-05-29',
      description: "Crossnerdle - a crossword but with numbers"
    },
    {
      gameMode: 'nanagrams',
      name: 'nanagrams',
      url: 'https://nerdlegame.com/nanagrams',
      img: 'https://nerdlegame.com/nanagram/favicon.png',
      lastPlayedStartsWith: true,
      description: "Nanagrams - find all the calculations using the numbers given"
    },
    {
      gameMode: 'swapnumbers',
      name: '2d nerdle',
      url: 'https://nerdlegame.com/s/2d',
      img: 'https://nerdlegame.com/s/nerdle2dSm.png',
      lastPlayedStartsWith: true,
      description: "2d nerdle - swap digits to make a magic square"
    },
    {
      gameMode: 'targetsnumbers',
      name: 'targets',
      url: 'https://nerdlegame.com/s/targets',
      img: 'https://nerdlegame.com/s/targetsSm.png',
      lastPlayedStartsWith: true,
      description: "Targets - create calculations to match the targets"
    },
    {
      gameMode: 'maffdoku',
      name: 'maffdoku',
      url: 'https://nerdlegame.com/maffdoku/',
      img: 'https://nerdlegame.com/maffdoku/maffdokuSm.png',
      lastPlayedStartsWith: true,
      description: "Maffdoku - like sodoku but with maths"
    },
    {
      gameMode: 'twords',
      name: 'twords',
      url: 'https://nerdlegame.com/twords',
      img: '/newicons/twords-logo.png',
      description: "guess the 'tword' made from two merged words"
    }
    
  ]