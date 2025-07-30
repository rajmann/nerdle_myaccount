import { Fragment, useState, useEffect, Key, SetStateAction } from 'react'
//import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import {
  //loadStatsStateFromLocalStorage,
  StoredStatsState,
} from '../../lib/storage'
import { secondsToHms } from '../../lib/timer'
import {
  getGameDiary,
  getLeagues,
  getLeague,
  createLeague,
  joinLeague,
  getProfile,
  deleteLeague,
  fetchAchievementData,
} from '../../lib/cloudStats'
import { CheckIcon, XIcon } from '@heroicons/react/outline'
import {
  isNewMobileApp,
  postToFlutter,
  platform as myPlatform,
} from '../../lib/isPWA'

import { ReactComponent as GoldCrownIcon } from '../../assets/icons/gold-crown.svg'
import { ReactComponent as SilverCrownIcon } from '../../assets/icons/silver-crown.svg'
import { ReactComponent as BronzeCrownIcon } from '../../assets/icons/bronze-crown.svg'

import OrbitProgress from 'react-loading-indicators/dist/OrbitProgress'

import { SmallBadge } from '../badges/SmallBadge'
import { AchievementModal } from './AchievementModal'
import { enabledGameModes as enabledBadgeGameModes } from '../badges/EnabledGames'
import { BadgesTab } from '../badges/BadgesTab'
// const enabledBadgeGameModes = ['', 'mini']

declare var window: any

type Props = {
  isOpen: boolean
  handleClose: () => void
  stats: StoredStatsState
  deviceStats: StoredStatsState
  handleLBLLogin: (method: number) => void
  handleShare: () => void
  logEvent: (event: string) => void
  initialTab?: string
}

type GameDiaryItem = {
  label: string
  played: number
  won: number
  points: number
  replayDate: string
}

export const StatsModal = ({
  isOpen,
  handleClose,
  stats,
  deviceStats,
  handleLBLLogin,
  handleShare,
  logEvent,
  initialTab = 'stats',
}: Props) => {
  const [gameDiary, setGameDiary] = useState({})
  const [gameDiaryData, setGameDiaryData] = useState<GameDiaryItem[]>([])
  const [hasLBLToken, setHasLBLToken] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [groupName, setGroupName] = useState('')
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [createGroupStatus, setCreateGroupStatus] = useState('')
  const [profileId, setProfileId] = useState('')
  const [leagueAdmin, setLeagueAdmin] = useState(false)
  const [selectedGroupName, setSelectedGroupName] = useState('')

  // *** ACHIEVEMENTS ***
  const [achievements, setAchievements] = useState({ data: { straights: [{ gameMode: '', lastPlayed: 0 }], straightAwards: [], nerdleVerseAwards: [], challengeAwards: [], offline: false } })
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false)
  const [achievementLargeImage, setAchievementLargeImage] = useState('')
  // *** ACHIEVEMENTS ***

  const [thisOpen, setThisOpen] = useState(isOpen)

  const gamesPlayed = stats.gamesPlayed
  const gamesWon = stats.gamesWon
  const winRows = stats.winRows
  const currentStreak = stats.currentStreak || 0
  const maxStreak = stats.maxStreak || 0
  const averageGuessTime = stats.averageGuessTime || 0

  // sum of all winRows
  const totalPoints = winRows.reduce((a, b) => a + b, 0)
  // sum of all winRows 0 to 2
  const totalPoints3 = winRows.slice(0, 3).reduce((a, b) => a + b, 0)
  // percentage of totalPoints3 of totalPoints
  const totalPoints3Percentage =
    totalPoints3 > 0 ? Math.round((totalPoints3 / totalPoints) * 100) : 0

  const gameMode = localStorage.getItem('gameMode')
  const [currentTab, setCurrentTab] = useState(
    enabledBadgeGameModes.includes(gameMode || '') ? 'badges' : 'stats'
  )
  const [showUpgradeInfoLink, setShowUpgradeInfoLink] = useState(false)
  const [leagueList, setLeagueList] = useState(
    localStorage.getItem('leagueList')
      ? JSON.parse(localStorage.getItem('leagueList') || '[]')
      : []
  )
  const [leagueId, setLeagueId] = useState(
    localStorage.getItem('leagueId') || ''
  )
  const [members, setMembers] = useState([
    { memberId: 0, details: { fullname: '' }, total: 0 },
  ])
  const [inviteCode, setInviteCode] = useState(
    localStorage.getItem('inviteCode') || ''
  )
  const [groupMode, setGroupMode] = useState('view')

  const [joinInviteCode, setJoinInviteCode] = useState('')

  const wonPercentage =
    gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) + '%' : 0

  const handleReset = () => {
    let clearStats = window.confirm(
      'Are you sure you want to reset your stats?'
    )
    if (clearStats === true) {
      localStorage.removeItem('statsState')
      alert('Game stats have been reset')
      handleClose()
    }
  }

  const handleInfo = () => {
    const gameMode = localStorage.getItem('gameMode')
    if (gameMode === 'mini') {
      alert(
        'Starting March 2nd 2022 mini nerdle has separate stats so your stats may appear to have reset.'
      )
    } else {
      alert(
        'Game streaks were added March 1st 2022 and start counting from then.'
      )
    }
  }

  useEffect(() => {
    if (isOpen) {

      // if window path contains /stats/stats then set currentTab to whatever is after the last /
      if (window.location.pathname.includes('/stats/')) {
        const pathArray = window.location.pathname.split('/')
        setCurrentTab(pathArray[pathArray.length - 1])
      } else {
        setCurrentTab(initialTab)
      }

      getGameDiary((gameDiary, authorised) => {
        if (gameDiary.data) {
          setGameDiary(gameDiary as any)

          const titleMaps = [
            'tomorrow',
            'today',
            'yesterday',
            'lastThirdDay',
            'lastFourthDay',
            'lastFifthDay',
            'lastSixthDay',
            'lastSeventhDay',
          ]

          var data = []

          for (var i = 0; i < 8; i++) {
            // what is the key name for item
            var title = Object.keys(gameDiary.data)[i]
            var newTitle = title.charAt(0).toUpperCase() + title.slice(1)

            if (title.startsWith('last')) {
              // find the index of this title in the titleMaps array
              var index = titleMaps.indexOf(title)

              // work out its date
              var date = new Date()

              date.setDate(date.getDate() - index + 1)

              // set the new title in the format "26 June"
              const day = date.toLocaleDateString('en-GB', { day: 'numeric' })
              const month = date.toLocaleDateString('en-GB', { month: 'short' })
              newTitle = day + ' ' + month
            }

            //push to array
            data.push({
              label: newTitle,
              played: gameDiary.data[title].played,
              won: gameDiary.data[title].won,
              points: gameDiary.data[title].points,
              replayDate: gameDiary.data[title].date
                .slice(0, 10)
                .replace(/-/g, ''),
            })
          }

          setGameDiaryData(data)
        } else {
          if (authorised === false) {
            setGameDiaryData([])
            setHasLBLToken(false)
          }
        }
      })

      getLeagues((leagues) => {
        //console.log('leagues', leagues)
        if (leagues.data) {
          // create an array of league titles. For each item in leagues.data there is an object called 'details'. In that object there is a key called 'title'
          //const leagueTitles = leagues.data.map((e: { details: { title: any } }) => e.details.title)
          setLeagueList(leagues.data)
          localStorage.setItem('leagueList', JSON.stringify(leagues.data))

          // if there is only one league, set the leagueId to it
          if (leagues.data.length == 1) {
            setLeagueId(leagues.data[0].ID)
          }
        }
      })

      getProfile((profile) => {
        if (profile) {
          if (profile.id) {
            setProfileId(profile.id)
          }
        }
      })

      const token = localStorage.getItem('lbl_token')
      if (token) {
        setHasLBLToken(true)
      } else {
        setHasLBLToken(false)
      }

      setUserEmail(localStorage.getItem('userEmail') || '')

      if (
        isNewMobileApp() &&
        myPlatform() == 'android' &&
        stats.gamesPlayed < 8
      ) {
        setShowUpgradeInfoLink(true)
      }

      // *** ACHIEVEMENTS ***
      // get achievements
      fetchAchievementData().then((data) => {

        if (data) {
          // sort data.straightAwards by gameName but then move the one with gameMode matching current gameMode to top
          data.data.straightAwards.sort((a: { gameName: string }, b: { gameName: string }) => {
            if (a.gameName < b.gameName) {
              return -1
            }
            if (a.gameName > b.gameName) {
              return 1
            }
            return 0
          })

          // find index of current gameMode
          const index = data.data.straightAwards.findIndex(
            (e: { gameMode: string }) => e.gameMode == (gameMode === '' ? 'classic' : gameMode)
          )

          // if we found it, move it to top
          if (index > 0) {
            const item = data.data.straightAwards[index]
            data.data.straightAwards.splice(index, 1)
            data.data.straightAwards.unshift(item)
          }
        }

        setAchievements(data)
      })
      // *** ACHIEVEMENTS ***


    }
  }, [isOpen])

  useEffect(() => {
    if (leagueId === '') return

    getLeague(leagueId, gameMode || '', (league) => {
      if (league && league.data) {
        setSelectedGroupName(league.data.details.title)
        setMembers(league.data.members)
        //setLeagueId(leagueId);
        setInviteCode(league.data.invitationCode)
        localStorage.setItem('inviteCode', league.data.invitationCode)
        localStorage.setItem('leagueId', leagueId)

        // see if I am league admin
        const user = league.data.members?.find(
          (member: { memberId: string }) => member.memberId === profileId
        )

        if (user && user.details) {
          setLeagueAdmin(user.details.makeAdmin)
        }
      }
    })
  }, [leagueId, isOpen])

  const doRestoreStats = () => {
    // get devcieStats from local storage
    const deviceStatsString = localStorage.getItem('deviceStatsState') || ''
    // get number of games in deviceStats
    const deviceStats = JSON.parse(deviceStatsString)
    const deviceGamesPlayed = deviceStats.gamesPlayed
    // get regular stats from local storage
    const statsString = localStorage.getItem('statsState') || ''
    const stats = JSON.parse(statsString)
    const gamesPlayed = stats.gamesPlayed

    // ask user if they want to restore, showing how many games are in deviceStats
    const restoreStats = window.confirm(
      gamesPlayed > deviceGamesPlayed
        ? `Are you sure you want to restore your stats? You only have ${deviceGamesPlayed} games in your backup which is fewer than your current stats. Your current stats will be overwritten if you continue.`
        : `Are you sure you want to restore your stats? You have ${deviceGamesPlayed} games in your backup. Your current stats will be overwritten if you continue.`
    )
    if (restoreStats === true) {
      //n replace statesState with deviceStatsState
      localStorage.setItem('statsState', deviceStatsString)
      // refresh page
      window.location.reload()
    }
  }

  const createGroup = () => {
    setCreatingGroup(true)
    setCreateGroupStatus('Creating league...')
    const payload = {
      title: groupName,
      games: [
        'nerdlegame',
        'mini nerdlegame',
        'binerdle',
        'mini binerdle',
        'instant nerdle',
        'speed nerdlegame',
        'micro nerdle',
        'maxi nerdlegame',
        'quad nerdle',
      ],
      scoringSystem: 'All 7 days/week', // scoring,
    }
    createLeague(payload, (league) => {
      logEvent('create_league')
      setCreateGroupStatus('Refreshing leagues...')
      getLeagues((leagues) => {
        setLeagueList(leagues.data)
        setLeagueId(league.data.ID)
        setGroupMode('view')
        setCreatingGroup(false)
      })
    })
  }

  const joinGroup = () => {
    setCreatingGroup(true)
    setCreateGroupStatus('Joining league...')
    joinLeague(joinInviteCode, (statusCode, json) => {
      if (statusCode == 201) {
        setCreateGroupStatus('Refreshing leagues...')
        getLeagues((leagues) => {
          setLeagueList(leagues.data)
          setGroupMode('view')
          setCreatingGroup(false)
        })
        logEvent('join_league')
      } else {
        if (json.message == 'An error occurred') {
          alert('Invalid invite code')
        } else {
          alert(json.message)
        }
        setCreatingGroup(false)
      }
    })
  }

  const deleteGroup = () => {
    const deleteGroup = window.confirm(
      'Are you sure you want to delete this league?'
    )
    if (deleteGroup === true) {
      setCreatingGroup(true)
      setCreateGroupStatus('Deleting league...')

      deleteLeague(leagueId, (json) => {
        setCreateGroupStatus('Refreshing leagues...')
        getLeagues((leagues) => {
          setLeagueList(leagues.data)
          setLeagueId('')
          setGroupMode('view')
          setCreatingGroup(false)
        })
      })
    }
  }

  const shareInviteCode = () => {
    const shareText =
      'Join my ' +
      selectedGroupName +
      ' nerdle league. Go to nerdle stats / leagues and enter this code: ' +
      inviteCode
    if (navigator.share) {
      navigator
        .share({
          text: shareText,
        })
        .then(() => {
          console.log('Successfully shared invite code')
        })
        .catch((error) => {
          console.error('Something went wrong sharing the invite code', error)
        })
    } else {
      console.log('No native share support .. post to app')
      if (window.navigator.userAgent.includes('Nerdle/1.0') || window.isMobileApp) {
        //send message to native app
        postToFlutter('share:' + shareText)
      }
    }

    navigator.clipboard.writeText(shareText)
    handleShare()
    logEvent('share_invite_league_code')
  }

  // isDarkMode?
  const isDarkMode = localStorage.getItem('darkModeNew') === 'true'

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
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 w-[500px]">
                <div className="absolute right-4 top-4 dark:text-[#D7DADC]">
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
                <div style={{ display: 'flex', flexDirection: 'column' }} className="min-h-screen">
                  <div className="text-center" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="mt-2">
                      <div className="border-b border-[#161803]">
                        <nav className="-mb-px flex space-x-1" aria-label="Tabs">
                          {enabledBadgeGameModes.includes(gameMode || '') == true && (
                            <span
                              onClick={() => setCurrentTab('badges')}
                              /*updated style*/
                              style={{
                                fontWeight:
                                  currentTab === 'badges' ? 'bold' : 'normal',
                                borderWidth: 1,
                                borderBottomWidth: currentTab == 'badges' ? 3 : 1,
                                marginBottom: currentTab == 'badges' ? -0.5 : 0,
                                borderColor: '#161803',
                                borderBottomColor:
                                  currentTab == 'badges' ? 'white' : '#161803',
                                width: 100,
                                backgroundColor:
                                  currentTab === 'badges'
                                    ? isDarkMode
                                      ? '#E4E3E0'
                                      : 'transparent'
                                    : isDarkMode
                                      ? 'transparent'
                                      : '#E4E3E0',
                                color: isDarkMode
                                  ? currentTab === 'badges'
                                    ? 'black'
                                    : 'grey'
                                  : 'rgb(107 114 128 / var(--tw-text-opacity));',
                              }}
                              className="underline cursor-pointer border-transparent hover:text-gray-700 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm rounded-t"
                            >
                              Badges
                            </span>
                          )}

                          <span
                            onClick={() => setCurrentTab('stats')}
                            /*updated style*/
                            style={{
                              fontWeight:
                                currentTab === 'stats' ? 'bold' : 'normal',
                              borderWidth: 1,
                              borderBottomWidth: currentTab == 'stats' ? 3 : 1,
                              marginBottom: currentTab == 'stats' ? -0.5 : 0,
                              borderColor: '#161803',
                              borderBottomColor:
                                currentTab == 'stats' ? 'white' : '#161803',
                              width: 100,
                              backgroundColor:
                                currentTab === 'stats'
                                  ? isDarkMode
                                    ? '#E4E3E0'
                                    : 'transparent'
                                  : isDarkMode
                                    ? 'transparent'
                                    : '#E4E3E0',
                              color: isDarkMode
                                ? currentTab === 'stats'
                                  ? 'black'
                                  : 'grey'
                                : 'rgb(107 114 128 / var(--tw-text-opacity));',
                            }}
                            className="underline cursor-pointer border-transparent hover:text-gray-700 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm rounded-t"
                          >
                            Statistics
                          </span>

                          <span
                            onClick={() => setCurrentTab('leagues')}
                            /*updated style*/
                            style={{
                              fontWeight:
                                currentTab === 'leagues' ? 'bold' : 'normal',
                              borderWidth: 1,
                              borderBottomWidth: currentTab == 'leagues' ? 3 : 1,
                              marginBottom: currentTab == 'leagues' ? -0.5 : 0,
                              borderColor: '#161803',
                              borderBottomColor:
                                currentTab == 'leagues' ? 'white' : '#161803',
                              width: 100,
                              backgroundColor:
                                currentTab === 'leagues'
                                  ? isDarkMode
                                    ? '#E4E3E0'
                                    : 'transparent'
                                  : isDarkMode
                                    ? 'transparent'
                                    : '#E4E3E0',
                              color: isDarkMode
                                ? currentTab === 'leagues'
                                  ? 'black'
                                  : 'grey'
                                : 'rgb(107 114 128 / var(--tw-text-opacity));',
                            }}
                            className="underline cursor-pointer border-transparent hover:text-gray-700 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm rounded-t"
                          >
                            Leagues
                          </span>
                        </nav>
                      </div>
                    </div>

                    {currentTab === 'stats' && (
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ flex: "1 1 0" }} className="overflow-y-scroll">

                          <div className="text-center mt-2 font-semibold dark:text-[#D7DADC]">
                            {(gameMode === '' ? 'classic' : gameMode) + ' nerdle stats'}
                          </div>

                          <div className={"grid gap-1 mt-2 " + (gameMode == 'instant' ? "grid-cols-4" : "grid-cols-5")}>
                            <div className="bg-white dark:bg-gray-800 dark:text-[#D7DADC]">
                              <div className="grid grid-rows-2">
                                <div className="text-xl">{gamesPlayed}</div>
                                <div className="text-xs">
                                  {' '}
                                  Games
                                  <br />
                                  played
                                </div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 dark:text-[#D7DADC]">
                              <div className="grid grid-rows-2">
                                <div className="text-xl">{wonPercentage}</div>
                                <div className="text-xs">
                                  Games
                                  <br />
                                  won
                                </div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 dark:text-[#D7DADC]">
                              <div className="grid grid-rows-2">
                                <div className="text-xl">{currentStreak}</div>
                                <div className="text-xs">
                                  Current
                                  <br />
                                  Streak
                                </div>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 dark:text-[#D7DADC]">
                              <div className="grid grid-rows-2">
                                <div className="text-xl">{maxStreak}</div>
                                <div className="text-xs">
                                  Max
                                  <br />
                                  Streak
                                </div>
                              </div>
                            </div>

                           {gameMode!== 'instant' && (
                            <div className="bg-white dark:bg-gray-800 dark:text-[#D7DADC]">
                              <div className="grid grid-rows-2">
                                <div className="text-xl">
                                  {totalPoints3Percentage}%
                                </div>
                                <div className="text-xs">
                                  won
                                  <br />
                                  in &lt; 4
                                </div>
                              </div>
                            </div>)}
                          </div>

                          {averageGuessTime.gamesWon > 0 && (
                            <div className="mt-2 dark:text-[#D7DADC]">
                              Average speed:{' '}
                              {secondsToHms(
                                averageGuessTime.totalTime /
                                averageGuessTime.gamesWon
                              )}
                            </div>
                          )}

                          {gameMode !== 'instant' && (
                            <>
                              <div className="mt-2 dark:text-[#D7DADC]">
                                <b>{(gameMode === '' ? 'classic' : gameMode) + ' nerdle guess distribution'}</b>
                              </div>

                              <div className="grid grid-cols-11 gap-3">
                                <div>&nbsp;</div>

                                <div className="text-right col-span-1 text-xs items-end text-right dark:text-[#D7DADC]">
                                  10%
                                </div>
                                <div className="text-right col-span-4 text-xs  items-end text-right dark:text-[#D7DADC]">
                                  50%
                                </div>
                                <div className="text-right col-span-5 text-xs  items-end text-right dark:text-[#D7DADC]">
                                  100%
                                </div>
                              </div>

                              <div className="grid grid-rows-6 gap-3 mt-1 dark:text-[#D7DADC]">
                                {winRows.map((e, index) => {
                                  const bgColor =
                                    winRows[index] > 0
                                      ? 'bg-[#398874]'
                                      : 'bg-[#161803]'
                                  const theWidth =
                                    winRows[index] > 0
                                      ? Math.round(
                                        (winRows[index] / gamesPlayed) * 100
                                      )
                                      : 0
                                  const textAlign =
                                    winRows[index] > 0
                                      ? 'text-right'
                                      : 'text-center'

                                  return (
                                    <div
                                      className="grid grid-cols-11 gap-3"
                                      key={index}
                                    >
                                      <div>{index + 1}</div>
                                      <div
                                        className={`${bgColor} col-span-10 ${textAlign} pl-1 pr-1 text-white rounded`}
                                        style={{
                                          width: theWidth + '%',
                                          position: 'relative',
                                        }}
                                      >
                                        {winRows[index] > 0 && theWidth > 9
                                          ? winRows[index]
                                          : ''}
                                        {theWidth < 10 && (
                                          <div
                                            style={{
                                              position: 'absolute',
                                              left: 100 + theWidth + 20 + '%',
                                              top: 0,
                                            }}
                                            className="text-black text-right  dark:text-[#FFFFFF]"
                                          >
                                            {winRows[index] > 0
                                              ? winRows[index]
                                              : ''}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </>
                          )}

                          <div className="mt-2 dark:text-[#D7DADC]">
                            <b>{(gameMode === '' ? 'classic' : gameMode) + ' nerdle game diary'}</b>
                          </div>
                          <div>

                            {gameDiaryData.length > 0 && (
                              <div className="grid grid-cols-4 gap-1 mt-2 text-right text-sm dark:text-[#D7DADC] text-gray-500">
                                <div className="text-left"></div>
                                <div>Played</div>
                                <div>Won</div>
                                <div>Points</div>
                              </div>
                            )}

                            {gameDiaryData.length > 0 &&
                              gameDiaryData.map((e, index) => {
                                // don't show tomorrow if no games in it

                                // work around for edge case where duplicate entries in database ...
                                if (e.points > 6) {
                                  e.points = Math.round(e.points / e.won)
                                }
                                if (e.label === 'Today') {
                                  e.replayDate = ''
                                }

                                if (e.label === 'Tomorrow' && e.played === 0) {
                                  return <div />
                                }
                                return (
                                  <div
                                    key={index}
                                    className="grid grid-cols-4 gap-1 mt-2 text-right dark:text-[#D7DADC]"
                                  >
                                    <div className="text-left font-semibold dark:text-[#D7DADC]">
                                      {e.label}
                                    </div>
                                    <div>
                                      {e.played > 0 && (
                                        <div className="ml-auto flex text-right h-6 w-6 rounded-full bg-green-100  dark:bg-[#398874]">
                                          <CheckIcon
                                            className="h-6 w-6 text-green-600 dark:text-green-100"
                                            aria-hidden="true"
                                          />
                                        </div>
                                      )}
                                      {e.played === 0 && (
                                        <span className="text-gray-500 dark:text-[#D7DADC]">
                                          <a
                                            className="underline cursor-pointer focus:outline-none"
                                            href={`/${e.replayDate}`}
                                          >
                                            play
                                          </a>
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      {e.won > 0 ? (
                                        <div className="ml-auto flex text-right h-6 w-6 rounded-full bg-green-100  dark:bg-[#398874]">
                                          <CheckIcon
                                            className="h-6 w-6 text-green-600 dark:text-green-100"
                                            aria-hidden="true"
                                          />
                                        </div>
                                      ) : (
                                        <div className="ml-auto flex text-right h-6 w-6 rounded-full bg-red-100 ">
                                          <XIcon
                                            className="h-6 w-6 text-red-600"
                                            aria-hidden="true"
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <div className="my-auto" style={{ fontSize: 8 }}>
                                      {'🟩'.repeat(e.points)}
                                    </div>
                                  </div>
                                )
                              })}

                            {!hasLBLToken && (
                              <>
                                <div className="mt-6 dark:text-[#D7DADC] text-sm text-center">
                                  Log in to see your game diary and sync your stats
                                  across devices
                                  <button
                                    type="button"
                                    className="mt-4 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={() => {
                                      // shareStatus(guesses, solutionIndex, solution, timerString)
                                      handleLBLLogin(2)
                                    }}
                                  >
                                    <div className="text-center">
                                      Log in / Sign up
                                    </div>
                                  </button>
                                </div>


                              </>
                            )}
                          </div>

                        </div>

                      </div>

                    )}

                    {currentTab === 'leagues' && (
                      // make a grid of 4 columns, and 8 rows
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        {groupMode == 'view' && (
                          <div className="text-center mt-2 dark:text-[#D7DADC]"
                            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            {creatingGroup ? (
                              <>
                                <OrbitProgress
                                  variant="track-disc"
                                  color="#820458"
                                  size="medium"
                                  text=""
                                  textColor=""
                                />
                                <div>{createGroupStatus}</div>
                              </>
                            ) : (
                              <>
                                {leagueList.length > 0 && hasLBLToken && (
                                  <select
                                    className="p-[3px] mt-2 dark:text-black text-sm text-center border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    defaultValue={leagueId}
                                    onChange={(e) => {
                                      const league = e.target.value
                                      console.log('league selected', league)
                                      setLeagueId(e.target.value)
                                    }}
                                  >
                                    <option value="">Select a league</option>
                                    {leagueList.map(
                                      (
                                        e: {
                                          ID: string
                                          details: { title: any }
                                        },
                                        index: Key | null | undefined
                                      ) => {
                                        return (
                                          <option
                                            key={index}
                                            value={e.ID}
                                            selected={e.ID == leagueId}
                                          >
                                            {e.details.title}
                                          </option>
                                        )
                                      }
                                    )}
                                  </select>
                                )}

                                {(leagueId == '' || !hasLBLToken) && (
                                  <div className="mt-2">
                                    <span className="text-sm">
                                      Create or join a league, share with friends
                                      and compete against each other.
                                    </span>
                                  </div>
                                )}

                                {leagueId != '' && hasLBLToken && (
                                  <>
                                    <div
                                      className="overflow-y-scroll"
                                      // style={{
                                      //   height: members.length > 5 ? 330 : 290,
                                      // }}
                                      style={{ flex: "1 1 0" }}
                                    >
                                      <div className="mt-2">
                                        {gameMode} nerdle league scores this week:
                                      </div>

                                      <div>
                                        {members.map((e, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className="grid grid-cols-3 gap-1 mt-2 text-right dark:text-[#D7DADC]"
                                            >
                                              <div className="text-left">
                                                {e.details.fullname}
                                              </div>
                                              <div>{e.total} points</div>
                                              <div className="ml-auto">
                                                {index == 0 ? (
                                                  <GoldCrownIcon />
                                                ) : index == 1 ? (
                                                  <SilverCrownIcon />
                                                ) : index == 2 ? (
                                                  <BronzeCrownIcon />
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>

                                    {hasLBLToken && (
                                      <div>
                                        <p
                                          className="text-xs"
                                          style={{
                                            marginLeft: 20,
                                            marginRight: 20,
                                            lineHeight: 1.5,
                                            marginTop: 10,
                                          }}
                                        >
                                          Share the code below with friends &amp;
                                          family so they can join your{' '}
                                          "{selectedGroupName}" league
                                        </p>

                                        <div className="mt-1">
                                          Invite code: <strong>{inviteCode}</strong>{' '}
                                          {members.length > 5 && (
                                            <span
                                              className="cursor-pointer underline"
                                              onClick={() => {
                                                shareInviteCode()
                                              }}
                                            >
                                              share code
                                            </span>
                                          )}
                                        </div>

                                        {members.length < 6 && (
                                          <div>
                                            <button
                                              className="mt-2 w-[90%] inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-1 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                              onClick={() => {
                                                shareInviteCode()
                                              }}
                                            >
                                              Share code{' '}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}

                                <div className="mt-0">
                                  <button
                                    disabled={!hasLBLToken}
                                    className="mt-2 mx-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-1 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={() => {
                                      setGroupMode('create')
                                    }}
                                    style={{
                                      backgroundColor: hasLBLToken
                                        ? 'rgb(79 70 229 / var(--tw-bg-opacity)'
                                        : 'rgb(79 70 229 / 0.5)',
                                    }}
                                  >
                                    Create league
                                  </button>

                                  <button
                                    disabled={!hasLBLToken}
                                    className="mt-2 mx-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-1 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={() => {
                                      setGroupMode('join')
                                    }}
                                    style={{
                                      backgroundColor: hasLBLToken
                                        ? 'rgb(79 70 229 / var(--tw-bg-opacity)'
                                        : 'rgb(79 70 229 / 0.5)',
                                    }}
                                  >
                                    Join league
                                  </button>
                                </div>

                                {(!hasLBLToken || leagueList.length == 0) && (
                                  <>
                                    {!hasLBLToken && (
                                      <div style={{ marginTop: 20 }}>
                                        <button
                                          type="button"
                                          className="mt-4 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                          onClick={() => {
                                            // shareStatus(guesses, solutionIndex, solution, timerString)
                                            handleLBLLogin(2)
                                          }}
                                        >
                                          <div className="text-center">
                                            Log in / Sign up
                                          </div>
                                        </button>
                                      </div>
                                    )}

                                    <div
                                      className="mt-6 dark:text-[#D7DADC] text-sm text-center"
                                      style={{
                                        position: 'absolute',
                                        bottom: 80,
                                        left: 0,
                                        right: 0,
                                        marginLeft: 10,
                                        marginRight: 10,
                                      }}
                                    >
                                      <span style={{ color: '#820458' }}>
                                        new
                                      </span>{' '}
                                      <strong>nerdle leagues</strong>
                                      <p>
                                        With an account, you can join a nerdle
                                        league and share your nerdle scores with
                                        friends & family
                                      </p>
                                      <div
                                        style={{
                                          // position: 'absolute',
                                          // bottom: 80,
                                          // left: 0,
                                          // right: 0,
                                          marginTop: 20,
                                          borderStyle: 'solid',
                                          borderWidth: 2,
                                          borderRadius: 5,
                                        }}
                                      >
                                        <img
                                          src="/nerdle_with_friends.png"
                                          style={{
                                            height: '120px',
                                            margin: 'auto',
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                <div>
                                  {leagueAdmin && (
                                    <span
                                      className="underline cursor-pointer text-sm"
                                      onClick={() => {
                                        deleteGroup()
                                      }}
                                    >
                                      delete league
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {groupMode == 'create' && (
                          <div className="text-center mt-2 dark:text-[#D7DADC]">
                            {creatingGroup ? (
                              <>
                                <OrbitProgress
                                  variant="track-disc"
                                  color="#820458"
                                  size="medium"
                                  text=""
                                  textColor=""
                                />
                                <div>{createGroupStatus}</div>
                              </>
                            ) : (
                              <>
                                <div>Create league</div>

                                <div className="mt-4">
                                  <p>League name:</p>
                                  <input
                                    className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-[200px]"
                                    type="text"
                                    placeholder="League name"
                                    onChange={(e) => {
                                      setGroupName(e.target.value)
                                    }}
                                  />
                                </div>

                                <button
                                  className="mt-4 mx-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                  onClick={() => {
                                    console.log('create league', groupName)
                                    createGroup()
                                  }}
                                >
                                  Create
                                </button>

                                <button
                                  className="mt-4 mx-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                  onClick={() => {
                                    setGroupMode('view')
                                  }}
                                >
                                  cancel
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {groupMode == 'join' && (
                          <div className="text-center mt-2 dark:text-[#D7DADC]">
                            {creatingGroup ? (
                              <>
                                <OrbitProgress
                                  variant="track-disc"
                                  color="#820458"
                                  size="medium"
                                  text=""
                                  textColor=""
                                />
                                <div>{createGroupStatus}</div>
                              </>
                            ) : (
                              <>
                                <div>Join league</div>

                                <div className="mt-4">
                                  <p>Invite code:</p>
                                  <input
                                    className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-[200px]"
                                    type="text"
                                    placeholder="Invite code"
                                    onChange={(e) => {
                                      setJoinInviteCode(e.target.value)
                                    }}
                                  />
                                </div>

                                <button
                                  className="mt-4 mx-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                  onClick={() => {
                                    console.log('create group', groupName)
                                    joinGroup()
                                  }}
                                >
                                  Join
                                </button>

                                <button
                                  className="mt-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                  onClick={() => {
                                    setGroupMode('view')
                                  }}
                                >
                                  cancel
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {currentTab === 'badges' && (
                     <BadgesTab 
                        achievements={achievements}
                        gameMode={gameMode}
                        setAchievementLargeImage={setAchievementLargeImage}
                        setIsAchievementModalOpen={setIsAchievementModalOpen}
                        handleClose={handleClose}
                        setCurrentTab={setCurrentTab}
                        setThisOpen={setThisOpen}
                        handleLBLLogin={handleLBLLogin}
                        logEvent={logEvent}
                        hasLBLToken={hasLBLToken}
                      />
                    )}

     
                  </div>

                  <div className="mt-2 dark:text-[#D7DADC] text-sm text-center">
                    <span
                      className="underline cursor-pointer focus:outline-none"
                      onClick={() => handleInfo()}
                    >
                      Info
                    </span>
                    {' | '}
                    <span
                      className="underline cursor-pointer focus:outline-none"
                      onClick={() => handleReset()}
                    >
                      Reset
                    </span>
                    {' | '}
                    <span
                      className="underline cursor-pointer focus:outline-none"
                      onClick={() => {
                        const statsString = JSON.stringify(stats)
                        const statsBase64 = btoa(statsString)
                        navigator.clipboard.writeText(statsBase64).then(() => {
                          alert(
                            'Your stats have been copied to the clipboard. To import on another device, click "Import stats" on the settings window and paste the exported code.'
                          )
                        })
                      }}
                    >
                      Export
                    </span>
                    {' | '}
                    <span
                      className="underline cursor-pointer focus:outline-none"
                      onClick={() => {
                        doRestoreStats()
                      }}
                    >
                      Restore
                    </span>

                    {window.location.href.includes('?de') && (
                      <>
                        {' '}
                        {' | '}
                        <span
                          className="underline cursor-pointer focus:outline-none"
                          onClick={() => {
                            const statsString =
                              localStorage.getItem('deviceStatsState') || ''
                            const statsBase64 = btoa(statsString)
                            navigator.clipboard
                              .writeText(statsBase64)
                              .then(() => {
                                alert(
                                  'Your backup device stats have been copied to the clipboard.'
                                )
                              })
                          }}
                        >
                          DE
                        </span>
                      </>
                    )}

                    {hasLBLToken && (
                      <>
                        {' | '}
                        <span
                          className="underline cursor-pointer focus:outline-none"
                          onClick={() => {
                            localStorage.removeItem('lbl_token')
                            localStorage.removeItem('userEmail')
                            setHasLBLToken(false)

                            if (isNewMobileApp()) {
                              postToFlutter('logout')
                            }

                            //refresh the page
                            window.location.reload()
                          }}
                        >
                          Log out
                        </span>
                      </>
                    )}
                    {!hasLBLToken && (
                      <>
                        {' | '}
                        <span
                          className="underline cursor-pointer focus:outline-none"
                          onClick={() => {
                            handleLBLLogin(2)
                          }}
                        >
                          Login
                        </span>
                      </>
                    )}
                  </div>

                  {hasLBLToken && userEmail !== '' && (
                    <div className="mt-2 dark:text-[#D7DADC] text-sm text-center">
                      Logged in as {userEmail}
                    </div>
                  )}

                  {!hasLBLToken && showUpgradeInfoLink && (
                    <div
                      className="mt-2 dark:text-[#D7DADC] text-sm text-center underline cursor-pointer"
                      onClick={() => {
                        postToFlutter('noAndroidStats:' + window.location.host)
                      }}
                    >
                      Upgraded and lost your stats?
                    </div>
                  )}
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
        handleStats={() => {
          setIsAchievementModalOpen(false)
          setThisOpen(true)
        }}
        handleLogEvent={(text) => {
          logEvent(text)
        }}
        largeImage={achievementLargeImage}
      />

    </>
  )
}
