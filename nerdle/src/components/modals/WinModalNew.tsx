import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { MiniGrid } from '../mini-grid/MiniGrid'
import { shareStatus, shareText } from '../../lib/share'
import { XCircleIcon, QuestionMarkCircleIcon, ShareIcon } from '@heroicons/react/outline'
import { isMobile } from 'react-device-detect'
import { games } from '../../lib/gameList'
import { fetchAchievementData } from '../../lib/cloudStats'
import { AchievementModal } from './AchievementModal'
import { enabledGameModes } from '../badges/EnabledGames'
import './cards.css'

//import {Adsense} from '@ctrl/react-adsense';
import classnames from 'classnames'
// import { isIOS, isAndroid } from 'react-device-detect';
// import { isRunningInPWA } from '../../lib/isPWA'
import { setGamesPlayedToday, getGamesPlayedInLast7Days, getGamesPlayedEver } from '../../lib/gameTracker'
import { postToFlutter } from '../../lib/isPWA'

declare var window: any
declare var _conv_q: any

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  handleShare: () => void
  solutionIndex: number
  solution: string
  handleSettings: () => void
  commutMsg?: boolean
  isUK: boolean
  handleLogEvent: (val: string) => void
  timerString: String
  handleLBLLogin: (payload: string, method: number) => void
  hasClueRow: boolean
  clueGameIndex: string
  numRows: number
  variant: string
  handleStatsOpen?: () => void
  handleAchievementsUpdate: () => void
  handleRefreshStats: () => void
  cupUrlParams: { [key: string]: string }
}

export const WinModalNew = ({
  isOpen,
  handleClose,
  guesses,
  handleShare,
  solutionIndex,
  solution,
  commutMsg,
  handleSettings,
  isUK,
  handleLogEvent,
  timerString,
  handleLBLLogin,
  hasClueRow,
  clueGameIndex,
  numRows,
  variant,
  handleStatsOpen,
  handleAchievementsUpdate,
  handleRefreshStats,
  cupUrlParams
}: Props) => {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [loggedScore, setLoggedScore] = useState(false)
  const [scoreMessage, setScoreMessage] = useState('')
  const [showPiGames, setShowPiGames] = useState(false)
  const [showAddvent, setShowAddvent] = useState(false)
  // const [showMidi, setShowMidi] = useState(false)
  // *** ACHIEVEMENTS ***
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false)
  const [achievementLargeImage, setAchievementLargeImage] = useState('')
  // *** ACHIEVEMENTS ***
  const [thisOpen, setThisOpen] = useState(isOpen)
  const [lastUnplayedDate, setLastUnplayedDate] = useState('')
  const [lastUnplayedText, setLastUnplayedText] = useState('')
  const [lastUnplayedStub, setLastUnplayedStub] = useState('')
  const [lastUnplayedBadge, setLastUnplayedBadge] = useState('')

  const gameMode = localStorage.getItem('gameMode') || ''
  const [LBLToken, setLBLToken] = useState(
    localStorage.getItem('lbl_token') || ''
  )

  const getHoursMinutesAndSecondsUntilMidnight = () => {
    var now = new Date()
    let timestamp = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )

    let midnight = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0
    )

    if (localStorage.getItem('useLocalTime') === 'true') {
      // get timestamp in local time
      timestamp = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      )

      //get seconds until midnight local tiume
      midnight = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
      )
    }

    const secondsUntilMidnight = (midnight - timestamp) / 1000
    const hours = Math.floor(secondsUntilMidnight / 3600)
    const minutes = Math.floor((secondsUntilMidnight % 3600) / 60)
    const seconds = Math.floor(secondsUntilMidnight % 60)
    return { hours, minutes, seconds }
  }

  const [gamesPlayed, setGamesPlayed] = useState('')
  const [gamesPlayedLast7Days, setGamesPlayedLast7Days] = useState([''])
  const [gamesPlayedEver, setGamesPlayedEver] = useState([''])
  const [randomGame, setRandomGame] = useState({ name: '', url: '', img: '', description: '' })

  // *** ACHIEVEMENTS ***
  const checkAchievements = (updateProfile = false, challengeAwards = "") => {

    const initialAchievements = localStorage.getItem('achievements') || '{"data": {"straightAwards": [], "nerdleVerseAwards": []}}'
    fetchAchievementData(updateProfile, challengeAwards).then((data) => {

      var foundAward = false

      // need to compare to see if there are any new achievements
      let initialStraightAwards = JSON.parse(initialAchievements).data.straightAwards
      let newStraightAwards = data.data.straightAwards

      // filter by gameMode to get any awards for this gameMode
      initialStraightAwards = initialStraightAwards.filter((a: any) => a.gameMode == (gameMode == '' ? 'classic' : gameMode))
      newStraightAwards = newStraightAwards.filter((a: any) => a.gameMode == (gameMode == '' ? 'classic' : gameMode))

      // for each item in each array we want a new array with only the 'award' parts so we can easily compare (without the changing pieces)
      const initialStraightAwardsString = JSON.stringify(initialStraightAwards.map((a: any) => {
        return {
          award: {
            name: a.award.name,
            minPoints: a.award.minPoints,
            smallImage: a.award.smallImage,
            smallImageGray: a.award.smallImageGray,
            smallBrokenImage: a.award.smallBrokenImage,
            largeImage: a.award.largeImage,
          }
        }
      }))
      const newStraightAwardsString = JSON.stringify(newStraightAwards.map((a: any) => {
        return {
          award: {
            name: a.award.name,
            minPoints: a.award.minPoints,
            smallImage: a.award.smallImage,
            smallImageGray: a.award.smallImageGray,
            smallBrokenImage: a.award.smallBrokenImage,
            largeImage: a.award.largeImage,
          }
        }
      }))

      // if newStraightAwards is larger than initialStraightAwards OR if there is only one but the award.smallImage is different, then we have a new straight award
      // if ((newStraightAwards.length > initialStraightAwards.length
      //   || (newStraightAwards.length === 1 && newStraightAwards[0].award.smallImage !== initialStraightAwards[0].award.smallImage )) 
      if ((initialStraightAwardsString != newStraightAwardsString)
        && !(newStraightAwards.length === 1 && newStraightAwards[0].award.smallImage.includes('gray'))
        && !newStraightAwards[0].award.broken
      ) {

        // we have a new straight award
        setAchievementLargeImage(newStraightAwards[0].award.largeImage)
        setIsAchievementModalOpen(true)
        foundAward = true

        // split largeImage by /
        const parts = newStraightAwards[0].award.largeImage.split('/')
        const badgeType = parts[4]
        const lastPart = parts[parts.length - 1]
        const badgeNumber = lastPart.split('.')[0]
        let badgeGameMode = ""
        if (badgeType === 'straights') {
          badgeGameMode = parts[6]
        }

        handleLogEvent(`nsa_${badgeType}_${badgeNumber}_${badgeGameMode}` + LBLToken == '' ? '_unreg' : '_reg')

        localStorage.setItem('achievements', JSON.stringify(data))
        localStorage.setItem('achievementsOld', JSON.stringify(data))
      }

      if (!foundAward) {
        let initialNerdleVerseAwards = JSON.parse(initialAchievements).data.nerdleVerseAwards
        let newNerdleVerseAwards = data.data.nerdleVerseAwards

        const initialNerdleVerseAwardsString = JSON.stringify(initialNerdleVerseAwards.map((a: any) => {
          return {
            award: {
              name: a.award.name,
              smallImage: a.award.smallImage,
              largeImage: a.award.largeImage,
            }
          }
        }))
        const newNerdleVerseAwardsString = JSON.stringify(newNerdleVerseAwards.map((a: any) => {
          return {
            award: {
              name: a.award.name,
              smallImage: a.award.smallImage,
              largeImage: a.award.largeImage,
            }
          }
        }))

        // if newNerdleVerseAwards is larger than initialNerdleVerseAwards OR if there is only one but the award.name is different, then we have a new nerdle verse award
        // if ((newNerdleVerseAwards.length > initialNerdleVerseAwards.length 
        //   || (newNerdleVerseAwards.length === 1 && newNerdleVerseAwards[0].award.name !== initialNerdleVerseAwards[0].award.name)) 
        if ((initialNerdleVerseAwardsString != newNerdleVerseAwardsString)
          && !(newNerdleVerseAwards.length === 1 && newNerdleVerseAwards[0].award.smallImage == "")) {

          // we have a new nerdle verse award
          setAchievementLargeImage(newNerdleVerseAwards[0].award.largeImage)
          setIsAchievementModalOpen(true)
          foundAward = true

          // split largeImage by /
          const parts = newNerdleVerseAwards[0].award.largeImage.split('/')
          const badgeType = parts[4]
          const lastPart = parts[parts.length - 1]
          const badgeNumber = lastPart.split('.')[0]
          let badgeGameMode = ""
          if (badgeType === 'straights') {
            badgeGameMode = parts[6]
          }

          handleLogEvent(`nna_${badgeType}_${badgeNumber}_${badgeGameMode}` + LBLToken == '' ? '_unreg' : '_reg')

          localStorage.setItem('achievements', JSON.stringify(data))
          localStorage.setItem('achievementsOld', JSON.stringify(data))
        }
      }

      handleAchievementsUpdate()

      // find last UNplayed date for this game
      if (data && data.data && data.data.straights) {
        const myStraight = data.data.straights.find((a: any) => a.gameMode == (gameMode == '' ? 'classic' : gameMode))
        if (myStraight) {
          const lastPlayed = myStraight.lastPlayed
          const unbrokenDays = myStraight.unbrokenDays
          //if lastPlayed is today then last UNplayed is lastPlayed - unbrokenDays + 1
          //else last UNplayed is lastPlayed + 1
          const lastPlayedDate = new Date(lastPlayed)
          const lastUnplayedDate = new Date(lastPlayed)
          if (lastPlayedDate.toDateString() === new Date().toDateString()) {
            lastUnplayedDate.setDate(lastUnplayedDate.getDate() - unbrokenDays)
          } else {
            lastUnplayedDate.setDate(lastUnplayedDate.getDate() + 1)
          }

          // if lastUnplayedDate is later or equal to 30 days ago:
          // then we don't show the lastUnplayedDate
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          if (lastUnplayedDate >= thirtyDaysAgo) {
            // format lastUnplayedDate to dd monthname yyyy without using options
            const day = lastUnplayedDate.getDate()
            const month = lastUnplayedDate.toLocaleString('default', { month: 'short' })
            const year = lastUnplayedDate.getFullYear()
            setLastUnplayedDate(day + ' ' + month + ' ' + year)
            setLastUnplayedText('Play missed game: ' + day + ' ' + month + ' ' + year)

            // is lastUnplayedDate today?
            const today = new Date()
            if (lastUnplayedDate.toDateString() === today.toDateString()) {
              setLastUnplayedStub('')
              setLastUnplayedText("Play today's game")
            } else {
              const monthNumber = lastUnplayedDate.getMonth() + 1
              const monthString = monthNumber < 10 ? '0' + monthNumber : monthNumber.toString()
              const dayString = day < 10 ? '0' + day : day.toString()
              setLastUnplayedStub(year + monthString + dayString)
            }

            // find current straightAward for this gameMode
            if (data.data.straightAwards) {
              const myStraightAward = data.data.straightAwards.find((a: any) => a.gameMode == (gameMode == '' ? 'classic' : gameMode))
              if (myStraightAward) {
                setLastUnplayedBadge(myStraightAward.award.smallImage)
              } else {
                setLastUnplayedBadge('https://www.nerdlegame.com/badges/straights/small/7_x.png')
              }
            } else {
              // if no straightawards yet then show the question mark one .. 
              setLastUnplayedBadge('https://www.nerdlegame.com/badges/straights/small/7_gray.png')
            }
          }

        }
      }


    })
  }
  // *** ACHIEVEMENTS ***

  useEffect(() => {
    if (isOpen) {
      setInterval(() => {
        const { hours, minutes, seconds } =
          getHoursMinutesAndSecondsUntilMidnight()
        setHours(hours)
        setMinutes(minutes)
        setSeconds(seconds)
      }, 1000)

      if (/*isMobile &&*/ window.lngtd) {
        try {
          window.lngtd.resetAndRunAuction()
        } catch (e) {
          console.log(e)
        }
      }

      const gamesPlayedToday = setGamesPlayedToday(gameMode)
      let gamesPlayedLast7Days = getGamesPlayedInLast7Days()
      let gamesPlayedEver = getGamesPlayedEver()
      // remove current game from gamesPlayedLast7Days
      // gamesPlayedLast7Days = gamesPlayedLast7Days.filter((g) => g !== (gameMode == '' ? 'classic' : gameMode))

      setGamesPlayed(gamesPlayedToday)
      setGamesPlayedLast7Days(gamesPlayedLast7Days)
      setGamesPlayedEver(gamesPlayedEver)

      // create a list of games that do not include current game, games played in last 7 days or any played today
      const gamesNotPlayed = games.filter(
        (g) =>
          g.gameMode !== gameMode &&
          !gamesPlayedToday.includes(g.name) &&
          !gamesPlayedEver.includes(g.name)
      )
      // get a random one from the list
      const randomGame = gamesNotPlayed[Math.floor(Math.random() * gamesNotPlayed.length)]
      setRandomGame(randomGame)

      const myLBLToken = localStorage.getItem('lbl_token') || ''
      setLBLToken(myLBLToken)

      //if we have a token, log the score
      if (myLBLToken !== '' && gameMode !== 'pro' /*&& gameMode !== 'midi'*/) {
        const scoreText = shareText(
          false,
          guesses,
          solution,
          solutionIndex,
          timerString,
          hasClueRow,
          clueGameIndex,
          numRows
        )
        let createScoreUrl = 'https://api.leaderboardle.com/user/score/create'
        // if (window.location.hostname.includes('localhost')) {
        //   createScoreUrl = 'http://localhost:3001/prod/user/score/create'
        // }

        //api is text/plain
        fetch(createScoreUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${myLBLToken}` },
          body: scoreText,
        }).then((res) => {
          if (res.status === 201) {
            // success
            setLoggedScore(true)
            setScoreMessage('')

            console.log({ res })

            // *** ACHIEVEMENTS ***
            if (enabledGameModes.includes(gameMode)) {

              let challengeAwards = localStorage.getItem('challengeAwards') || ''
              // base 64 encode it
              if (challengeAwards != '') {
                challengeAwards = btoa(challengeAwards)
              }

              checkAchievements(true, challengeAwards);
            }
            // *** ACHIEVEMENTS ***

            console.log('trigger refresh stats ... ')
            handleRefreshStats()

          } else {
            // error - find out what it was and report back to user
            res.json().then((json) => {
              console.log(json) // don't really need this  now as we're no longer reporting the back end message but useful to log
              if (json.error && json.error != 'Invalid game date') {
                var msg =
                  'There was an error logging your score. Please try again later.'
                //if status code is 400 to 499 it's an unauthorized error
                if (res.status >= 400 && res.status < 500) {
                  localStorage.removeItem('lbl_token')
                  localStorage.removeItem('userEmail')
                  setLBLToken('')
                  msg =
                    'Your Nerdle account session has expired. Please log in again.'
                }

                setScoreMessage(msg)
                setLoggedScore(false)
                alert(msg)
              }

            })
          }
        })
      } else {
        // *** ACHIEVEMENTS ***
        checkAchievements();
      }

      // fetch('https://df4mnpdg14eyg.cloudfront.net/test.html').then(
      //   (response) => {
      //     console.log(response)
      //     if (response.status === 200) {
      //       console.log('in usa')
      //       setShowMidi(true)
      //     } else {
      //       console.log('not in usa')
      //       setShowMidi(false)
      //     }
      //   }
      // )


    }
  }, [isOpen])

  const moreGamesClasses = classnames('text-center cursor-pointer col-span-3', {
    //'col-span-3': gameMode === 'pro',
    //'col-span-4': gameMode !== 'pro',
  })

  useEffect(() => {
    const date = new Date()

    // set showBanner to true if LOCAL date is 14th March 2023
    // const showPiGames =
    //   date.getFullYear() === 2023 &&
    //   date.getMonth() === 2 &&
    //   date.getDate() == 14 &&
    //   gameMode !== 'pro'

    // setShowPiGames(showPiGames)

    // if date is less than 26th December 2023 set showAddvent to true
    // get timestamp in local time
    const timestamp = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
    if (timestamp < 1703548800000) {
      setShowAddvent(true)
    }


  }, [solutionIndex, setShowPiGames, gameMode, setShowAddvent])

  var gpQ = '?gp=' + gamesPlayed

  // get sessionTime from local storage and add to gpQ
  gpQ += '&st=' + window.sessionTime

  //sort games moving any in gamesPlayed to the end
  const sortedGames = games
  // .filter((g) => g.gameMode !== gameMode)
  // .sort((a, b) => {
  //   if (gamesPlayed.includes(a.name)) {
  //     return 1
  //   } else if (gamesPlayed.includes(b.name)) {
  //     return -1
  //   } else {
  //     return 0
  //   }
  // })

  //NERDLE CUP
  var isCupGame = false
  if (isOpen && Object.keys(cupUrlParams).length > 0) {
    console.log("cup game won")
    isCupGame = true
    var gameCode = cupUrlParams['code'] || ''
    var nam = cupUrlParams['nam'] || ''
    var gmr = cupUrlParams['gmr'] || ''

    var score = Math.ceil(Math.max(0, 6 - parseInt(localStorage.getItem('revealsTaken') || '0') - parseInt(localStorage.getItem('checksTaken') || '0')))
    if (localStorage.getItem('gameType') == 'targets') { score = parseInt(localStorage.getItem('targetsStars') || '0') }
    if (localStorage.getItem('gameType') == 'shuffle') { score = 6 - Math.min(6, Math.max(Number(localStorage.getItem('movesTaken_' + gameMode)) - 6, 0) / 2) }


    var fetchURL = "https://nerdle-cup.herokuapp.com/addscore/?code=" + gameCode + "&name=" + nam + "&score=" + Math.round(score) + "&gamenum=" + gmr;
    console.log(fetchURL)
    fetch(fetchURL).then(function (response) {
      return response.text();
    }).then(function (status) {
      console.log('score saved to nerdle cup')
      status = status.replace(/^\s+|\s+$/g, '').replace(/['"]+/g, '');
      localStorage.setItem('status1', status);
      if (status != "true") {
        console.log("Score add error" + status);
        setTimeout(() => {
          window.location.href = 'https://cup.nerdlegame.com/cup/getnextgame'
        }, 5000)

      } else {
        setTimeout(() => {
          window.location.href = 'https://cup.nerdlegame.com/cup/getnextgame'
        }, 5000)
      }
    })
  }


  return (
    <>
      <Transition.Root show={isOpen || thisOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => {
            handleClose()
            setThisOpen(false)
          }}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-24 text-center sm:block sm:p-0" id="winModalNew">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div className="absolute right-4 top-4  dark:text-[#D7DADC]">
                  <XCircleIcon
                    aria-label="Close"
                    aria-hidden={false}
                    role="navigation"
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      handleClose()
                      setThisOpen(false)
                    }}
                  />
                </div>
                <div>


                  <div className="absolute top-0 left-0">
                    <img src="/numbot_winner.png" className="h-[120px]" />
                  </div>

                  <div className="h-12" />

                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC]"
                    >
                      {timerString === ''
                        ? 'You won!'
                        : 'You won in ' + timerString}
                    </Dialog.Title>

                    {isCupGame && (
                      <div className="justify-center mb-1">
                        <br></br>
                        <p className="ml-auto mr-auto dark:text-white justify-center" text-align="center" align-items="center" style={{ textAlign: 'center', }}>
                          <img src="https://cup.nerdlegame.com/cup/assets/images/nerdle-cup-icon.png" style={{ width: '50px', margin: 'auto' }}></img>
                        </p>
                        <p style={{ textAlign: 'center' }}><b>nerdle cup game</b></p>
                        <br></br>
                        <p style={{ textAlign: 'center' }}>loading,<br />please wait....</p>
                        <br></br>

                      </div>
                    )}


                    <div id="winSection" className={"relative w-full " + (isCupGame ? 'invisible' : '')}>

                      {!showPiGames && (
                        <div className="relative pb-0 mx-auto text-center justify-center items-center text-center  dark:text-[#D7DADC]">
                          <div id="nerdlegame_D_2"></div>
                          <div id="nerdlegame_M_2"></div>
                        </div>
                      )}

                      <div className="mt-4">
                        {commutMsg && (
                          <p className="text-sm text-gray-500 dark:text-[#D7DADC] mb-4">
                            Answer accepted as commutative (a+b=b+a){' '}
                            <a
                              href="https://faqs.nerdlegame.com/?faq=14"
                              target="_new"
                              className="focus:outline-none"
                            >
                              <QuestionMarkCircleIcon className="h-6 w-6 cursor-pointer inline" />
                            </a>
                            <br />
                            To disallow see{' '}
                            <span
                              onClick={() => {
                                handleSettings()
                              }}
                              className="underline font-bold focus:outline-none  cursor-pointer"
                            >
                              settings
                            </span>
                            .
                          </p>
                        )}

                        <div className="flex justify-center w-full">
                          <MiniGrid guesses={guesses} solution={solution} className="pb-2"
                            cellClasses={solution.length > 8 ? "w-3a h-3a mx-0" : "w-4 h-4 mx-0"}
                          />

                          <button
                            type="button"
                            className="mb-3 ml-2 inline-flex justify-center rounded-md border border-transparent shadow-sm 
                                      px-1 py-2 bg-indigo-600 text-base font-medium 
                                      text-white hover:bg-indigo-700 focus:outline-none 
                                      focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text -sm"
                            onClick={() => {
                              shareStatus(
                                guesses,
                                solutionIndex,
                                solution,
                                timerString,
                                hasClueRow,
                                clueGameIndex
                              )
                              handleShare()
                              handleLogEvent('winmodal_share_win')

                              window._conv_q = window._conv_q || [];
                              _conv_q.push(["triggerConversion", "100482506"]);

                            }}
                          >
                            {gameMode === 'pro' ? 'Share result' :
                              <div className={(guesses.length > 3 ? "flex-row px-3" : "flex") + " items-center justify-center mt-auto mb-auto  "}>

                                <ShareIcon className="h-4 w-4 cursor-pointer inline mx-0" />
                                <div className={(guesses.length > 3 ? "" : "ml-1") + " mt-0 text-sm"}>Share</div>
                              </div>
                            }
                          </button>

                        </div>
                        <p className="text-sm text-gray-500 dark:text-[#D7DADC]">
                          Great job. Next{gameMode === 'pro' ? ' daily ' : ' '}
                          puzzle in {hours}h {minutes}m {seconds}s
                        </p>

                        {gameMode === 'pro' && (
                          <p className="text-sm text-gray-500 dark:text-[#D7DADC]">
                            <a
                              href={'https://nerdlegame.com/' + gpQ}
                              className="underline font-bold focus:outline-none"
                            >
                              Play daily game
                            </a>
                          </p>
                        )}
                      </div>


                      {gameMode !== 'pro' && LBLToken === '' && (
                        <div className="mt-2 sm:mt-2 text-center">
                          

                          <button
                            type="button"
                            className="mt-4w-full max-w-[320px] inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            onClick={() => {
                              // shareStatus(guesses, solutionIndex, solution, timerString)
                              window._conv_q = window._conv_q || [];
                              _conv_q.push(["triggerConversion", "100482507"]);

                              const scorePayload = shareText(
                                false,
                                guesses,
                                solution,
                                solutionIndex,
                                timerString,
                                hasClueRow,
                                clueGameIndex
                              )
                              handleLBLLogin(scorePayload, 2)
                            }}
                          >
                            <div className="text-center">
                              Log in / Sign up to sync your stats
                            </div>
                          </button>

                     
                        </div>
                      )}

                      {LBLToken !== '' && gameMode !== 'pro' && gameMode !== 'midi' && (
                        <div className={"mt-2 sm:mt-2 " + (isCupGame ? 'invisible' : '')}>
                          <p className="text-sm text-gray-500 dark:text-[#D7DADC] text-center">
                            {loggedScore && (
                              <>
                                Your score was submitted to
                                <br />
                                your nerdle account automatically.{' '}
                              </>
                            )}
                            {!loggedScore && scoreMessage !== '' && (
                              <>
                                Nerdle account said: {scoreMessage}
                                {'. '}
                              </>
                            )}
                            <span
                              onClick={() => {
                                console.log('logging out removing lbl_token')
                                localStorage.removeItem('lbl_token')
                                localStorage.removeItem('userEmail')
                                setLBLToken('')
                                // post message to app
                                if (
                                  (window as any).webkit &&
                                  (window as any).webkit.messageHandlers &&
                                  (window as any).webkit.messageHandlers.lblLogin
                                ) {
                                  ; (
                                    window as any
                                  ).webkit.messageHandlers.lblLogin.postMessage({
                                    message: '',
                                  })
                                }

                                const data = {
                                  lblToken: '',
                                  target:
                                    window.location.protocol +
                                    '//' +
                                    window.location.host,
                                }
                                // base 64 data
                                const b64 = btoa(JSON.stringify(data))
                                window.location.href =
                                  window.location.hostname.includes('localhost')
                                    ? 'http://localhost:3000/storeLbl.html?set=' + b64
                                    : (window.location.hostname.includes('dev.')
                                      ? 'https://dev.'
                                      : 'https://') +
                                    'nerdlegame.com/storeLbl.html?set=' +
                                    b64
                              }}
                              className="underline font-bold focus:outline-none  cursor-pointer"
                            >
                              Log out
                            </span>
                          </p>
                        </div>
                      )}

                      {isMobile && gameMode === 'pro' && (
                        <div className={"mt-2 sm:mt-4  text-center " + (isCupGame ? 'invisible' : '')}>
                          <button
                            type="button"
                            //className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            className="inline-flex justify-center w-full max-w-[320px] rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                            onClick={() => {
                              const shareUrl =
                                clueGameIndex !== ''
                                  ? 'https://clue.nerdlegame.com/clue/' + clueGameIndex
                                  : document.location.href
                              try {
                                navigator.clipboard.writeText(shareUrl).then(() => {
                                  if (navigator.share) {
                                    navigator
                                      .share({
                                        text:
                                          clueGameIndex == ''
                                            ? 'Try this custom Nerdle game: '
                                            : '',
                                        url: shareUrl,
                                      })
                                      .then(() => {
                                        console.log('Successfully shared')
                                      })
                                      .catch((error) => {
                                        console.error(
                                          'Something went wrong sharing the score',
                                          error
                                        )
                                      })
                                  } else {
                                    if (
                                      window.navigator.userAgent.includes('Nerdle/1.0')
                                      || window.isMobileApp
                                    ) {
                                      //send message to native app
                                      postToFlutter('share:' + shareUrl)
                                    }
                                  }
                                })
                              } catch (err) {
                                console.error('Failed to write to clipboard')
                              }

                              handleShare()
                              handleLogEvent('winmodal_share_link')
                            }}
                          >
                            Share game link
                          </button>
                        </div>
                      )}

                      {showPiGames && (
                        <div
                          className="dark:text-[#D7DADC] mt-2 text-center"
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            textAlign: 'center',
                          }}
                        >
                          <span className="text-center w-[100%] font-bold focus:outline-none text-xl">
                            Pi day (3.14) special games
                          </span>
                          <div
                            className="text-center cursor-pointer w-[50%] mt-2"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                          >
                            <a
                              href="https://wafflegame.net/nerdle"
                              onClick={() => {
                                handleLogEvent('click_winmodal_waffle_nerdle_piday')
                              }}
                            >
                              <img
                                src="/pi-waffle.png"
                                className="h-[40px] mx-auto"
                                alt="pi waffle"
                              />
                              nerdle-inspired
                              <br />
                              WAFFLE
                            </a>
                          </div>

                          <div
                            className="text-center cursor-pointer w-[50%] mt-2"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                          >
                            <a
                              href="https://www.nerdlegame.com/piday.html"
                              onClick={() => {
                                handleLogEvent('click_winmodal_nerdle_piday')
                              }}
                            >
                              <img
                                src="/pi-nerdle.png"
                                className="h-[40px] mx-auto"
                                alt="pi nerdle"
                              />
                              π-nerdle
                              <br />
                              games
                            </a>
                          </div>
                        </div>
                      )}

                      <div id="moreGamesSection" className={isCupGame ? 'invisible' : ''}>

                        <p className={"pt-2 cursor-pointer text-center dark:text-[#D7DADC] " + (lastUnplayedDate == "" ? "mt-2" : "")}>
                          <a
                            href={'https://www.nerdlegame.com' + gpQ}
                            className="font-bold focus:outline-none text-xl"
                          /* style={{ fontFamily: "'Quicksand', sans-serif" }}*/
                          >
                            {gamesPlayedEver.length > 6 ? "Next up ..." : "More games"}
                          </a>
                        </p>


                        {showAddvent && (
                          <a href="https://www.nerdlegame.com/advent/index.html" target="_new">
                            <div
                              className="dark:text-[#D7DADC] mt-2 underline cursor-pointer text-red-500 flex items-center justify-center"
                            >
                              <span>
                                <img
                                  src="https://www.nerdlegame.com/advent/assets/images/addvent%20logo.png"
                                  className="mr-2"
                                  alt="Add-vent"
                                  aria-label="Add-vent"
                                  style={{
                                    height: 34,
                                  }}
                                />
                              </span>
                              Chris-math Add-vent puzzles!
                            </div>
                          </a>
                        )}

                        {gamesPlayedEver.length > 6 && (
                          <div
                            //className="grid grid-cols-12 gap-1 dark:text-[#D7DADC]
                            className="dark:text-[#D7DADC] mt-2"
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                            }}
                          >
                            {sortedGames.map((game, index) => {
                              // var includeGame = game.gameMode !== gameMode
                              var includeGame = true
                              if (game.startDate) {
                                const startDate = new Date(game.startDate)
                                const today = new Date()
                                if (startDate > today) {
                                  includeGame = false
                                }
                              }

                              //if (game.name == 'shuffleABC') { includeGame=false; }
                              if (game.excludeFromWinModal) {
                                includeGame = false
                              }

                              let gamesPlayedArray = gamesPlayed.split(',')
                              let gamePlayedToday =
                                gamesPlayedArray.includes(game.name) ||
                                gamesPlayedArray.includes(game.gameMode)

                              if (game.lastPlayedStartsWith) {
                                gamePlayedToday = gamesPlayedArray.some((b) => b.startsWith(game.gameMode))
                              }

                              // includeGame = gamesPlayedLast7Days.includes(game.name) && includeGame && !gamePlayedToday
                              includeGame = gamesPlayedEver.includes(game.name) && includeGame

                              if (includeGame) {
                                //is game in gamesPlayed list?
                                //let gamePlayedToday = gamesPlayed.includes(game.name)
                                let gamesPlayedArray = gamesPlayed.split(',')
                                let gamePlayedToday =
                                  gamesPlayedArray.includes(game.name) ||
                                  gamesPlayedArray.includes(game.gameMode)

                                if (game.lastPlayedStartsWith) {
                                  gamePlayedToday = gamesPlayedArray.some((b) => b.startsWith(game.gameMode))
                                }

                                return (
                                  <div
                                    className="text-center cursor-pointer w-[25%]"
                                    onClick={() => {

                                      window._conv_q = window._conv_q || [];
                                      _conv_q.push(["triggerConversion", "100482505"]);

                                      window.location.href = game.url + gpQ
                                    }}
                                    style={{ position: 'relative' }}
                                  >
                                    <img
                                      src={game.img}
                                      className="h-[36px] mx-auto"
                                      alt={game.name + ' nerdle'}
                                    />
                                    <span
                                      className="text-[#398874] dark:text-[#D7DADC] text-sm"
                                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    >
                                      {game.name}
                                    </span>

                                    {gamePlayedToday && (
                                      <div
                                        style={{ position: 'absolute', top: 0, right: 5 }}
                                      >
                                        <div className="mx-auto flex items-center justify-center h-6 w-6 rounded-full bg-green-100  dark:bg-[#398874]">
                                          <CheckIcon
                                            className="h-6 w-6 text-green-600 dark:text-green-100"
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              }
                            })}
                          </div>
                        )}

                        {gamesPlayedEver.length > 6 && (
                          <p className={"pt-2 cursor-pointer text-center dark:text-[#D7DADC] " + (lastUnplayedDate == "" ? "mt-2" : "")}>
                            <a
                              href={'https://www.nerdlegame.com' + gpQ}
                              className="font-bold focus:outline-none text-xl"
                            /* style={{ fontFamily: "'Quicksand', sans-serif" }}*/
                            >
                              Or try a new game
                            </a>
                          </p>
                        )}

                        {gamesPlayedEver.length > 6 && (

                          <div className="flex cursor-pointer justify-center mt-2 text-left"
                            onClick={() => {
                              window._conv_q = window._conv_q || [];
                              _conv_q.push(["triggerConversion", "100486849"]);
                              window.location.href = randomGame.url + gpQ
                            }}>

                            <div
                              className="text-center cursor-pointer w-[25%]"
                              style={{ position: 'relative' }}
                            >
                              <img
                                src={randomGame.img}
                                className="h-[36px] mx-auto"
                                alt={randomGame.name + ' nerdle'}
                              />
                              <span
                                className="text-[#398874] dark:text-[#D7DADC] text-sm"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                              >
                                {randomGame.name}
                              </span>
                            </div>
                            <div className="ml-2 text-sm" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                              {randomGame.description}
                            </div>
                          </div>
                        )}



                        {gamesPlayedEver.length < 7 && (
                          <div
                            //className="grid grid-cols-12 gap-1 dark:text-[#D7DADC]
                            className="dark:text-[#D7DADC] mt-2"
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                            }}
                          >
                            {sortedGames.map((game, index) => {
                              var includeGame = game.gameMode !== gameMode
                              if (game.startDate) {
                                const startDate = new Date(game.startDate)
                                const today = new Date()
                                if (startDate > today) {
                                  includeGame = false
                                }
                              }

                              //if (game.name == 'shuffleABC') { includeGame=false; }
                              if (game.excludeFromWinModal) {
                                includeGame = false
                              }




                              if (includeGame) {
                                //is game in gamesPlayed list?
                                //let gamePlayedToday = gamesPlayed.includes(game.name)
                                let gamesPlayedArray = gamesPlayed.split(',')
                                let gamePlayedToday =
                                  gamesPlayedArray.includes(game.name) ||
                                  gamesPlayedArray.includes(game.gameMode)

                                if (game.lastPlayedStartsWith) {
                                  gamePlayedToday = gamesPlayedArray.some((b) => b.startsWith(game.gameMode))
                                }

                                return (
                                  <div
                                    className="text-center cursor-pointer w-[25%]"
                                    onClick={() => {
                                      //const var0Clicked = localStorage.getItem('exp1var0Clicked')
                                      // if (!var0Clicked) {
                                      //   localStorage.setItem('exp1var0Clicked', 'true')

                                      //   // get lastPlayed storage key
                                      //   const lastPlayed = localStorage.getItem('lastPlayed')
                                      //   const lastPlayedObject = lastPlayed ? JSON.parse(lastPlayed) : {}
                                      //   console.log(lastPlayedObject)
                                      //   const lastPlayedCount = Object.keys(lastPlayedObject).length
                                      //   console.log({lastPlayedCount})
                                      //   if (lastPlayedCount == 1) {
                                      //     // what game was it?
                                      //     const lastPlayedGame = Object.keys(lastPlayedObject)[0]
                                      //     handleLogEvent('exp1_var0_clicked_' + lastPlayedGame)
                                      //   } else {
                                      //     // not just classic
                                      //     handleLogEvent('exp1_var0_clicked_MG')
                                      //   }

                                      //   handleLogEvent('exp1_var0_clicked')
                                      // }

                                      window._conv_q = window._conv_q || [];
                                      _conv_q.push(["triggerConversion", "100482505"]);

                                      window.location.href = game.url + gpQ
                                    }}
                                    style={{ position: 'relative' }}
                                  >
                                    <img
                                      src={game.img}
                                      className="h-[36px] mx-auto"
                                      alt={game.name + ' nerdle'}
                                    />
                                    <span
                                      className="text-[#398874] dark:text-[#D7DADC] text-sm"
                                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    >
                                      {game.name}
                                    </span>

                                    {gamePlayedToday && (
                                      <div
                                        style={{ position: 'absolute', top: 0, right: 5 }}
                                      >
                                        <div className="mx-auto flex items-center justify-center h-6 w-6 rounded-full bg-green-100  dark:bg-[#398874]">
                                          <CheckIcon
                                            className="h-6 w-6 text-green-600 dark:text-green-100"
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              }
                            })}
                          </div>
                        )}

                        {lastUnplayedDate !== '' && (
                          <div className="pt-2 mt-2 cursor-pointer text-center dark:text-[#D7DADC]">
                            <a href={"/" + lastUnplayedStub} onClick={() => {
                              window._conv_q = window._conv_q || [];
                              _conv_q.push(["triggerConversion", "100482508"]);
                              handleLogEvent('click_last_missed_game')
                            }}>
                              <span className="inline-flex font-bold focus:outline-none text-m underline">
                                <img src={lastUnplayedBadge} className="h-8" alt="last unplayed badge" />
                                {lastUnplayedText}
                              </span>
                            </a>
                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <AchievementModal
        isOpen={isAchievementModalOpen}
        handleClose={() => {
          setIsAchievementModalOpen(false)
          setThisOpen(true)
        }}
        handleStats={() => { if (handleStatsOpen) handleStatsOpen(); setIsAchievementModalOpen(false) }}
        handleLogEvent={(text) => {
          handleLogEvent(text)
        }}
        largeImage={achievementLargeImage}
      />

    </>
  )
}
