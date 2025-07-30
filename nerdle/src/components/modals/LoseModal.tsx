import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { MiniGrid } from '../mini-grid/MiniGrid'
import { shareStatus, shareText } from '../../lib/share'
import { XCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { isMobile } from 'react-device-detect'
//import {Adsense} from '@ctrl/react-adsense';
import classnames from 'classnames'
// import { isIOS, isAndroid } from 'react-device-detect';
// import { isRunningInPWA } from '../../lib/isPWA'
import {
  loadGameState,
  saveGameState,
} from '../../lib/storage'
declare var window: any

type Props = {
  isOpen: boolean
  handleClose: (reloadGuesses:boolean, restartGame:boolean) => void
  solutionIndex: number
  solution: string
  handleLogEvent: (val: string) => void
}

export const LoseModal = ({
  isOpen,
  handleClose,
  solutionIndex,
  solution,
  handleLogEvent
}: Props) => {
  const gameMode = localStorage.getItem('gameMode') || ''
  const [showSolution, setShowSolution] = useState(false)
  const [allowClose, setAllowClose] = useState(true)

  useEffect(() => {
    if (isOpen) {
      handleLogEvent('lose_modal_open')
    }

    if (isOpen && window.lngtd) {
      try {
        window.lngtd.resetAndRunAuction()
      } catch (e) {
        console.log('error resetting auction')
      }
      setTimeout(() => {
        window.lngtd.initInterstitial('interstitial_video')
        console.log('inited interstitial')
      }, 1000)
    }
  }, [isOpen])

  const triggerInterstitial = (func: () => void) => {
    if (window.lngtd.triggerInterstitial) {
      console.log('about to call triggerInterstitial')
      setAllowClose(false)
      handleLogEvent('lose_play_ad')

      window.lngtd.triggerInterstitial(
        {
          type: 'interstitial',
          name: 'interstitial',
          minViewTime: 8000, // the ad will be allowed to be closed after 8s
          maxAdBreak: 40000, // the ad will be closed if the user doesn't close it manually at 40s or the ad hasn't finished yet at 40s
          beforeAd: function () {
            // nothing required here.
            console.log('before ad')
          },
          adBreakDone: function () {
            // here you would do the expected behavior of the click (ie go to a new page)
            handleLogEvent('lose_play_ad_shown')
            console.log('ad break done')
            func()
            setAllowClose(true)
          },
        },
        'interstitial_video'
      )

      console.log('after triggerInterstitial')
    }
  }

  const moreGamesClasses = classnames(
    'text-center cursor-pointer col-span-3',
    {}
  )

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          if (allowClose) {
            handleClose(false, false)
          }
        }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-24 text-center sm:block sm:p-0">
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
                  onClick={() => handleClose(false, false)}
                />
              </div>
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100  dark:bg-red-100">
                  <XIcon
                    className="h-6 w-6 text-red-600 dark:text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC]"
                  >
                    Sorry, you lost!
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-[#D7DADC]"></p>
                  </div>
                </div>
              </div>

              {!showSolution && (
                <div className="mt-5 sm:mt-6 text-center">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full max-w-[320px] rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => {
                      //delete localStorage 'game-state' and refresh
                      handleLogEvent('lose_retry_last_guess')
                      triggerInterstitial(() => {
                        handleClose(true,false)
                      })
                    }}
                  >
                    Retry last guess
                  </button>
                </div>
              )}

              {!showSolution && (
                <div className="mt-2 sm:mt-2 text-center">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full max-w-[320px] rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => {
                      handleLogEvent('lose_restart_game')
                      //delete localStorage 'game-state' and refresh
                      triggerInterstitial(() => {
                        handleClose(false,true)
                      })
                    }}
                  >
                    Restart game
                  </button>
                </div>
              )}

              {!showSolution && (
                <div className="mt-2 sm:mt-3 text-center">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full max-w-[320px] rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => {
                      handleLogEvent('lose_show_solution')
                      triggerInterstitial(() => {
                        setShowSolution(true)
                      })
                    }}
                  >
                    Show solution
                  </button>
                </div>
              )}

              {showSolution && (
                <div className="mt-2 sm:mt-3 text-center  dark:text-[#D7DADC]">
                  The solution was:
                  <br />
                  {solution}
                </div>
              )}

              {!showSolution && (
                <div className="mt-2 sm:mt-3 text-center text-sm">
                  (A short ad will play before you can continue)
                </div>
              )}

              <p className="pt-2 mt-2 text-m cursor-pointer text-center dark:text-[#D7DADC]">
                <a
                  href="https://www.nerdlegame.com"
                  className="font-bold focus:outline-none text-xl"
                  /* style={{ fontFamily: "'Quicksand', sans-serif" }}*/
                >
                  Try another game!
                </a>
              </p>

              <div className="pt-2 mb-1 text-m cursor-pointer text-center dark:text-[#D7DADC]">
                <div
                  className="grid grid-cols-2 gap-1 dark:text-[#D7DADC]"
                  onClick={() => {
                    if (gameMode === 'mini') {
                      window.location.href = 'https://mini.bi.nerdlegame.com/'
                    } else {
                      window.location.href = 'https://bi.nerdlegame.com/'
                    }
                  }}
                >
                  <div className="col-span-1 text-right">
                    <img
                      src="/bi-nerdle.png"
                      className="h-10 inline"
                      alt="bi-nerdle"
                    />
                  </div>

                  <div
                    className={
                      'dark:text-white nerdle-name col-span-1 text-left'
                    }
                    style={{
                      fontSize: gameMode === 'mini' ? '1rem' : '1.2rem',
                      lineHeight: '0.6rem',
                      paddingTop: '0.1rem',
                    }}
                  >
                    <span
                      className={'dark:text-white nerdle-sub-name'}
                      style={{
                        fontSize: gameMode === 'mini' ? '1rem' : '1.2rem',
                      }}
                    >
                      {gameMode === 'mini' ? 'mini ' : ''}bi
                    </span>
                    nerdle <br />
                    <span
                      className={'dark:text-white text-black'}
                      style={{ fontSize: '0.8rem' }}
                    >
                      solve 2 at once!
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-1 dark:text-[#D7DADC]">
                {gameMode !== '' && (
                  <div
                    className={moreGamesClasses}
                    onClick={() =>
                      (window.location.href = 'https://nerdlegame.com/')
                    }
                  >
                    <img
                      src="/logo192.png"
                      className="h-11 mx-auto"
                      alt="classic nerdle"
                    />
                    <span
                      className="text-[#398874] dark:text-[#D7DADC]"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      classic
                    </span>
                  </div>
                )}

                {gameMode !== 'instant' && (
                  <div
                    className={moreGamesClasses}
                    onClick={() =>
                      (window.location.href = 'https://instant.nerdlegame.com/')
                    }
                  >
                    <img
                      src="/instant.png"
                      className="h-11 mx-auto"
                      alt="instant nerdle"
                    />
                    <span
                      className="text-[#398874] dark:text-[#D7DADC]"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      instant
                    </span>
                  </div>
                )}

                {gameMode !== 'speed' && (
                  <div
                    className={moreGamesClasses}
                    onClick={() =>
                      (window.location.href = 'https://speed.nerdlegame.com/')
                    }
                  >
                    <img
                      src="/speed.png"
                      className="h-11 mx-auto"
                      alt="speed nerdle"
                    />
                    <span
                      className="text-[#398874] dark:text-[#D7DADC]"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      speed
                    </span>
                  </div>
                )}

                {gameMode !== 'mini' && (
                  <div
                    className={moreGamesClasses}
                    onClick={() =>
                      (window.location.href = 'https://mini.nerdlegame.com/')
                    }
                  >
                    <img
                      src="/mini.png"
                      className="h-11 mx-auto"
                      alt="mini nerdle"
                    />
                    <span
                      className="text-[#398874] dark:text-[#D7DADC]"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      mini
                    </span>
                  </div>
                )}

                {gameMode !== 'micro' && (
                  <div
                    className={moreGamesClasses}
                    onClick={() =>
                      (window.location.href = 'https://micro.nerdlegame.com/')
                    }
                  >
                    <img
                      src="/micro-nerdle-512.png"
                      className="h-11 mx-auto"
                      alt="micro nerdle"
                    />
                    <span
                      className="text-[#398874] dark:text-[#D7DADC]"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      micro
                    </span>
                  </div>
                )}
              </div>

              <div className="relative mt-4 pb-0 mx-auto text-center justify-center items-center mt-4 text-center  dark:text-[#D7DADC]">
                <div id="nerdlegame_D_2"></div>
                <div id="nerdlegame_M_2"></div>

                <hr />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
