import {
  MenuIcon,
  XCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/outline'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { Calculator } from './components/modals/Calculator'
import { PreviousGamesModal } from './components/modals/PreviousGamesModal'
import { StatsModal } from './components/modals/StatsModal'
import { InfoModal } from './components/modals/InfoModal'
// import { WinModal } from './components/modals/WinModal'
import { WinModalNew } from './components/modals/WinModalNew'
import { LoseModal } from './components/modals/LoseModal'
import { ShareModal } from './components/modals/ShareModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { PositiveNumbersModal } from './components/modals/PositiveNumbersModal'
import { LBLLoginModal } from './components/modals/LBLLoginModal'
// import { NoDataModal } from './components/modals/NoDataModal'
import {
  getDayIndex,
  //getMicroDayIndex,
  isWinningWord,
  getIndexFromDate,
  getInstantFile,
  getInstantFileFromDate,
  instantToSolution,
} from './lib/words'
import { deObf } from './lib/deObf'
import { evaluate, doesCommute, isBODMASWrong } from './lib/evaluate'
import { isRunningInPWA, isNewMobileApp } from './lib/isPWA'
import {
  loadGameState,
  saveGameState,
  loadStatsState,
  loadDeviceStatsState,
  saveGameStats,
  saveDeviceGameStats,
  StoredStatsState
} from './lib/storage'
import { HintContainer } from './components/hints/HintContainer'
import { doGoogleLogin } from './lib/doLogin'

// Import the functions you need from the SDKs you need

//import { Adsense } from '@ctrl/react-adsense'
import { secondsToHms } from './lib/timer'
import { Menu } from './components/menu'
import { lblCallback, doLblOauth, postLBlToken } from './lib/lblcallback'
import { lwaCallback, } from './lib/lwacallback'
import { getGamesPlayedToday, setGamesPlayedToday } from './lib/gameTracker'
import { analytics } from './index'
import { logEvent } from 'firebase/analytics'
// import TikTokPixel from 'tiktok-pixel'
import { isAndroid } from 'react-device-detect'
import ReactPixel from 'react-facebook-pixel';
import { isMobile } from 'react-device-detect';
import { mpInitIfEnabled, mpTrackIfEnabled } from './lib/mixpanel'
import { GoogleLogin } from '@react-oauth/google';
import { Banner } from './components/banners/banner'
import { MiniBadges } from './components/badges/MiniBadges'
import { getCupNotificationDotColor } from './components/badges/MiniBadges'

import { Md5 } from 'ts-md5' //NERDLE CUP
import { enabledGameModes as badgeEnabledGameModes } from './components/badges/EnabledGames'

ReactPixel.init('288722760707253')
ReactPixel.pageView()

declare var window: any
declare var _conv_q: any

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// if (window.location.hostname === 'mini.nerdlegame.com') {
//   window.location.href = 'https://nerdlegame.com/mini' + (window.location.pathname!==""?window.location.pathname:"")
// }

// TikTokPixel.init('CH19DCJC77UBPL7PJUQG')

lblCallback()
lwaCallback()

// if pathname contains 'mplog' set a localstorage variable called 'mplog' to current time
if (window.location.pathname.includes('mplog')) {
  localStorage.setItem('mplog', new Date().toISOString())
}

// do we have mplog in localstorage and is current time less than 24 hours from it?
mpInitIfEnabled()

if (window.location.pathname === '/reset999') {
  localStorage.clear()
  window.location.href = '/'
}

//NERDLE CUP
if (true) {
  //decode params and store locally
  //eg crossnerdle/20240102?cup=788639&nam=R1&gmr=3&hsh=adf46415bb0a515796144afc2fc2f51a
  var cupUrlParams = {}
  const pathName = window.location.pathname;
  console.log("pathName", pathName)
  const queryString = window.location.search;
  console.log("queryString", queryString)
  const urlParams = new URLSearchParams(queryString);
  var cupCode = urlParams.get("cup")
  var cupGameName = urlParams.get("gmn")
  var da = queryString.includes("&da")
  if (da) {
    //disable ads for 3 days in teacher mode
    localStorage.setItem(
      'disableAdsTimestamp',
      Date.now().toString()
    )
  }
  console.log("cupCode", cupCode)
  if (cupCode) {
    console.log("cup game true", cupCode)

    let querySringHashable = "imogen" + pathName + queryString.slice(0, queryString.indexOf('&hsh'))

    // decode queryStringHashable
    querySringHashable = decodeURIComponent(querySringHashable)

    // url decode queryStringHashable
    var checkHash = Md5.hashStr(querySringHashable)
    var hash = urlParams.get("hsh")
    var gmr = urlParams.get("gmr")
    var gmt = urlParams.get("gmt")
    var nam = urlParams.get('nam')

    console.log("secret queryStringHashable", querySringHashable.replace("imogen", "i*****"), checkHash, hash)
    if (checkHash == hash) {
      console.log("pass cup game hash check")
      var isCupGame = true
      cupUrlParams = { 'code': cupCode, 'nam': urlParams.get("nam"), 'gmr': urlParams.get('gmr'), 'gmt': urlParams.get('gmt') }
    } else {
      console.log("fail cup game hash check")
      alert("invalid nerdle cup details - please return to cup.nerdlegame.com and try again")
      cupUrlParams = {}
    }
  } else {
    console.log("cup game false")
    cupUrlParams = {}
  }
}


function setGameModeFromPath() {
  if (window.location.hostname.includes('mini')) {
    localStorage.setItem('gameMode', 'mini')
    return 'mini'
  } else {
    //localStorage.setItem('gameMode', '')
    if (window.location.hostname.includes('micro')) {
      console.log('micro...')
      localStorage.setItem('gameMode', 'micro')
      return 'micro'
    } else {
      if (window.location.hostname.includes('maxi')) {
        console.log('maxi...')
        localStorage.setItem('gameMode', 'maxi')
        return 'maxi'
      } else {
        if (window.location.hostname.includes('midi')) {
          console.log('midi...')
          localStorage.setItem('gameMode', 'midi')
          return 'midi'
        } else {
          if (window.location.hostname.includes('pro')) {
            console.log('pro...')
            localStorage.setItem('gameMode', 'pro')
            return 'pro'
          } else {
            if (window.location.hostname.includes('speed')) {
              localStorage.setItem('gameMode', 'speed')
              return 'speed'
            } else {
                if (window.location.hostname.includes('instant')) {
                    localStorage.setItem('gameMode', 'instant')
                  return 'instant'
                } else {
                  localStorage.setItem('gameMode', '')
                  console.log('regular game mode...')
                  return ''
                }
            }
          }
        }
      }
    }
  }

  return '' // default to regular game mode
}

// setGameModeFromPath() -- do this in main useEffect ... 

if (window.location.hostname === 'classic.nerdlegame.com') {
  window.location.href =
    'https://nerdlegame.com/classic' +
    (window.location.pathname !== '' ? window.location.pathname : '')
}

if (window.location.pathname.includes('/mini')) {
  // localStorage.setItem('gameMode', 'mini')
  const mainHost = window.location.hostname.includes('localhost')
    ? 'localhost:3000'
    : 'nerdlegame.com'
  window.location.href = window.location.protocol + '//mini.' + mainHost
}

if (window.location.pathname.includes('/micro')) {
  // localStorage.setItem('gameMode', 'mini')
  const mainHost = window.location.hostname.includes('localhost')
    ? 'localhost:3000'
    : 'nerdlegame.com'
  window.location.href = window.location.protocol + '//micro.' + mainHost
}

if (window.location.pathname.includes('/classic')) {
  localStorage.setItem('gameMode', '')
}

if (
  window.location.hostname === 'pro.nerdlegame.com' &&
  (window.location.pathname === '/' || window.location.pathname === '')
) {
  window.location.href = 'https://create.nerdlegame.com/play.html'
}


// hack to handle mini and micro on netlify domain ... 
if (window.location.hostname === 'nerdlegame.netlify.app') {
  // if querystring = '?mini' then set gameMode to mini
  if (window.location.search.includes('?mini')) {
    localStorage.setItem('gameMode', 'mini')
  }
  // if querystring = '?micro' then set gameMode to micro
  if (window.location.search.includes('?micro')) {
    localStorage.setItem('gameMode', 'micro')
  }
}

//if query string contains '?pwa' then store it in localStorage
if (window.location.search.includes('?pwa')) {
  localStorage.setItem('pwa', 'true')
}

//temp QE 2
//localStorage.setItem('darkMode','true');
//localStorage.removeItem('darkMode')
if (localStorage.getItem('darkModeNew') === 'true') {
  var element = document.getElementById('html')
  element?.classList.toggle('dark')
}

// reset game mode to regular if we WERE on pro and NOT at a custom URL
if (
  localStorage.getItem('gameMode') === 'pro' &&
  !window.location.hostname.startsWith('pro.')
) {
  //localStorage.setItem('gameMode', '')
  window.location.href = 'https://nerdlegame.com/'
}

// if (localStorage.getItem('gameMode') === 'mini' && window.location.pathname.includes('/pwr')) {
//   window.location.href = window.location.protocol + '//' + window.location.hostname +  (window.location.port!==''? ':' + window.location.port : '')  + '/mini'
// }

// Initialize Firebase


function MainApp() {
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isWinModalOpen, setIsWinModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const [isNoDataModalOpen, setIsNoDataModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(
    () => {

      return false

      // const statsFromStorage = localStorage.getItem('statsState')

      // console.log('statsFromStorage', statsFromStorage)
      // console.log('window.newUser', window.newUser)

      // console.log(window.newUser && (statsFromStorage === null || statsFromStorage === undefined))

      // return window.newUser && (statsFromStorage === null || statsFromStorage === undefined)

    }
  )
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [initialStatsTab, setInitialStatsTab] = useState('stats')
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isLoginExpired, setLoginExpired] = useState(false)

  // *** ACHIEVEMENTS *** 
  const [currentAwardImage, setCurrentAwardImage] = useState('')
  const [cupDotColor, setCupDotColor] = useState<string | null>(null)


  const [updateBadges, setUpdateBadges] = useState(false)
  const [isPositiveModalOpen, setIsPositiveModalOpen] = useState(false)
  const [doesWordCompute, setWordNotCompute] = useState(false)
  const [notOneEquals, setNotOneEquals] = useState(false)
  const [symbolsWrongSide, setSymbolsWrongSide] = useState(false)
  const [startsWithSymbol, setStartsWithSymbol] = useState(false)
  const [startsWithZero, setStartsWithZero] = useState(false)
  const [zeroBeforeEquals, setZeroBeforeEquals] = useState(false)
  const [BODMASissue, setBODMASIssue] = useState({
    result: false,
    lhs: '',
    realAnswer: '',
  })
  const [isWordComplete, setWordNotComplete] = useState(false)
  const [isWordCommutative, setWordCommutative] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [instantLost, setInstantLost] = useState(false)
  const [instantQuit, setInstantQuit] = useState(false)
  const [shareComplete, setShareComplete] = useState(false)
  const [updateGameMode, setUpdateGameMode] = useState(false)
  const [colorBlindMode, setColorBlindMode] = useState(false)
  const [solution, setSolution] = useState('')
  const [gameLoaded, setGameLoaded] = useState(false)
  const [solutionIndex, setSolutionIndex] = useState(0)
  const [isPreviousGame, setIsPreviousGame] = useState(false)
  const [additionalKeys, setAdditionalKeys] = useState([] as string[])
  const [ommittedKeys, setOmmittedKeys] = useState([] as string[])
  const [showBanner, setShowBanner] = useState(false)
  const [showGraphicBanner, setShowGraphicBanner] = useState(false)
  const [gameMode, setGameMode] = useState(
    // localStorage.getItem('gameMode') || ''
    setGameModeFromPath() || ''
  )
  const [acceptCommut, setAcceptCommut] = useState(
    (localStorage.getItem('disallowCommut') || 'false') === 'false'
  )
  const [winAnimations, setWinAnimations] = useState(
    (localStorage.getItem('disableWinAnimations') || 'false') === 'false'
  )
  const [doBounce, setDoBounce] = useState(false)
  const [isUK, setIsUK] = useState(false)
  const [showPlanInternational, setShowPlanInternational] = useState(false)
  const [showNumberChampions, setShowNumberChampions] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [doTimer, setDoTimer] = useState(false)
  const [timer, setTimer] = useState(0)
  const [addedPenalty, setAddedPenalty] = useState(false)

  const [numColumns, setNumColumns] = useState(8)
  const [numRows, setNumRows] = useState(6)
  const [checkPenaltyTimer, setCheckPenaltyTimer] = useState(false)

  const [isFlexInput, setIsFlexInput] = useState(true)
  const [clueImage, setClueImage] = useState('')
  const [clueGameIndex, setClueGameIndex] = useState('')
  const [hasClueRow, setHasClueeRow] = useState(false)
  const [selCol, setSelCol] = useState(0)
  const selColRef = useRef(selCol)
  const timerRef = useRef(timer)

  const [openMenu, setOpenMenu] = useState(false)
  const [isPreviousGamesModalOpen, setIsPreviousGamesModalOpen] =
    useState(false)
  const [isLBLLoginOpen, setIsLBLLoginOpen] = useState(false)
  const [isScoreSharedToLBL, setIsScoreSharedToLBL] = useState(false)
  const [loggedInMessage, setIsLoggedInMessage] = useState('')
  const [scoreText, setScoreText] = useState('')
  //const [adRandomizer, setAdRandomizer] = useState(Math.floor(Math.random() * 20))
  const [theme, setTheme] = useState('')
  const [doneAdClasses, setDoneAdClasses] = useState(false)
  const [createdNewAccount, setCreatedNewAccount] = useState(false)
  const [rawReveal, setRawReveal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('lbl_token') !== null)
  const [updateHints, setUpdateHints] = useState(false)
  const [isHintsEnabled, setIsHintsEnabled] = useState((localStorage.getItem('hints') || 'true') === 'true')

  // const [variation, setVariation] = useState(() => {
  //   var variant = localStorage.getItem('Experiment1Variant')
  //   if (variant === null) {
  //      // get random number between 0 and 2
  //     variant = Math.floor(Math.random() * 3).toString()  
  //     localStorage.setItem('Experiment1Variant', variant)
  //     logEvent(analytics, 'exp1_start', { variant: variant })
  //     logEvent(analytics, 'exp1_set_var' + variant, { variant: variant })
  //   }
  //   return variant
  // })


  //disable ads if timestamp of setting less than 3 days ago
  const [disableAds, setDisableAds] = useState(() => {
    const disableAdsTimestamp = localStorage.getItem('disableAdsTimestamp')
    //get timestamp of 3 days ago
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const dA =
      disableAdsTimestamp &&
      parseInt(disableAdsTimestamp) > new Date(threeDaysAgo).getTime()
    if (!dA) {
      localStorage.removeItem('disableAdsTimestamp')
    }
    return dA
  })

  const setColNumber = useCallback((col: number) => {
    selColRef.current = col
    setSelCol(col)
  }, [])

  const [guesses, setGuesses] = useState<string[]>([])

  const [stats, setStats] = useState<StoredStatsState>(() => {
    // const loaded = loadStatsState(localStorage.getItem('gameMode') || '')
    // if (loaded) {
    //   return loaded
    // } else {
    return {
      lastUpdated: '',
      gamesPlayed: 0,
      gamesWon: 0,
      winRows: [0, 0, 0, 0, 0, 0],
      currentStreak: 0,
      maxStreak: 0,
      averageGuessTime: { gamesWon: 0, totalTime: 0 },
    }
    //}
  })

  const [deviceStats, setDeviceStats] = useState<StoredStatsState>(() => {
    return {
      lastUpdated: '',
      gamesPlayed: 0,
      gamesWon: 0,
      winRows: [0, 0, 0, 0, 0, 0],
      currentStreak: 0,
      maxStreak: 0,
      averageGuessTime: { gamesWon: 0, totalTime: 0 },
    }
  })

  const [statsLoaded, setStatsLoaded] = useState(false)

  useEffect(() => {
    if (statsLoaded == false) {
      setDeviceStats(loadDeviceStatsState())
      loadStatsState(localStorage.getItem('gameMode') || '').then((loaded) => {
        if (loaded && loaded.stats) {
          setStats(loaded.stats)
          setStatsLoaded(true)
          if (loaded.stats.gamesPlayed === 0) {
            //setIsInfoModalOpen(true)
          }
        }
        if (!loaded.authorized) {
          console.log('token expired/invalid')
          setLoginExpired(true)
        }
      });
    }
  }, [statsLoaded])

  // useEffect(() => {
  //   if (stats.gamesPlayed === 0) {
  //     setIsInfoModalOpen(true)
  //   }
  // }, [stats])

  // useEffect(() => {
  //   if (window.location.search.includes('?lgtd')) {
  //     setAdRandomizer(0)
  //   }
  //  },[] )



  const updateOmmittedKeys = (omitChars: string) => {
    //replace P with +, S with -, M with *, D with /, E with ^, O with ( and C with )

    var keys = omitChars
      .replace('%CF%80', 'π')
      .replace('%C2%B2', '²')
      .replace('%C2%B3', '³')
      .replace(/P/g, '+')
      .replace(/S/g, '-')
      .replace(/M/g, '*')
      .replace(/D/g, '/')
      .replace(/E/g, '^')
      .replace(/O/g, '(')
      .replace(/C/g, ')')
      .replace(/F/g, '!')
      .replace(/d/g, '.')
      .split('')

    setOmmittedKeys(keys)
  }

  const replaceSymbols = (puzzle: string): string => {
    return puzzle
      .replace(/P/g, '+')
      .replace(/S/g, '-')
      .replace(/M/g, '*')
      .replace(/D/g, '/')
      .replace(/E/g, '^')
      .replace(/O/g, '(')
      .replace(/C/g, ')')
      .replace(/F/g, '!')
      .replace(/d/g, '.')
      .replace(/e/g, '=')
  }

  useEffect(() => {

    //setGameModeFromPath();

    if (gameMode != (localStorage.getItem('gameMode') || '')) {
      setGameMode(localStorage.getItem('gameMode') || '')
    }

    setAcceptCommut(
      (localStorage.getItem('disallowCommut') || 'false') === 'false'
    )
    //setIsFlexInput(localStorage.getItem('flexInput') === 'true')

    const getWordOfDay = () => {
      const gameMode = localStorage.getItem('gameMode') || ''
      let nC = 8
      if (gameMode === 'mini') {
        nC = 6
      }
      if (gameMode === 'micro') {
        nC = 5
      }
      if (gameMode === 'maxi') {
        nC = 10
        setAdditionalKeys(['(', ')', '²', '³'])
      }
      if (gameMode === 'midi') {
        nC = 7
      }
      setNumColumns(nC)
      //setNumColumns(gameMode === 'mini' ? 6 : 8)

      //do we have custom soluion in url?
      if (window.location.hostname.startsWith('pro.')) {
        const parts = window.location.pathname.split('/')
        const encoded = parts[1]
        const numRows = parts[2]
        const omitChars = parts[3]
        const revealChars =
          parts.length > 4 && parts[4] !== ''
            ? decodeURIComponent(parts[4])
            : ''
        setHasClueeRow(revealChars !== '')
        const startTimer = parts[5] || '0'
        const theme = parts[6] || ''
        const isClue = parts[7] || ''
        const imgUrl = parts[8] || ''
        setClueImage(decodeURIComponent(imgUrl))
        const clueIndex = parts[9] || ''

        setTheme(theme)
        //if theme == 'xmas' add class 'stars' to body
        if (theme === 'xmas') {
          document.body.classList.add('stars')
        }

        setNumRows(isNaN(parseInt(numRows)) ? 6 : parseInt(numRows))
        updateOmmittedKeys(omitChars)

        console.log(`https://api.nerdlegame.com/decode/decryptSolution?encoded=${encoded}`)

        //const encoded = window.location.pathname.substring(solution)
        fetch(
          `https://api.nerdlegame.com/decode/decryptSolution?encoded=${encoded}`
        )
          .then((response) => response.text())
          .then((text) => {
            console.log(text)
            const proSolution = text.split('|')[0]
            const version = text.split('|')[1] || '1'

            localStorage.setItem('gameMode', 'pro')
            //updateAdditionalKeys(text)
            if (version === '1') {
              setAdditionalKeys(['^', '(', ')', '!', '.'])
            } else {
              //after version 1 we added ² and ³
              setAdditionalKeys(['^', '(', ')', '!', '.', '²', '³', 'π'])
            }

            if (isClue == '1') {
              setAdditionalKeys(['^', '(', ')', '!', '.', '²', '³', 'π'])
              setClueGameIndex(clueIndex)
            }

            setNumColumns(proSolution.length)
            setSolution(proSolution)
            setSolutionIndex(1)

            console.log(revealChars)

            // if revealChars not empty set first guess to it
            if (revealChars.length > 0) {

              // if first part of revealChars is 'B64' then get the rest and base64 decode it
              if (revealChars.substring(0, 3) === 'RAW') {
                const decoded = revealChars.substring(3)
                setRawReveal(true)
                console.log(decoded)
                setGuesses([decoded])
              } else {
                setGuesses([replaceSymbols(revealChars)])
              }
            }

            // if the solution is different to the one in storage and startTimer=1, reset timer
            if (startTimer === '1') {
              const loaded = loadGameState('pro')
              if (!loaded || (loaded && loaded.solution !== proSolution)) {
                setTimer(0)
                timerRef.current = 0
                localStorage.setItem('timer', '0')
              }
              // start timer
              setDoTimer(true)
            }

            setGameLoaded(true)

          })
      } else {

        logEvent(analytics, "date-check" + ((localStorage.getItem('useLocalTime') === 'true') ? "-local" : "-utc"))

        let dayInfo = getDayIndex(gameMode, localStorage.getItem('useLocalTime') === 'true')
        if (
          window.location.pathname !== '' &&
          window.location.pathname !== '/' &&
          window.location.pathname !== '/classic' &&
          window.location.pathname !== '/mini' &&
          window.location.pathname !== '/classic/' &&
          window.location.pathname !== '/mini/' &&
          window.location.pathname !== '/micro/' &&
          window.location.pathname !== '/micro' &&
          window.location.pathname !== '/game' &&
          window.location.pathname !== '/game/' &&
          window.location.pathname !== '/index.html'
        ) {
          dayInfo = getIndexFromDate(
            window.location.pathname.substring(
              window.location.pathname.lastIndexOf('/') + 1
            ),
            gameMode
          )
          setIsPreviousGame(true)
        }
        setSolutionIndex(dayInfo.externalIndex)
        //const stub = window.location.href.includes('localhost') ? '' : ''
        fetch(`/${gameMode}words/${dayInfo.filename}`)
          .then((response) => response.text())
          .then((text) => {
            setSolution(deObf(text, 13));
            // console.log('solution: ', deObf(text, 13))
          })
      }
    }

    const getInstantWordOfDay = () => {
      setNumRows(2)

      const decodeChallenge = (text: string) => {
        const instantInfo = instantToSolution(text)
        const loaded = loadGameState('instant')
        setSolution(instantInfo.solution)
        setGuesses([instantInfo.guess])
        setGameMode('instant')
        //if the solution is different to the one in storage reset timer
        if (loaded?.solution != instantInfo.solution) {
          localStorage.setItem('timer', '0')
          setDoTimer(true)
        }
        setGameLoaded(true)
      }

      var challengeFromURL = window.location.pathname.split('/')[1]
      // remove any query string from challengeFromURL
      if (challengeFromURL.includes('?')) {
        challengeFromURL = challengeFromURL.split('?')[0]
      }
      if (
        window.location.pathname !== '/' &&
        window.location.pathname !== '/index.html' &&
        window.location.pathname != '/game' &&
        challengeFromURL.length !== 10 &&
        !challengeFromURL.match(/^[0-9]+$/)
      ) {
        fetch(
          `https://api.nerdlegame.com/decode/decryptSolution?encoded=${challengeFromURL}`
        )
          .then((response) => response.text())
          .then((text) => {
            decodeChallenge(text)
          })
      } else {
        let dayInfo
        // if we have date in YYYYMMDD in challengeFromURL, use that
        if (
          window.location.pathname !== '/' &&
          window.location.pathname !== '/index.html' &&
          window.location.pathname !== '/game' &&
          !isNaN(parseInt(challengeFromURL))
        ) {
          dayInfo = getInstantFileFromDate(challengeFromURL)
          setIsPreviousGame(true)
        } else {
          dayInfo = getInstantFile(localStorage.getItem('useLocalTime') === 'true')
        }
        setSolutionIndex(dayInfo.solutionIndex)
        fetch(`/${gameMode}words/${dayInfo.filename}`)
          .then((response) => response.text())
          .then((text) => {
            decodeChallenge(text)
          })
      }
    }

    if (!window.location.hostname.startsWith('instant.')) {
      getWordOfDay()
    } else {
      getInstantWordOfDay()
    }

    // is user in UK?
    const now = new Date().getTime()
    if (now > 1715817600000 && now < 1715990400000 && !isMobile) {
      fetch('https://d23dqm4hd61bdo.cloudfront.net/test.html').then(
        (response) => {
          console.log(response)
          if (response.status === 200) {
            setIsUK(true)
            console.log('we are in the uk')
            setShowNumberChampions(true)
          }
        }
      )
    }

    //display geo targeted ad ..
    // fetch('https://d23dqm4hd61bdo.cloudfront.net/test.html')
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log('in uk')
    //       setIsUK(true)
    //     } else {
    //       console.log('not in uk')
    //       setIsUK(false)
    //     }
    //     setShowAd(true)
    //   })
    //   .catch((error) => {
    //     console.log('error - say not in uk')
    //     setIsUK(false)
    //     setShowAd(true)
    //   })

    // log events to show which ad is being shown - this should only happen once
    //if (adRandomizer === 0) { logEvent(analytics, 'merch_ad_served') }
    // if (adRandomizer < 19) {
    //   //logEvent(analytics, 'stc_ad_served')
    //   logEvent(analytics, 'longitude_ad_served')
    // }
    // if (adRandomizer > 18) {
    //   logEvent(analytics, 'adsense_ad_served')
    // }
    // eslint-disable-next-line

    // make sure all dependencis are included in the array
    getCupNotificationDotColor(gameMode).then(setCupDotColor)


  }, [gameMode])

  useEffect(() => {
    if (isWinModalOpen && showAd) {
      setShowAd(false)
    }
  }, [isWinModalOpen, showAd])

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setWordCommutative(false)
        setBODMASIssue({ result: false, lhs: '', realAnswer: '' })
        setNotOneEquals(false)
        setSymbolsWrongSide(false)
      }
      if (event.key === 'ArrowLeft' && isFlexInput && selColRef.current > 0) {
        setColNumber(selColRef.current - 1)
      }
      if (
        event.key === 'ArrowRight' &&
        isFlexInput &&
        selColRef.current < numColumns - 1
      ) {
        setColNumber(selColRef.current + 1)
      }
    },
    [setColNumber, isFlexInput, numColumns]
  )

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [escFunction, setColNumber])

  useEffect(() => {

    //if path is '/stats' then open stats modal
    if (window.location.pathname.startsWith('/stats')) {
      console.log('stats')
      setIsAboutModalOpen(false)
      setInitialStatsTab('stats')
      setIsStatsModalOpen(true)
    }

    if (window.location.pathname === '/game/login') {
      setIsAboutModalOpen(false)
      setIsLBLLoginOpen(true)
    }

    const getSpeedReveal = () => {
      if (gameMode === 'speed') {
        let yesterdayInfo
        // if we have yyyymmdd date on the url, use that
        if (
          window.location.pathname !== '' &&
          window.location.pathname !== '/' &&
          window.location.pathname !== '/game'
        ) {
          const dt = window.location.pathname.substring(
            window.location.pathname.lastIndexOf('/') + 1
          )

          const date = new Date(
            Number(dt.substring(0, 4)),
            Number(dt.substring(4, 6)) - 1,
            Number(dt.substring(6, 8))
          )
          date.setDate(date.getDate() - 7) // now getting 7 days ago .. 
          date.setHours(0, 0, 0, 0)
          yesterdayInfo = getIndexFromDate(
            date.toISOString().substring(0, 10),
            gameMode
          )
        } else {

          // get yesterday's date in UTC timezone
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 7)  // now getting 7 days ago .. 
          yesterday.setUTCHours(0, 0, 0, 0)
          yesterdayInfo = getIndexFromDate(
            yesterday.toISOString().substring(0, 10),
            gameMode
          )
        }
        fetch(`/${gameMode}words/${yesterdayInfo.filename}`)
          .then((response) => response.text())
          .then((text) => {
            setGuesses([deObf(text, 13)])
            setTimer(0)
            timerRef.current = 0
            localStorage.setItem('timer', '0')
            setDoTimer(true)
          })
      }
    }

    if (solution === '') return // don't do anything on first render

    const gameMode = localStorage.getItem('gameMode') || ''
    const loaded = loadGameState(gameMode)
    setGameLoaded(true)

    if (loaded?.guesses.length === 0) {
      logEvent(analytics, 'new_game')
      mpTrackIfEnabled('new_game', {})
      ReactPixel.trackCustom('NewGame', { gameMode: gameMode })

      if (isNewMobileApp()) {
        logEvent(analytics, 'new_game_newmobileapp')
        mpTrackIfEnabled('new_game_newmobileapp', {})
      } else {
        if (isPWA) {
          logEvent(analytics, 'new_game_pwa')
          mpTrackIfEnabled('new_game_pwa', {})
        } else {
          logEvent(analytics, 'new_game_web')
          mpTrackIfEnabled('new_game_web', {})
        }
      }
      if (localStorage.getItem('lbl_token') !== null) {
        logEvent(analytics, 'new_game_loggedin')
        mpTrackIfEnabled('new_game_loggedin', {})
      }


      if (window.noSplash || window.location.pathname === '/game/login'
        || window.location.pathname === '/stats' || gameMode === 'pro'
        || window.location.href.includes('?nosplash')) {
        setIsAboutModalOpen(false)
      } else {
        setIsAboutModalOpen(true)
      }

      if (window.newUser) {
        logEvent(analytics, 'new_user_transient_convert_audience_added')
      }

    }

    if (window.noSplash || window.location.pathname === '/game/login'
      || window.location.pathname === '/stats' || gameMode === 'pro'
      || window.location.href.includes('?nosplash')) {
      setIsAboutModalOpen(false)
    } else {
      setIsAboutModalOpen(true)
    }

    // console.log('tiktokpixel pageview')
    // TikTokPixel.pageView();

    logEvent(analytics, 'game_started')
    mpTrackIfEnabled('game_started', {})
    if (loaded?.solution !== solution || loaded?.gameMode !== gameMode) {
      logEvent(analytics, 'new_game')
      mpTrackIfEnabled('new_game', {})
      ReactPixel.trackCustom('NewGame', { gameMode: gameMode })
      if (isNewMobileApp()) {
        logEvent(analytics, 'new_game_newmobileapp')
        mpTrackIfEnabled('new_game_newmobileapp', {})
      } else {
        if (isPWA) {
          logEvent(analytics, 'new_game_pwa')
          mpTrackIfEnabled('new_game_pwa', {})
        } else {
          logEvent(analytics, 'new_game_web')
          mpTrackIfEnabled('new_game_web', {})
        }
      }
      if (localStorage.getItem('lbl_token') !== null) {
        logEvent(analytics, 'new_game_loggedin')
        mpTrackIfEnabled('new_game_loggedin', {})
      }
      if (gameMode !== 'speed' && gameMode !== 'instant' && gameMode !== 'pro') {
        setGuesses([])
        if (window.noSplash || window.location.pathname === '/game/login'
          || window.location.pathname === '/stats' || gameMode === 'pro'
          || window.location.href.includes('?nosplash')) {
          setIsAboutModalOpen(false)
        } else {
          setIsAboutModalOpen(true)
        }
      } else {
        getSpeedReveal()
      }
      return
    }
    if (localStorage.getItem('pushEnabled') == 'true') {
      logEvent(analytics, 'game_started_push_enabled')
      mpTrackIfEnabled('game_started_push_enabled', {})
    }

    if (loaded.guesses.includes(solution)) {
      setIsGameWon(true)
    }

    //return loaded.guesses
    if (loaded?.guesses.length > 0) {
      setGuesses(loaded.guesses)
    }

    if (gameMode === 'speed' || gameMode === 'instant') {
      const strTimer = localStorage.getItem('timer') || '0'
      timerRef.current = parseInt(strTimer)
      setTimer(timerRef.current)
      setDoTimer(true)
    }

  }, [solution])

  useEffect(() => {
    if (updateGameMode) {
      const mainHost = window.location.hostname.includes('localhost')
        ? 'localhost:3000'
        : 'nerdlegame.com'

      if (localStorage.getItem('gameMode') === 'mini') {
        let pathname = window.location.pathname
        let isPWA = localStorage.getItem('pwa') === 'true'
        if (isPWA) {
          pathname = pathname + '?pwa'
        }
        window.location.href =
          window.location.protocol +
          '//mini.' +
          mainHost +
          (pathname !== '' ? pathname : '')
        return
      }

      if (localStorage.getItem('gameMode') !== 'mini') {
        window.location.href =
          window.location.protocol +
          '//' +
          mainHost +
          (window.location.pathname !== '' ? window.location.pathname : '')
        return
      }

      // if at a custom game, remove that ..
      if (window.location.hostname.startsWith('pro')) {
        window.location.href =
          window.location.protocol +
          '//' +
          window.location.hostname.replace('pro.', '') +
          (window.location.port !== '' ? ':' + window.location.port : '')
        return
      }

      if (
        window.location.pathname.includes('/classic') &&
        localStorage.getItem('gameMode') === 'mini'
      ) {
        window.location.href =
          window.location.protocol +
          '//' +
          window.location.hostname +
          (window.location.port !== '' ? ':' + window.location.port : '')
        return
      }

      if (
        window.location.pathname.includes('/mini') &&
        localStorage.getItem('gameMode') !== 'mini'
      ) {
        window.location.href =
          window.location.protocol +
          '//' +
          window.location.hostname +
          (window.location.port !== '' ? ':' + window.location.port : '')
      } else {
        window.location.reload()
      }
      setUpdateGameMode(false)
    }
  }, [updateGameMode])

  useEffect(() => {
    if (guesses.length > 0 && !isPreviousGame) {
      //console.log('saving game state', guesses, solution, gameMode)
      saveGameState(gameMode, { guesses, solution, gameMode })
    }
  }, [guesses, gameMode, solution, isPreviousGame])

  useEffect(() => {
    const shakeTiles = () => {
      const keyboardCells = document.getElementsByClassName('keyboard-cell')
      for (let i = 0; i < keyboardCells.length; i++) {
        if (i % 2 === 0) {
          keyboardCells[i].classList.add('shake2')
        } else {
          if (i % 3 === 0) {
            keyboardCells[i].classList.add('shake3')
          } else {
            keyboardCells[i].classList.add('shake1')
          }
        }
      }
    }

    const doWin = () => {

      if (!isPreviousGame && gameMode !== 'pro' && window.location.hostname !== 'nerdlegame.netlify.app') {

        // store date of win against gameMode in lastPlayed object in local storage
        const lastPlayed = JSON.parse(localStorage.getItem('lastPlayed') || '{}')
        console.log('lp stored locally ', lastPlayed)

        // do we have a lastPlayed for current gameMode
        if (lastPlayed[gameMode == '' ? 'classic' : gameMode] === undefined ||
          lastPlayed[gameMode == '' ? 'classic' : gameMode] != new Date().toISOString().substring(0, 10)) {

          // *** STRAIGHTS STORAGE 
          const lastPlayedDate = lastPlayed[gameMode == '' ? 'classic' : gameMode]
          const daysBetween = lastPlayedDate === undefined ? 1 : Math.floor((new Date().getTime() - new Date(lastPlayedDate).getTime()) / (1000 * 60 * 60 * 24))
          if (daysBetween == 1) {
            let currentStraight = parseInt(localStorage.getItem('currentStraight') || '0') + 1
            localStorage.setItem('currentStraight', currentStraight.toString())
          } else {
            localStorage.setItem('currentStraight', '1')
          }
          // *** END STRAIGHTS STORAGE

          lastPlayed[gameMode == '' ? 'classic' : gameMode] = new Date().toISOString().substring(0, 10)
          localStorage.setItem('lastPlayed', JSON.stringify(lastPlayed))

          console.log('new lp ', lastPlayed)

          // if gameMode is not '' then we need to redirect back to storeLbl.html to set the lastPlayed date
          if (gameMode !== '') {
            if (window.sessionTime) {
              localStorage.setItem('sessionTime', window.sessionTime.toString());
            }
            const data = {
              lastPlayed: lastPlayed,
              target: window.location.protocol + '//' + window.location.host,
            }
            // base 64 data
            const b64 = btoa(JSON.stringify(data))
            window.location.href = window.location.hostname.includes('localhost')
              ? 'http://localhost:3000/storeLbl.html?v=2&set=' + b64
              : (window.location.hostname.includes('dev.') ? 'https://dev.' : 'https://') + 'nerdlegame.com/storeLbl.html?set=' + b64
            return
          }
        }
      }

      if (winAnimations) {
        shakeTiles()
        setTimeout(() => {
          setIsWinModalOpen(true)
        }, 2500)
      } else {
        setTimeout(() => {
          setIsWinModalOpen(true)
        }, 500)
      }
    }

    if (isGameWon) {
      setDoTimer(false)
      if (doBounce) {
        setTimeout(() => {
          //setIsWinModalOpen(true)
          doWin()
        }, 1000)
      } else {
        doWin()
      }
      // stop the timer
      localStorage.setItem('timer', timer.toString())
      setDoTimer(false)
    }
  }, [isGameWon, doBounce, timer])

  useEffect(() => {
    if (doTimer && checkPenaltyTimer && !isGameWon) {
      if (guesses.length > 2) {
        timerRef.current = timerRef.current + 10 * (guesses.length - 2)
        setTimer(timerRef.current)
        setTimeout(() => {
          setAddedPenalty(false)
        }, 1500)
        setAddedPenalty(true)
      }
      setCheckPenaltyTimer(false)
    }
  }, [checkPenaltyTimer, doTimer, isGameWon, guesses])

  const charQueue: string[] = [];
  let isProcessing = false;

  const processQueue = () => {
    if (isProcessing || charQueue.length === 0) return;

    isProcessing = true;

    const char = charQueue.shift();
    if (char) {
      onChar(char); // Call your existing onChar function
    }

    setTimeout(() => {
      isProcessing = false;
      processQueue(); // Process the next character in the queue
    }, 50); // Small delay to ensure sequential processing
  };

  const onCharWithQueue = (value: string) => {
    charQueue.push(value); // Add the character to the queue
    processQueue(); // Start processing the queue
  };

  const onChar = (value: string) => {

    console.log('onChar', value, currentGuess, selCol)

    if (isGameWon) return

    if (isWordCommutative) {
      setWordCommutative(false)
    }

    if (isFlexInput && guesses.length < numRows) {
      let guessArray = currentGuess.split('')
      if (currentGuess === '') {
        // make guessArray array of spaces and length of numColumns
        for (let i = 0; i < numColumns; i++) {
          guessArray.push(' ')
        }
      }

      guessArray[selCol] = value
      if (selCol < numColumns - 1) {
        //find next column with a space in it
        let nextCol = selCol + 1
        if (guessArray.includes(' ')) {
          while (nextCol < numColumns - 1 && guessArray[nextCol] !== ' ') {
            nextCol++
          }
        }
        setColNumber(nextCol)
      }
      setCurrentGuess(guessArray.join(''))
    }

    if (
      !isFlexInput &&
      currentGuess.length < numColumns &&
      guesses.length < numRows
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    if (isFlexInput) {
      let guessArray = currentGuess.split('')
      const prevValue = guessArray[selCol]

      // if current cell is empty, go to previous cell and blank it out
      if (prevValue === ' ' && selCol > 0) {
        guessArray[selCol - 1] = ' '
        setColNumber(selCol - 1)
      }

      // if current cell is not empty blank it out but stay in same column
      if (prevValue !== ' ') {
        guessArray[selCol] = ' '
      }

      setCurrentGuess(guessArray.join(''))
    } else {
      setCurrentGuess(currentGuess.slice(0, -1))
    }
  }

  const validateSum = (sum: string) => {
    const parts = sum.split('=')
    if (parts.length === 2) {
      //do they compute ...
      const left = evaluate(parts[0])
      const right = evaluate(parts[1])

      if (left === 'ERROR' || right === 'ERROR') {
        return false
      }
      const isValid = Math.abs(left - right) < 0.0000001
      if (isValid) {
        return true
      }
    }
    return false
  }

  const isCommutativeEquivalent = (sum: string) => {
    return doesCommute(sum, solution, gameMode)
  }

  const onEnter = () => {

    //don't process if guess not complete ... 
    const guessLength = currentGuess.trim().length
    if (guessLength < solution.length) return

    // uncomment to go live with new alerts ... 
    // if there is no equals sign or more than one equals sign
    console.log({ currentGuess })
    if (!currentGuess.includes('=') || currentGuess.split('=').length > 2) {
      console.log('not one equals or more than one equals')
      setNotOneEquals(true)
      setTimeout(() => {
        setNotOneEquals(false)
      }, 5000)
      return
    }
    // make sure only numbers on the left of the equals
    const left = currentGuess.split('=')[0]
    const right = currentGuess.split('=')[1]

    // end new alerts

    if (BODMASissue) setBODMASIssue({ result: false, lhs: '', realAnswer: '' })

    // does the word compute ?
    if (currentGuess.includes(' ')) {
      setWordNotComplete(true)
      return setTimeout(() => {
        setWordNotComplete(false)
      }, 2000)
    } else {
      if (!validateSum(currentGuess)) {
        // wrong BODMAS understanding?
        const bodmas = isBODMASWrong(currentGuess)
        if (bodmas.result) {
          return setBODMASIssue({
            result: true,
            lhs: bodmas.lhs,
            realAnswer: bodmas.realAnswer,
          })
        } else {
          setWordNotCompute(true)
          return setTimeout(() => {
            setWordNotCompute(false)
          }, 2000)
        }
      }
    }

    // uncomment to go live with new alerts
    // if left starts with a non number
    if (left[0].match(/[^0-9.π]/)) {
      console.log('left starts with non number')
      setStartsWithSymbol(true)
      setTimeout(() => {
        setStartsWithSymbol(false)
      }, 4000)
    } else {
      // if there is a lone zero (i.e any zero between a symbol) in the left side, alert
      if (('=' + left + '=').match(/[^0-9.]0[^0-9.]/)) {
        console.log('lone zero in left')
        setZeroBeforeEquals(true)
        setTimeout(() => {
          setZeroBeforeEquals(false)
        }, 4000)
      } else {
        // if left or right starts with a zero
        if (left[0] === '0' || (right[0] === '0' && right !== '0')) {
          console.log('left or right starts with zero')
          setStartsWithZero(true)
          setTimeout(() => {
            setStartsWithZero(false)
          }, 4000)
        } else {
          // split currentGuess on a number number
          let toTest = currentGuess
          if (right === '0') {
            toTest = left;
          }
          const split = toTest.split(/(\d+)/)
          console.log({ split })
          // do any parts start with a zero
          if (split.some((part) => part[0] === '0')) {
            console.log('there is a leading zero')
            setStartsWithZero(true)
            setTimeout(() => {
              setStartsWithZero(false)
            }, 4000)
          } else {
            // right should have only numbers .. match only numbers - and allow pi symbol
            if (right.match(/[^0-9.π]/)) {
              console.log('right has non numbers')
              setSymbolsWrongSide(true)
            } else {
              // left SHOULD have symbols (not just numbers) 
              if (!left.match(/[^0-9.]/)) {
                console.log('left has no symbols')
                setSymbolsWrongSide(true)
              }
            }
          }
        }
      }
    }
    // end new alerts

    let winningWord = isWinningWord(solution, currentGuess)

    if (
      !currentGuess.includes(' ') &&
      currentGuess.length === numColumns &&
      guesses.length < numRows &&
      !isGameWon
    ) {
      let cGuess = currentGuess

      if (!winningWord) {
        if (isCommutativeEquivalent(cGuess) && acceptCommut) {
          setWordCommutative(true)
          cGuess = solution
          setCurrentGuess(solution)
          winningWord = true
          setDoBounce(true)
          setTimeout(() => {
            setDoBounce(false)
          }, 1000)
        }
      }

      setGuesses([...guesses, cGuess])
      setCurrentGuess('')
      setColNumber(0)

      logEvent(analytics, 'guess_entered_' + (gameMode == '' ? 'classic' : gameMode) + '_' + (guesses.length + 1));


      // if this was the second guess trigger goal
      if (guesses.length === 1) {
        console.log('second guess. Log conversion')
        window._conv_q = window._conv_q || [];
        _conv_q.push(["triggerConversion", "100482275"]);
      }

      // if this was the third guess trigger goal
      if (guesses.length === 2) {
        console.log('third guess. Log conversion')
        window._conv_q = window._conv_q || [];
        _conv_q.push(["triggerConversion", "100481177"]);
      }

      if (winningWord) {
        logEvent(
          analytics,
          'game_won' + (gameMode !== '' ? '_' + gameMode : '')
        )
        mpTrackIfEnabled('game_won', { gameMode: gameMode, guesses: guesses.length + 1 })
        logEvent(
          analytics,
          'game_won_in_' +
          (guesses.length + 1) +
          (gameMode !== '' ? '_' + gameMode : '')
        )
        if (!isPreviousGame) {
          // regular stats - synced with cloud if logged in ... 
          // get lastPlayed date from stats
          const lastUpdated = stats.lastUpdated || ""
          // only proceed to update stats if lastUpdated is "" or is before today
          mpTrackIfEnabled('save stats check', { gameMode: gameMode, stats: stats, lastUpdated: lastUpdated, today: new Date().toISOString().substring(0, 10) })
          if (lastUpdated === "" || lastUpdated < new Date().toISOString().substring(0, 10)) {
            stats.winRows[guesses.length] = stats.winRows[guesses.length] + 1
            stats.gamesPlayed = stats.gamesPlayed + 1
            stats.gamesWon = stats.gamesWon + 1
            stats.currentStreak =
              stats.gamesPlayed === stats.gamesWon
                ? stats.gamesWon
                : (stats.currentStreak || 0) + 1
            if (stats.currentStreak > (stats.maxStreak || 0)) {
              stats.maxStreak = stats.currentStreak
            }
            if (gameMode === 'speed' || gameMode === 'instant') {
              if (stats.averageGuessTime) {
                stats.averageGuessTime = {
                  gamesWon: stats.averageGuessTime.gamesWon + 1,
                  totalTime: stats.averageGuessTime.totalTime + timer,
                }
              } else {
                stats.averageGuessTime = { gamesWon: 1, totalTime: timer }
              }
            }
            stats.lastUpdated = new Date().toISOString().substring(0, 10)
            setStats({ ...stats })
            saveGameStats(gameMode, stats, guesses.length + 1, solutionIndex)
            mpTrackIfEnabled('save stats', { gameMode: gameMode, stats: stats })
          }

          //device stats (local backup - same as legacy pre cloud sync)
          deviceStats.winRows[guesses.length] = deviceStats.winRows[guesses.length] + 1
          deviceStats.gamesPlayed = deviceStats.gamesPlayed + 1
          deviceStats.gamesWon = deviceStats.gamesWon + 1
          deviceStats.currentStreak =
            deviceStats.gamesPlayed === deviceStats.gamesWon
              ? deviceStats.gamesWon
              : (deviceStats.currentStreak || 0) + 1
          if (deviceStats.currentStreak > (deviceStats.maxStreak || 0)) {
            deviceStats.maxStreak = deviceStats.currentStreak
          }
          if (gameMode === 'speed') {
            if (deviceStats.averageGuessTime) {
              deviceStats.averageGuessTime = {
                gamesWon: deviceStats.averageGuessTime.gamesWon + 1,
                totalTime: deviceStats.averageGuessTime.totalTime + timer,
              }
            } else {
              deviceStats.averageGuessTime = { gamesWon: 1, totalTime: timer }
            }
          }
          setDeviceStats({ ...deviceStats })
          saveDeviceGameStats(deviceStats)

        }

        //console.log('tiktokpixel complete game won')
        // TikTokPixel.track('CompleteRegistration', { gameMode: gameMode, isWon: true })
        ReactPixel.trackCustom('GameComplete', { gameMode: gameMode, isWon: true })

        // unique facebook pixel event 'UniqueGameComplete' per user
        const uniqueGameComplete = localStorage.getItem('uniqueFBGameComplete')
        if (uniqueGameComplete === null) {
          localStorage.setItem('uniqueFBGameComplete', 'true')
          ReactPixel.trackCustom('UniqueGameComplete', { gameMode: gameMode, isWon: true })
        }

        return setIsGameWon(true)
      }

      // check penalty timer ...
      setCheckPenaltyTimer(true)

      if (guesses.length === numRows - 1) {
        logEvent(
          analytics,
          'game_lost' + (gameMode !== '' ? '_' + gameMode : '')
        )
        mpTrackIfEnabled('game_lost', { gameMode: gameMode, guesses: guesses.length + 1 })
        if (!isPreviousGame) {

          const lastUpdated = stats.lastUpdated || ""
          // only proceed to update stats if lastUpdated is "" or is before today
          mpTrackIfEnabled('save stats check', { gameMode: gameMode, stats: stats, lastUpdated: lastUpdated, today: new Date().toISOString().substring(0, 10) })
          if (lastUpdated === "" || lastUpdated < new Date().toISOString().substring(0, 10)) {
            stats.gamesPlayed = stats.gamesPlayed + 1
            stats.currentStreak = 0
            setStats({ ...stats })
            saveGameStats(gameMode, stats, 0, solutionIndex)
            mpTrackIfEnabled('save stats', { gameMode: gameMode, stats: stats })
          }

          //device stats - backup - no cloud sync
          deviceStats.gamesPlayed = deviceStats.gamesPlayed + 1
          deviceStats.currentStreak = 0
          setDeviceStats({ ...deviceStats })
          saveDeviceGameStats(deviceStats)

        }
        console.log('tiktokpixel complete game lost')
        // TikTokPixel.track('CompleteRegistration', { gameMode: gameMode, isWon: false })

        setIsGameLost(true)
      }
    }
  }

  useEffect(() => {

    if (isGameLost) {
      localStorage.setItem('currentStraight', '0')
    }

    // if isGameLost is true or isGameWon is true set an interval
    if (isGameLost || isGameWon) {
      const thenDate = new Date()
      const then = Date.UTC(
        thenDate.getUTCFullYear(),
        thenDate.getUTCMonth(),
        thenDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
      var interval = setInterval(() => {
        const nowDate = new Date()
        const now = Date.UTC(
          nowDate.getUTCFullYear(),
          nowDate.getUTCMonth(),
          nowDate.getUTCDate(),
          0,
          0,
          0,
          0
        )
        if (now !== then) {
          window.location.reload()
          clearInterval(interval)
        }
      }, 5000)
    }
    return () => {
      if (interval !== undefined) clearInterval(interval)
    }
  }, [isGameLost, isGameWon])

  useEffect(() => {
    if (doTimer) {
      // set timer to timer in localStorage or 0
      const strTimer = localStorage.getItem('timer')
      if (strTimer) {
        timerRef.current = parseInt(strTimer)
        setTimer(timerRef.current)
      } else {
        setTimer(0)
        timerRef.current = 0
      }
      var interval = setInterval(() => {
        timerRef.current = timerRef.current + 1
        setTimer(timerRef.current)
        // every 10 seconds save timer to localStorage
        if (timerRef.current % 10 === 0) {
          localStorage.setItem('timer', timerRef.current.toString())
        }
      }, 1000)
    }
    return () => {
      if (interval !== undefined) clearInterval(interval)
    }
  }, [doTimer])

  const restartInstant = () => {
    // remove last guess from guesses
    setGuesses(guesses.slice(0, guesses.length - 1))
    setIsGameLost(false)
  }

  const gameNumText = isPreviousGame ? (
    <span className="text-sm"> #{solutionIndex + 1}</span>
  ) : (
    <span id="mainScreenHelpIcon"
      className="cursor-pointer active:bg-slate-400 hidden"
      onClick={() => {
        setIsInfoModalOpen(true)
      }}
      aria-label="Help"
      role="navigation"
    >
      <QuestionMarkCircleIcon
        className="h-6 w-6 cursor-pointer dark:text-[#D7DADC] ml-2"

      />{' '}
    </span>
  )
  const timerText = doTimer ? (
    <span className="text-base font-bold text-[#398874]">
      ⏱️ {secondsToHms(timer)}
    </span>
  ) : (
    ''
  )

  const isPWA = isRunningInPWA() //localStorage.getItem('pwa') === 'true'

  let gameList = ""
  if (isGameWon) {
    gameList = '?gp=' + setGamesPlayedToday(gameMode)
  } else {
    gameList = '?gp=' + getGamesPlayedToday()
  }


  useEffect(() => {
    // random A/B test - if A apply class anchor-ad-spacing to body otherwise apply class no-anchor-ad to body
    if (!doneAdClasses) {
      //get screen width
      // const screenWidth = window.innerWidth
      // if (screenWidth < 669) {
      //   console.log('screenWidth', screenWidth)
      //   const adTest = Math.random() < 0.5 ? 'anchor-ad' : 'no-anchor-ad'
      //   console.log('applying ad class', adTest)
      //   logEvent(analytics, 'ad_test_' + adTest)
      //   document.body.classList.add(adTest)
      // }
      const adTest = localStorage.getItem('adTest')
      logEvent(analytics, 'ad_test_' + adTest)

      setDoneAdClasses(true)
    }
  }, [doneAdClasses])

  if (!gameLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">Loading...</div>

          <button
            className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-8"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }

  if (window.top) {
    const isConvert = (localStorage.getItem('convert') || 'false') == 'true'
    if ((window.location !== window.top.location) && !isConvert) {
      //window.top.location = window.location;
      return (
        <div className="pb-12 pt-4 w-[100%] text-center px-2 sm:px-6 lg:px-8 max-h-screen">
          <div>
            <div>
              <button
                id="playButton"
                className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-8"
                onClick={() => {
                  if (window.top) {
                    window.top.location = window.location
                  }
                }}
              >
                {' '}
                Click here to play Nerdle{' '}
              </button>
            </div>

            <script>document.getElementById('playButton').click()</script>

            <div className="mt-4">
              <h1>
                <a
                  href={`${window.location.href}`}
                  target="_new_nerdle"
                  className="underline pointer"
                >
                  Click here to open in new window
                </a>
              </h1>
            </div>
          </div>
        </div>
      )
    }
  }

  if (window.experienceId) {
    logEvent(analytics, 'convert_experiment_' + window.experienceId + '_' + window.variantId)
    console.log('logged convert_experiment_' + window.experienceId + '_' + window.variantId)
    window.experienceId = undefined
  }

  // function isWinModalNewVisible() {
  //   return window.winModalNewVisible
  // }

  // // same for winModalOld
  // function isWinModalOldVisible() {
  //   return window.winModalOldVisible
  // }


  //removed  max-h-screen from div below
  return (
    <div className="pb-12 pt-4 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative mobile-top-2">

      {!isLoggedIn && !isNoDataModalOpen &&
        <div
          style={{ display: 'none' }}>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
              doGoogleLogin(credentialResponse, () => {
                window.location.reload()
              });
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
          />
        </div>}

      <Banner
        gameMode={gameMode}
        analytics={analytics}
        onShow={() => setShowBanner(true)}
      />

      <Menu
        isOpen={openMenu}
        handleClose={() => {
          setOpenMenu(false)
        }}
        gamesPlayed={stats.gamesPlayed}
        gameMode={gameMode}
        gameWon={isGameWon}
        handleAction={(action) => {
          if (action === 'info') {
            setIsInfoModalOpen(true)
          }
          if (action === 'stats') {
            setInitialStatsTab('stats')
            setIsStatsModalOpen(true)
          }
          if (action === 'settings') {
            setIsSettingsModalOpen(true)
          }
          if (action === 'share') {
            if (isGameWon) {
              setIsWinModalOpen(true)
            } else {
              setIsShareModalOpen(true)
            }
          }
          if (action === 'calc') {
            logEvent(analytics, 'open_calculator')
            setIsCalcModalOpen(true)
          }
          if (action === 'previous') {
            logEvent(analytics, 'open_previous')
            //setIsPreviousGamesModalOpen(true)
            window.location.href = 'https://www.nerdlegame.com/replay.html?ref=game'
          }
          if (action === 'faqs') {
            window.location.href = 'https://faqs.nerdlegame.com/'
          }
          if (action === 'blog') {
            window.location.href = 'https://www.nerdlegame.com/blog.html'
          }
        }}
      />

      <Alert
        message={
          <div className="px-2">
            <div className="absolute right-1 top-1">
              <XCircleIcon
                aria-label="Close"
                aria-hidden={false}
                className="h-6 w-6 cursor-pointer"
                onClick={() => setLoginExpired(false)}
              />
            </div>
            <p>Your Nerdle login has expired or is invalid. Please log in again.</p>

            <div className="flex justify-center mt-2">
              <button
                className="bg-[#820458] mx-2 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                onClick={() => setLoginExpired(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#820458] mx-2 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                onClick={() => {
                  setIsLBLLoginOpen(true)
                  setLoginExpired(false)
                }}
              >
                Login
              </button>
            </div>
          </div>
        }
        isOpen={isLoginExpired}
      />

      <Alert message="That guess doesn't compute!" isOpen={doesWordCompute} />

      <Alert
        message="A nerdle calculation always needs ONE equals sign. e.g. 12+34=46"
        isOpen={notOneEquals} />
      <Alert
        message={
          <div className="px-2 text-left">
            <div className="absolute right-1 top-1">
              <XCircleIcon
                aria-label="Close"
                aria-hidden={false}
                className="h-6 w-6 cursor-pointer"
                onClick={() =>
                  setSymbolsWrongSide(false)
                }
              />
            </div>
            <p>We've accepted that as a valid calculation but note the rules:</p>
            <p>- A nerdle calculation always includes an "=".</p>
            <p>- On the left of "=" must be one or more symbols.</p>
            <p>- On the right of "=" is only a number.</p>
            <p>- E.g. 12+34=46</p>
          </div>
        }
        isOpen={symbolsWrongSide} />
      <Alert
        message="We've accepted that as a valid calculation but please note that nerdle solutions never start with a symbol."
        isOpen={startsWithSymbol} />
      <Alert
        message="We've accepted that as a valid calculation but please note that nerdle answers never include a number with a leading zero."
        isOpen={startsWithZero} />
      <Alert
        message="We've accepted that as a valid calculation but please note that nerdle answers never include a lone zero on the left side of the '='."
        isOpen={zeroBeforeEquals} />
      <Alert
        message="Your guess is not complete - please fill in the blanks!"
        isOpen={isWordComplete}
      />
      <Alert
        message={
          <div className="px-2">
            <div className="absolute right-1 top-1">
              <XCircleIcon
                aria-label="Close"
                aria-hidden={false}
                className="h-6 w-6 cursor-pointer"
                onClick={() =>
                  setBODMASIssue({ result: false, lhs: '', realAnswer: '' })
                }
              />
            </div>
            <p>That guess does not compute.</p>
            <p className="mt-2">
              {BODMASissue.lhs} actually equals {BODMASissue.realAnswer}
            </p>
            <p className="mt-2">
              <a
                className="underline font-bold focus:outline-none  cursor-pointer"
                href="https://faqs.nerdlegame.com/?faq=8"
                target="_new"
              >
                "Order of operations"
              </a>{' '}
              always applies in nerdle.
            </p>
            <p className="mt-2">So calculate * and / before + and -. </p>
            <p className="mt-2">eg. 1+2*3 equals 1+6 equals 7.</p>
          </div>
        }
        isOpen={BODMASissue.result}
      />
      <Alert
        message={createdNewAccount ? 'Thanks for registering.  Your nerdle account has been created and your stats will be synced.' : `You are now logged in and your stats will be synced.`}
        isOpen={isScoreSharedToLBL}
        variant="success"
      />
      {/* <Alert
        message={`You lost, the calculation was ${solution}`}
        isOpen={isGameLost && gameMode !== 'instant'}
      /> */}
      <Alert
        message={
          <div>
            <p>
              That's not the answer we're looking for - check you have the green
              tile in the right place and have used all the purple tiles.
            </p>
            <p className="mt-2">
              <span
                className="underline font-bold focus:outline-none  cursor-pointer"
                onClick={() => restartInstant()}
              >
                Try again
              </span>
              {' or '}
              <span
                className="underline font-bold focus:outline-none  cursor-pointer"
                onClick={() => setInstantLost(true)}
              >
                Give up and show me the answer!
              </span>
            </p>
          </div>
        }
        isOpen={isGameLost && !instantLost && gameMode === 'instant'}
      />
      <Alert
        message={`You lost, the calculation was ${solution}`}
        isOpen={isGameLost && instantLost && gameMode === 'instant'}
      />
      <Alert
        message={
          isGameWon
            ? 'Game copied to clipboard - paste it to social media or share with your friends ...'
            : 'Share message copied to clipboard'
        }
        isOpen={shareComplete}
        variant="success"
      />
      <Alert
        message={
          <div className="px-2">
            <div className="absolute right-1 top-1">
              <XCircleIcon
                aria-label="Close"
                aria-hidden={false}
                className="h-6 w-6 cursor-pointer"
                onClick={() => setInstantQuit(false)}
              />
            </div>
            <p>Want to give up and see the answer?</p>

            <div className="flex justify-center mt-2">
              <button
                className="bg-[#820458] mx-2 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                onClick={() => setInstantQuit(false)}
              >
                No
              </button>
              <button
                className="bg-[#820458] mx-2 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                onClick={() => {
                  setInstantQuit(false)
                  if (guesses.length === 1) {
                    setGuesses([...guesses, '--------'])
                  }
                  setIsGameLost(true)
                  setInstantLost(true)
                  setDoTimer(false)
                }}
              >
                Yes
              </button>
            </div>
          </div>
        }
        isOpen={instantQuit}
      />

      <div className={'flex flex-row justify-center'}>
        {!disableAds && (
          <div id="nerdlegame_D_x1" className="desktopSideAd mr-8 ml-4"></div>
        )}

        <div className="max-w-[100%] w-[450px] items-center">

          {showGraphicBanner && (
            <div className="mb-2 relative">
              <a href="https://nerdlegame.com/crossnerdle/home/mathscot.html" target="_new" className="cursor-pointer">
                <img src="/mathscot_banner.png" alt="Cross Nerdle Banner" />
              </a>
              <div className="absolute text-white bg-gray-800 rounded-full" style={{ top: -5, right: -5 }}>
                <XCircleIcon
                  aria-label="Close"
                  aria-hidden={false}
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => setShowGraphicBanner(false)}
                />
              </div>
            </div>
          )}

          <div className="relative flex max-w-[95%] w-[440px] mx-auto items-center pb-nav main-nav">
            {/* {!isPWA ? (
              <a href={"https://www.nerdlegame.com" + gameList + '&v002'}>
                <img
                  src={theme == 'xmas' ? '/logoxmas2.png' : '/logo192.png'}
                  alt="Nerdlegame - the daily numbers game"
                  style={{
                    height: theme == 'xmas' ? 42 : 32,
                    paddingRight: 10,
                  }}
                  aria-label="Nerdle home page"
                />
              </a>
            ) : ( */}

            <button
              aria-label="Menu"
              type="button"
              onClick={() => {
                setOpenMenu(true)
              }}
            >


              <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 32, width: 32, paddingRight: 10 }}>
                <path d="M0 16.0693V13.4027H24V16.0693H0ZM0 9.40267V6.736H24V9.40267H0ZM0 2.736V0.0693359H24V2.736H0Z"
                  className="fill-[#820458] dark:fill-white"
                />
              </svg>


            </button>

            <div
              className="cursor-pointer select-none w-[42px]"
              onClick={() => {
                setOpenMenu(true)
              }}
            >
              <img
                src="/logo192.png"
                alt="Nerdlegame - the daily numbers game"
                style={{ height: 32, paddingRight: 10 }}
                aria-label="Open menu"
              />
            </div>




            {/* )} */}

            <div className={"flex flex-row text-left items-center grow"}>
              <p className=" mr-2 dark:text-white">{gameNumText}</p>

              <span>
                <div className={'dark:text-white nerdle-sub-name'}>
                  {gameMode === 'speed' ? 'speed ' : ''}
                  {gameMode === 'mini' ? 'mini ' : ''}
                  {gameMode === 'micro' ? 'micro ' : ''}
                  {gameMode === 'pro'
                    ? theme == 'xmas'
                      ? 'add-vent '
                      : clueImage === '' ? 'pro ' : 'clue'
                    : ''}
                  {gameMode === 'instant' ? 'instant ' : ''}
                  {gameMode === 'maxi' ? 'maxi ' : ''}
                  {gameMode === 'midi' ? 'midi ' : ''}
                </div>
                <div>
                  <span
                    className={'dark:text-white nerdle-name'}
                    style={{ fontSize: gameMode === '' ? '1.8rem' : undefined }}
                  >
                    nerdle
                  </span>
                  <span className="nerdle-dot">.</span>
                </div>
              </span>
            </div>

            {isCupGame && cupCode && cupGameName ? (
              <div className="flex mx-auto items-center" style={{ borderBottom: 'solid #CCCCCC', marginBottom: '5px', flexGrow: 1 }}>
                <p className="ml-auto mr-2 dark:text-white justify-right" text-align="right" align-items="right"><img src="https://cup.nerdlegame.com/cup/assets/images/nerdle-cup-icon.png" style={{ width: '30px', paddingTop: '3px', paddingBottom: '3px' }}></img></p>
                <p className="ml-2 mr-auto dark:text-white justify-left  text-center" text-align="center" align-items="left">
                  <u>
                    <a id="resultsLink" href={"https://cup.nerdlegame.com/cup/challengetrack/?code=" + cupCode} onClick={() => {
                      //remove focus from resultsLink
                      const el = document.getElementById("resultsLink");
                      el?.blur();
                    }}
                      title="track live scores for this challenge" target="_blank"><b>{cupGameName}</b>
                    </a>
                  </u>
                  <div>(game {parseInt(gmt || '0') - parseInt(gmr || '0') + 1} of {gmt})</div>
                </p>
              </div>
            ) :

              <div>

                <button
                  aria-label="Menu"
                  type="button"
                  onClick={() => {
                    setIsInfoModalOpen(true)
                  }}
                >

                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 24, width: 24, marginRight: 10 }}>
                    <path d="M11.125 11.1943L11.1728 11.171C11.3224 11.0963 11.4903 11.066 11.6566 11.0837C11.8229 11.1014 11.9806 11.1664 12.1111 11.271C12.2416 11.3756 12.3394 11.5154 12.3929 11.6738C12.4464 11.8323 12.4534 12.0027 12.413 12.165L11.587 15.4737C11.5463 15.636 11.5531 15.8067 11.6065 15.9653C11.6599 16.1239 11.7576 16.2639 11.8882 16.3687C12.0187 16.4734 12.1766 16.5386 12.343 16.5563C12.5094 16.5741 12.6775 16.5437 12.8272 16.4688L12.875 16.4443M22.5 12.0693C22.5 13.4482 22.2284 14.8136 21.7007 16.0875C21.1731 17.3614 20.3996 18.5189 19.4246 19.494C18.4496 20.469 17.2921 21.2424 16.0182 21.7701C14.7443 22.2977 13.3789 22.5693 12 22.5693C10.6211 22.5693 9.25574 22.2977 7.98182 21.7701C6.70791 21.2424 5.55039 20.469 4.57538 19.494C3.60036 18.5189 2.82694 17.3614 2.29926 16.0875C1.77159 14.8136 1.5 13.4482 1.5 12.0693C1.5 9.28456 2.60625 6.61385 4.57538 4.64471C6.54451 2.67558 9.21523 1.56934 12 1.56934C14.7848 1.56934 17.4555 2.67558 19.4246 4.64471C21.3938 6.61385 22.5 9.28456 22.5 12.0693ZM12 7.69434H12.0093V7.70367H12V7.69434Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="stroke-[#2F3237] dark:stroke-white" />
                  </svg>


                </button>


                <button
                  aria-label="Menu"
                  type="button"
                  onClick={() => {
                    setIsStatsModalOpen(true)
                    setInitialStatsTab('stats')
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: badgeEnabledGameModes.includes(gameMode) ? 10 : 0 }}>
                    <path d="M1.5 13.3818C1.5 12.6573 2.088 12.0693 2.8125 12.0693H5.4375C6.162 12.0693 6.75 12.6573 6.75 13.3818V21.2568C6.75 21.9813 6.162 22.5693 5.4375 22.5693H2.8125C2.4644 22.5693 2.13056 22.4311 1.88442 22.1849C1.63828 21.9388 1.5 21.6049 1.5 21.2568V13.3818ZM9.375 8.13184C9.375 7.40734 9.963 6.81934 10.6875 6.81934H13.3125C14.037 6.81934 14.625 7.40734 14.625 8.13184V21.2568C14.625 21.9813 14.037 22.5693 13.3125 22.5693H10.6875C10.3394 22.5693 10.0056 22.4311 9.75942 22.1849C9.51328 21.9388 9.375 21.6049 9.375 21.2568V8.13184ZM17.25 2.88184C17.25 2.15734 17.838 1.56934 18.5625 1.56934H21.1875C21.912 1.56934 22.5 2.15734 22.5 2.88184V21.2568C22.5 21.9813 21.912 22.5693 21.1875 22.5693H18.5625C18.2144 22.5693 17.8806 22.4311 17.6344 22.1849C17.3883 21.9388 17.25 21.6049 17.25 21.2568V2.88184Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="stroke-[#2F3237] dark:stroke-white" />
                  </svg>

                </button>

                {badgeEnabledGameModes.includes(gameMode) &&
                  <button
                    aria-label="Badges"
                    type="button"
                    onClick={() => {
                      setIsStatsModalOpen(true)
                      setInitialStatsTab('badges')
                    }}
                  >


                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.25 20.9443H7.74999M18.25 20.9443C19.1782 20.9443 
20.0685 21.3131 20.7249 21.9695C21.3812 22.6258 21.75 23.5161 
21.75 24.4443H4.24999C4.24999 23.5161 4.61874 22.6258 5.27512 
21.9695C5.9315 21.3131 6.82173 20.9443 7.74999 20.9443M18.25 
20.9443V17.0068C18.25 16.2823 17.6632 15.6943 16.9375 
15.6943H15.9213M7.74999 20.9443V17.0068C7.74999 16.2823 8.33799 15.6943
 9.06249 15.6943H10.0798M15.9213 15.6943H10.0798M15.9213 15.6943C15.266 14.5626
  14.8744 13.2977 14.7757 11.9937M10.0798 15.6943C10.7347 14.5625 11.1259 13.2976 
  11.2243 11.9937M14.7757 11.9937C15.9516 11.7223 17.0479 11.1833 17.9817 
  10.4187M14.7757 11.9937C13.6072 12.2632 12.3928 12.2632 11.2243 11.9937M11.2243 
  11.9937C10.0488 11.7221 8.9517 11.1832 8.01832 10.4187M5.12499 4.01134C3.97933 
  4.17817 2.84533 4.38117 1.72299 4.618C1.98316 6.14492 2.74217 7.54252 3.88126 
  8.59211C5.02035 9.64169 6.47526 10.2841 8.01832 10.4187M5.12499 4.01134V4.31934C5.12499 
  6.77867 6.25199 8.97434 8.01832 10.4187M5.12499 4.01134V2.24384C7.69866 1.881 10.3283 
  1.69434 13 1.69434C15.6728 1.69434 18.3025 1.881 20.875 2.24267V4.01134M20.875 
  4.01134V4.31934C20.875 6.77867 19.748 8.97434 17.9817 10.4187M20.875 4.01134C22.0152 
  4.17724 23.1497 4.37957 24.277 4.618C24.0169 6.14474 23.258 7.54221 22.1192 8.59177C20.9803 
  9.64134 19.5245 10.2838 17.9817 10.4187" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        className="stroke-[#2F3237] dark:stroke-white" />
                    </svg>

                    {cupDotColor && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: cupDotColor,
                          border: '2px solid white',
                          display: 'block',
                          zIndex: 2,
                        }}
                      />
                    )}

                  </button>}

              </div>


            }

          </div>

          {clueImage !== '' && (
            <div className="flex flex-row justify-center mb-2">
              <img
                src={clueImage}
                alt="clue"
                style={{ width: '100%', cursor: gameMode === 'midi' ? 'pointer' : 'default' }}
              />
            </div>
          )}

          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            columns={numColumns}
            solution={solution}
            rows={numRows}
            animate={doBounce}
            showPenaltyBadges={doTimer}
            onCellClick={(col) => setColNumber(col)}
            col={selCol}
            flexInput={isFlexInput && !isGameWon}
            rawReveal={rawReveal}
            gameWon={isGameWon}
          />

          {doTimer && (
            <div className="text-center items-center justify-center -mt-3 mb-1">
              {gameMode === 'instant' && guesses.length === 1 && (
                <div className="flex flex-row items-center justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-1 mt-2 mb-2 bg-slate-200  text-base font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => {
                      setInstantQuit(true)
                    }}
                  >
                    Give up
                  </button>
                </div>
              )}
              {addedPenalty ? (
                <div className="animate-bounce text-center font-bold text-[#820458]">
                  +{10 * (guesses.length - 2)}s penalty
                </div>
              ) : (
                timerText
              )}
            </div>
          )}

          <Keyboard
            onChar={onCharWithQueue}
            onDelete={onDelete}
            onEnter={onEnter}
            guesses={guesses}
            solution={solution}
            additionalKeys={additionalKeys}
            ommittedKeys={ommittedKeys}
            gameMode={gameMode}
          />

          {!disableAds && (
            <div className="max-w-[90%] mx-auto justify-center items-center text-center cursor-pointer dark:text-[#D7DADC] mt-4 ad-space">

              {showNumberChampions
                ?
                (
                  <a href="https://www.numberchampions.org.uk/in-school-volunteers-3/" target="_blank" rel="noreferrer">
                    {/* <video controls={false} autoPlay={true} muted={true} playsInline={true} loop={true} height="200" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                      <source src="/NERDLE_ADD_PLANUK.mov" />
                    </video> */}
                    <img src="/number_champions_2.gif" alt="Number Champions" style={{ height: 100, marginLeft: 'auto', marginRight: 'auto', marginTop: 20, marginBottom: 20 }} />
                  </a>
                )
                : (
                  <>
                    <div id="nerdlegame_D_1"></div>
                    <div id="nerdlegame_M_1"></div>
                  </>
                )
              }

            </div>
          )}

          {!showBanner && (
            <>

              <div className="flex w-full justify-center bottom-buttons gap-5">

                <div className="bottom-button h-[48px] w-[152px] p-[12px] rounded-lg border border-[#DEE3ED] flex items-center justify-center cursor-pointer text-black dark:text-white text-sm"
                  onClick={() => {
                    logEvent(analytics, 'click_our_mission')
                    setIsPositiveModalOpen(true)
                  }}>      <img
                    src="/positive_numbers.png"
                    alt="Positive Numbers"
                    style={{ height: 18, marginLeft: 5, marginRight: 5 }}
                  />Our mission</div>


                <a
                  className="cursor-pointer underline focus:outline-none"
                  href={showPlanInternational ? "https://www.charityextra.com/planappeal23/richard-mann" : "https://www.nerdlegame.com"}
                  target="_new"
                  onClick={() => {
                    logEvent(analytics, 'click_more_games')
                  }}
                >


                  <div className="bottom-button h-[48px] w-[152px] p-[12px] rounded-lg border bg-[#F1F3F9] border-[#DEE3ED] flex items-center justify-center cursor-pointer text-[#820458] text-sm">
                    <img
                      src="/new-images/more-games.svg"
                      alt="Positive Numbers"
                      style={{ height: 18, marginLeft: 5, marginRight: 5 }}
                    />More games</div> </a>

              </div>


            </>
          )}



          {disableAds && (
            //show purple donate button with text "donate to support nerdle"
            <div className="mt-4 max-w-[90%] mx-auto justify-center items-center mt-4 text-center">
              <a
                className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 mb-2"
                href="https://www.leaderboardle.com/donateNerdleRedirect.html"
                target="_new"
              >
                <button>Donate to support Nerdle</button>
              </a>
            </div>
          )}

          <div style={{ height: 20 }}></div>

          {/* <WinModal
            isOpen={isWinModalOpen && !isStatsModalOpen && !openMenu && isWinModalOldVisible()}
            handleClose={() => setIsWinModalOpen(false)}
            guesses={guesses}
            hasClueRow={hasClueRow}
            clueGameIndex={clueGameIndex}
            numRows={numRows}
            handleShare={() => {
              //setIsWinModalOpen(false)
              setShareComplete(true)
              return setTimeout(() => {
                setShareComplete(false)
              }, 5000)
            }}
            solutionIndex={solutionIndex}
            solution={solution}
            commutMsg={isWordCommutative && !isGameLost}
            handleSettings={() => {
              setIsSettingsModalOpen(true)
            }}
            isUK={isUK}
            handleLogEvent={(s) => {
              logEvent(analytics, s)
            }}
            timerString={timer > 0 ? secondsToHms(timer) : ''}
            handleLBLLogin={(scoreText, method) => {
              setScoreText(scoreText)

              if (method === 2) {
                setIsLBLLoginOpen(true)
                return
              }

              doLblOauth()
            }}
            //variant={variation}
            variant={'0'}
            //variant={'2'}
            handleStatsOpen={() => { setIsStatsModalOpen(true) }}
            // *** ACHIEVEMENTS ***
            handleAchievementsUpdate={() => { setUpdateBadges(!updateBadges) }}
            handleRefreshStats={() => { setStatsLoaded(false) }}
          /> */}

          <WinModalNew
            isOpen={isWinModalOpen && !isStatsModalOpen && !openMenu /*&& isWinModalNewVisible()*/}
            handleClose={() => setIsWinModalOpen(false)}
            guesses={guesses}
            hasClueRow={hasClueRow}
            clueGameIndex={clueGameIndex}
            numRows={numRows}
            handleShare={() => {
              //setIsWinModalOpen(false)
              setShareComplete(true)
              return setTimeout(() => {
                setShareComplete(false)
              }, 5000)
            }}
            solutionIndex={solutionIndex}
            solution={solution}
            commutMsg={isWordCommutative && !isGameLost}
            handleSettings={() => {
              setIsSettingsModalOpen(true)
            }}
            isUK={isUK}
            handleLogEvent={(s) => {
              logEvent(analytics, s)
            }}
            timerString={timer > 0 ? secondsToHms(timer) : ''}
            handleLBLLogin={(scoreText, method) => {
              setScoreText(scoreText)

              if (method === 2) {
                setIsLBLLoginOpen(true)
                return
              }

              doLblOauth()
            }}
            //variant={variation}
            variant={'0'}
            //variant={'2'}
            handleStatsOpen={() => {
              setInitialStatsTab('stats')
              setIsStatsModalOpen(true)
            }}
            // *** ACHIEVEMENTS ***
            handleAchievementsUpdate={() => {
              setUpdateBadges(!updateBadges)
              getCupNotificationDotColor(gameMode).then(setCupDotColor)
            }}
            handleRefreshStats={() => { setStatsLoaded(false) }}
            cupUrlParams={cupUrlParams}
          />

          <LoseModal
            isOpen={isGameLost && gameMode !== 'instant'}
            solution={solution}
            solutionIndex={solutionIndex}
            handleClose={(reloadGuesses = false, restartGame = false) => {
              setIsGameLost(false)
              if (reloadGuesses) {
                // pop guesses
                setGuesses(guesses.slice(0, guesses.length - 1))
              }
              if (restartGame) {
                localStorage.removeItem('gameState')
                window.location.reload()
              }
            }}
            handleLogEvent={(s) => {
              logEvent(analytics, s)
            }}
          />

          <ShareModal
            isOpen={isShareModalOpen}
            handleClose={() => setIsShareModalOpen(false)}
            guesses={guesses}
            handleShare={() => {
              setIsShareModalOpen(false)
              setShareComplete(true)
              return setTimeout(() => {
                setShareComplete(false)
              }, 2000)
            }}
            solution={solution}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
            gameMode={gameMode}
          />

          <AboutModal
            isOpen={isAboutModalOpen}
            gameMode={gameMode}
            //handleClose={(action:string) => {
            handleClose={() => {
              ReactPixel.trackCustom('AboutClosed', { gameMode: gameMode })
              setIsAboutModalOpen(false)

              const unique30Secs = localStorage.getItem('uniqueFB30SecondsAfterAboutClosed')
              if (unique30Secs === null) {
                setTimeout(() => {
                  localStorage.setItem('uniqueFB30SecondsAfterAboutClosed', 'true')
                  ReactPixel.trackCustom('30SecondsAfterAboutClosed', { gameMode: gameMode })
                }, 30000)
              }

              // if (action == 'disable_hints') {
              //   localStorage.setItem('hints', 'false')
              //   setIsHintsEnabled(false)
              //   setUpdateHints(!updateHints)
              // }

              // if (action == 'enable_hints') {
              //   localStorage.setItem('hints', 'true')
              //   setIsHintsEnabled(true)
              //   setUpdateHints(!updateHints)
              // }


            }}
            handleHelp={() => {
              setIsAboutModalOpen(false)
              setIsInfoModalOpen(true)
            }}
            handleLogin={() => {
              setIsAboutModalOpen(false)
              setIsLBLLoginOpen(true)
            }}
            handleLogEvent={(s: string) => {
              logEvent(analytics, s)
            }}
            stats={stats}
          />

          {/* <NoDataModal
            isOpen={isNoDataModalOpen}
            handleClose={() => {
              localStorage.setItem('ndDismissed','1')
              setIsNoDataModalOpen(false)}
            }
            handleLogEvent={(s) => {
              logEvent(analytics, s)
            }}
          /> */}

          <StatsModal
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
            stats={stats}
            deviceStats={deviceStats}
            handleLBLLogin={(method) => {
              setScoreText(scoreText)

              if (method === 2) {
                setIsLBLLoginOpen(true)
                return
              }

              doLblOauth()
            }}
            handleShare={() => {
              setShareComplete(true)
              return setTimeout(() => {
                setShareComplete(false)
              }, 2000)
            }}
            logEvent={(s) => {
              logEvent(analytics, s)
            }}
            initialTab={initialStatsTab}
          />

          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => {
              setIsSettingsModalOpen(false)
            }}
            handleUpdate={(action) => {
              if (action === 1) {
                setColorBlindMode(!colorBlindMode)
              }
              if (action === 2) {
                setUpdateGameMode(true)
              }
              if (action === 4) {
                setAcceptCommut(!acceptCommut)
              }
              if (action === 5) {
                setIsFlexInput(!isFlexInput)
                setColNumber(0)
              }
              if (action == 6) {
                logEvent(
                  analytics,
                  disableAds ? 'reenabled_ads' : 'disabled_ads'
                )
                setDisableAds(!disableAds)
                if (/*isMobile &&*/ window.lngtd) {
                  window.lngtd.resetAndRunAuction()
                }
              }
              if (action === 7) {
                setWinAnimations(!winAnimations)
              }
              if (action === 8) {
                if (localStorage.getItem('useLocalTime') === 'true') {
                  logEvent(analytics, 'enabled_local_time')
                } else {
                  logEvent(analytics, 'disabled_local_time')
                }
              }
              if (action === 9) {
                //setIsLBLLoginOpen(true)
                doLblOauth()
              }
            }}
          />

          <PositiveNumbersModal
            isOpen={isPositiveModalOpen}
            handleClose={() => {
              setIsPositiveModalOpen(false)
            }}
            isUK={isUK}
            handleLogEvent={(s) => {
              logEvent(analytics, s)
            }}
          />

          <LBLLoginModal
            isOpen={isLBLLoginOpen}
            handleClose={() => {
              setIsLBLLoginOpen(false)
            }}
            scoreText={scoreText}
            handleLogin={() => {
              setIsScoreSharedToLBL(true)
              setTimeout(() => {
                setIsScoreSharedToLBL(false)
              }, 5000)

              setIsLBLLoginOpen(false)

              console.log('setting stats loaded to false...')
              setStatsLoaded(true)
              setStatsLoaded(false)

              // console.log('newAccount: ', localStorage.getItem('newAccount'))

              setCreatedNewAccount(localStorage.getItem('newAccount') === 'true')
              localStorage.removeItem('newAccount')

              // force scroll to top
              //window.scrollTo(0, 0)
              setTimeout(() => {
                postLBlToken(localStorage.getItem('lbl_token') || '');
              }, 1000);

              // if notifications are enabled we need to re-request so we can save token to new account
              if (localStorage.getItem('pushEnabled') === 'true') {
                console.log('re-requesting notification permission')
                Notification.requestPermission()
              }

            }}
          />

          {/* {isPWA && ( */}
          <Calculator
            isOpen={isCalcModalOpen}
            handleClose={() => setIsCalcModalOpen(false)}
          />
          {/* )} */}

          {/* {isPWA && ( */}
          <PreviousGamesModal
            isOpen={isPreviousGamesModalOpen}
            gameMode={gameMode}
            handleClose={() => setIsPreviousGamesModalOpen(false)}
          />
          {/* )} */}
        </div>

        {!disableAds && (
          <div id="nerdlegame_D_x2" className="desktopSideAd ml-8 mr-4"></div>
        )}
      </div>

      {gameMode != 'speed' && gameMode != 'instant' && gameMode != 'pro' &&
        <HintContainer
          update={updateHints}
          currentRow={guesses.length + 1}
          gamesPlayed={stats.gamesPlayed}
          columns={numColumns}
          callback={(action) => {
            if (action == 'hint1') {
              setIsInfoModalOpen(true)
            }
            if (action == 'disableHints') {
              localStorage.setItem('hints', 'false')
              setIsHintsEnabled(false)
              setUpdateHints(!updateHints)
            }
          }}
        />
      }

      <div id="adEventHandler" onClick={() => {
        console.log('adEventHandler clicked')
      }} />

    </div>
  )
}

export default MainApp
