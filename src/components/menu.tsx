//import { Transition } from '@headlessui/react'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import { games } from '../lib/gameList'
import { LBLLoginModal } from './modals/LBLLoginModal'

import {
  QuestionMarkCircleIcon,
  HomeIcon,
  LoginIcon,
  ShareIcon,
  ChartBarIcon,
  CogIcon,
  XIcon,
  CalculatorIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  NewspaperIcon,
} from '@heroicons/react/outline'

import { getGamesPlayedToday, setGamesPlayedToday, hasGameBeenPlayed} from '../lib/gameTracker'
import { useEffect } from 'react'

import { isNewMobileApp, platform, postToFlutter } from '../lib/isPWA'

declare var window: any
declare var _conv_q: any

type Props = {
  isOpen: boolean
  handleAction: (action: string) => void
  handleClose: () => void
  gamesPlayed: number
  gameMode: string
  gameWon: boolean
}

export const Menu = ({
  isOpen,
  handleAction,
  handleClose,
  gamesPlayed,
  gameMode,
  gameWon,
}: Props) => {

  const [ready, setReady] = useState(false)
  const [isLBLLoginOpen, setIsLBLLoginOpen] = useState(false)
  const [isloggedIn, setIsLoggedIn] = useState(localStorage.getItem('lbl_token') ? true : false)

  const _handleAction = (action: string) => {
    handleClose()
    handleAction(action)
  }

  let gameList = ''
  if (gameWon) {
    gameList = '?gp=' + setGamesPlayedToday(gameMode)
  } else {
    gameList = '?gp=' + getGamesPlayedToday()
  }
  gameList = gameList + '&st=' + window.sessionTime

  // useEffect(() => {
  //   if (isOpen) {
  //     console.log('isNewMobileApp', isNewMobileApp())
  //     console.log('platform', platform())
  //   }
  // }, [isOpen])

  //sort games moving any in gamesPlayed to the end
  const sortedGames = games
  // .filter((g) => g.gameMode !== gameMode)
  // .sort((a, b) => {
  //   if (getGamesPlayedToday().includes(a.name)) {
  //     return 1
  //   } else if (getGamesPlayedToday().includes(b.name)) {
  //     return -1
  //   } else {
  //     return 0
  //   }
  // })

  //if (isOpen) {
  return (
    <div
      className="menu-overlay-open fixed inset-0 bg-gray-500 bg-opacity-75 z-[9999]"
      onClick={() => handleClose()}
      style={{ width: isOpen ? '100%' : 0 }}
    >

      <LBLLoginModal
          isOpen={isLBLLoginOpen}
          handleClose={() => {
              setIsLBLLoginOpen(false)
          }}
          scoreText={''}
          handleLogin={() => {
              setIsLBLLoginOpen(false)
              window.location.href = '/game';
          }}
      />

      <div
        style={{ width: 420, padding: !isOpen ? 0 : undefined, left: isOpen ? 0 : -420 }}
        className="menu-open absolute top-0 left-0 bottom-0 bg-white dark:bg-gray-800 z-50 pr-4 pt-4 pl-4  max-w-[100%] dark:text-[#D7DADC] overflow-auto flex"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          <div
            className="absolute left-4 top-4 cursor-pointer select-none"
            onClick={() => handleClose()}
          >
            <img
              src="/logo192.png"
              alt="Nerdlegame - the daily numbers game"
              style={{ height: 32, paddingLeft: 2, paddingRight: 10 }}
              aria-label="Nerdle logo - close menu"
            />
          </div>

          <div
            className="absolute right-4 top-4"
            aria-label="Close"
            role="navigation"
          >
            <XIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => handleClose()}
            />
          </div>

          <div className="mt-8 pt-4 ml-2  max-w-[95%] mr-8 mx-auto items-center mb-4 h-full">

          {!isloggedIn &&
          <div
              className="flex mb-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                handleClose()
                setIsLBLLoginOpen(true)
              }}
              aria-label="Home"
              role="navigation"
            >
              <LoginIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              Login
            </div>}

            <div
              className="flex cursor-pointer active:bg-slate-400"
              onClick={() => {
                window.location.href =
                  'https://www.nerdlegame.com' + gameList + '&v002'
              }}
              aria-label="Home"
              role="navigation"
            >
              <HomeIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              Home
            </div>

            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                _handleAction('info')
              }}
              aria-label="Help"
              role="navigation"
            >
              <QuestionMarkCircleIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              How to play
            </div>

            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                _handleAction('faqs')
              }}
              aria-label="FAQs"
              role="navigation"
            >
              <DocumentTextIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              FAQs
            </div>

            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                _handleAction('blog')
              }}
              aria-label="Blog"
              role="navigation"
            >
              <NewspaperIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              Blog
            </div>

            {gamesPlayed > 0 && (
              <div
                className="flex mt-4 cursor-pointer active:bg-slate-400"
                onClick={() => {
                  _handleAction('stats')
                }}
                aria-label="Stats"
                role="navigation"
              >
                <ChartBarIcon
                  className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                  style={{ marginRight: 10, color: '#398874' }}
                />{' '}
                Profile/Stats
              </div>
            )}

            {gamesPlayed == 0 && isNewMobileApp() && platform() == 'android' && (
              <div
                className="flex mt-4 cursor-pointer active:bg-slate-400"
                onClick={() => {
                  postToFlutter('noAndroidStats:' + window.location.host)
                }}
                aria-label="Stats"
                role="navigation"
              >
                <ChartBarIcon
                  className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                  style={{ marginRight: 10 }}
                />{' '}
                No stats?
              </div>
            )}

            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                _handleAction('share')
              }}
              aria-label="Share"
              role="navigation"
            >
              <ShareIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              Share
            </div>

            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                _handleAction('calc')
              }}
              aria-label="Calculator"
              role="navigation"
            >
              <CalculatorIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              Calculator
            </div>

            {gameMode != 'pro' &&
              <div
                className="flex mt-4 cursor-pointer active:bg-slate-400"
                onClick={() => {
                  _handleAction('previous')
                }}
                aria-label="Previous games"
                role="navigation"
              >
                <CalendarIcon
                  className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                  style={{ marginRight: 10 }}
                />{' '}
                Replay games
              </div>}

            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                window.location.href =
                  'https://www.nerdlegame.com/index.html#merch'
              }}
              aria-label="Settings"
              role="navigation"
            >
              <ShoppingBagIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              Merch etc
            </div>

            <div
              className="flex mt-4 cursor-pointer active:bg-slate-400"
              onClick={() => {
                _handleAction('settings')
              }}
              aria-label="Settings"
              role="navigation"
              style={{borderBottom:'1px solid black', paddingBottom:'10px'}}
            >
              <CogIcon
                className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                style={{ marginRight: 10 }}
              />{' '}
              Settings
            </div>

 {/* NEW */}
 <div className="flex mt-2">
                  Arcade math games
              </div>
              <div
                className="flex mt-0 cursor-pointer active:bg-slate-400"
                aria-label="Arcade games"
                role="navigation"
                style={{border:'1px solid gray', fontSize:'0.8rem', padding:'3px', marginRight:'5px'}}
                >
                <table>
                  <tr style={{width:'100%'}}>
                    <td style={{width:'50%'}} 
                      onClick={() => {
                      window.location.href = 'https://maff.games/digitdrop'
                      }}
                    >
                      <img src="https://maff.games/digitdrop/assets/images/whiteDDPromo.gif" style={{ width: '100%', margin: '0 0', border: '0px' }} ></img>
                    </td>
                    <td style={{width:'50%'}} 
                      onClick={() => {
                      window.location.href = 'https://maff.games/adder?v002'
                      }}
                      >
                      <img src="https://maff.games/digitdrop/assets/images/whiteAdderPromo.gif" style={{ width: '100%', margin: '0 0', border: '0px' }} ></img>
                    </td>
                  </tr>
                </table>
              </div>       
              {/* <div className="flex mt-2">
                  New word game
              </div>
              <div
                  onClick={() => {
                    window.location.href = 'https://nerdlegame.com/twords'
                    }}
                  className="flex mt-0 cursor-pointer active:bg-slate-400"
                aria-label="Twords"
                role="navigation"
                style={{border:'1px solid gray', fontSize:'0.8rem', padding:'3px', marginRight:'5px'}}
                >
                <table>
                  <tr style={{width:'100%'}}>
                      <img src="https://nerdlegame.com/maffdoku/twordsLogo.png" style={{ width: '100%', margin: '0 0', border: '0px' }} ></img>
                  </tr>
                  <tr style={{width:'100%'}}>
                      <b>Twords:</b> guess the nonsense word 
                  </tr>
                </table>
              </div>    */}
              {/* END NEW */}
          </div>
        </div>

        <div
          style={{ display: isOpen ? 'block' : 'none' }}

        >
                  
          <div className="flex mt-1 mb-2 pt-1">Other games</div>

          {/*End advent*/}

          {/*Add back in when advent removed...      
                <div className="flex mt-8 pt-4">Other games</div>
          */}

          <div>
            {sortedGames.map((game) => {

              var includeGame = game.gameMode !== gameMode
              if (game.startDate) {
                const startDate = new Date(game.startDate)
                const today = new Date()
                if (startDate > today) {
                  includeGame = false
                }
              }

              if (includeGame) {
                let gamePlayedToday = getGamesPlayedToday().includes(
                  game.name || game.gameMode
                )

                if (game.lastPlayedStartsWith) {
                  gamePlayedToday = getGamesPlayedToday().some((b) => b.startsWith(game.gameMode))
                }

                return (
                  <div
                    key={game.name}
                    className="flex leading-[2.6rem] cursor-pointer"
                    onClick={() => {
                      window._conv_q = window._conv_q || [];
                      _conv_q.push(["triggerConversion", "100482961"]);
                      window.location.href = game.url + gameList
                    }}
                    aria-label={game.name}
                    role="navigation"
                    style={{ position: 'relative' }}
                  >
                    <div style={{ width: 65 }}>
                      <img
                        src={game.img}
                        className="mr-2"
                        alt={game.name}
                        aria-label={game.name}
                        style={{
                          height: 32,
                        }}
                      />
                    </div>
                    <div
                      className="text-[#398874] dark:text-[#D7DADC]"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      {game.name}
                    </div>

                    {gamePlayedToday && (
                      <div
                        style={{
                          position: 'absolute',
                          right: -10,
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                        }}
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
        </div>

        <div style={{ height: 60 }} />
      </div>
      {/* </Transition> */}
    </div>
  )
  // } else {
  //   return <div />
  // }
}
