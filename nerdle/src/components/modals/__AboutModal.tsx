import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, TranslateIcon } from '@heroicons/react/outline'
import { FacebookIcon, TwitterIcon } from 'react-share'
import { doTranslateLink } from '../../lib/translate'
import { StoredStatsState } from '../../lib/storage'
import { isNewMobileApp } from '../../lib/isPWA'
import ReactPixel from 'react-facebook-pixel';

type Props = {
  isOpen: boolean
  gameMode: string
  handleClose: (action:string) => void
  handleHelp: () => void
  handleLogin: () => void
  handleLogEvent: (log_text: string) => void
  stats: StoredStatsState
}

declare var PushService: any

export const AboutModal = ({ isOpen, gameMode, handleClose, handleHelp, handleLogin, handleLogEvent, stats }: Props) => {

  const [hasLogin, setHasLogin] = useState(false)
  const [dismissed, setDismissed] = useState(localStorage.getItem('showInfoPop') == 'false')
  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem('pushEnabled') === 'true')

  const games = [
    { name: '', title: 'classic', subtitle: '', description: 'Find the hidden calculation in 6 tries', image: '/new-images/classic-about-grid-r.png' },
    { name: 'mini', title: 'mini', subtitle: '6-digit nerdle', description: 'Find the hidden calculation in 6 tries', image: '/new-images/mini-about-grid.png' },
    { name: 'micro', title: 'micro', subtitle: '5-digit nerdle', description: 'Find the hidden calculation in 6 tries', image: '/new-images/micro-about-grid.png' },
    { name: 'maxi', title: 'maxi', subtitle: '10 digits & extra math', description: 'Find the hidden calculation in 6 tries', image: '/new-images/maxi-about-grid.png' },
    { name: 'speed', title: 'speed', subtitle: 'nerdle against the clock', description: 'Find the hidden calculation in 6 tries', image: '/gameGridImages/tile-n7-s-min.png' },
    { name: 'instant', title: 'instant', subtitle: 'just one guess', description: 'Find the hidden calculation in 1 go', image: '/gameGridImages/tile-n8-s-min.png' },
    { name: 'midi', title: 'midi', subtitle: '7-digit nerdle', description: 'Find the hidden calculation in 6 tries', image: '/new-images/midi-about-grid.png' },
    { name: 'pro', title: 'pro', subtitle: 'custom nerdles', description: 'Find the hidden calculation in ? tries', image: '/new-images/classic-about-grid-r.png' },
  ]

  const getGameInfo = (gameMode: string) => {
    return games.find((g) => g.name === gameMode)
  }

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('lbl_token')
      if (token) {
        setHasLogin(true)
      }
    }
  }, [isOpen])

  // if date is greater than 24th November but less than 1st December set doAdventPreview to true
  let doAdventPreview = false
  let doAdvent = false
  let date = new Date()
  let month = date.getMonth()
  let day = date.getDate()
  if (month === 10 && day > 24) {
    doAdventPreview = true
  }
  if (month === 11 && day >= 1) {
    doAdvent = true
  }

  return (
    <Transition.Root show={isOpen && !dismissed} as={Fragment}>
      <Dialog
        id="about-modal"
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto convert-about-hide"
        onClose={() => {
          handleLogEvent('nd_close_newpop')
          handleClose('')
        }}
      >
        <div className="flex items-start h-justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <div
              id="infoText"
              className="inline-block align-bottom  bg-[#F1F3F9] 
                         rounded-lg pt-5 text-left 
                        overflow-hidden shadow-xl transform transition-all
                        sm:align-middle sm:max-w-sm sm:w-full  w-[500px] text-center"
            >

              <div

                className="bg-[#F1F3F9]"
              >

                <div className="absolute right-4 top-4 z-[999] bg-white rounded-full p-1 w-[32px] h-[32px] cursor-pointer flex items-center justify-center"
                  style={{ "boxShadow": "0px 2.67px 10.67px 0px #00000026" }}
                  onClick={() => {
                    handleLogEvent('nd_close_newpop')
                    handleClose('')
                  }}
                >
                  <img src="/new-images/close-x.png" className="h-[11px] w-[11px] m-auto" />
                </div>
                <div>

                  <div style={{ position: 'absolute', top: 0 }}>
                    <img style={{ width: '50%' }} src="/numbot_help_min.webp?v3" />
                  </div>


                  <p className={'nerdle-name text-right mt-8 w-[80%] m-auto'}>
                    <span className={'nerdle-sub-name'}>
                      {/* {gameMode === '' ? 'classic' : gameMode} */}
                      {getGameInfo(gameMode)?.title}
                    </span>{" "}

                    nerdle
                  </p>

                  <p className="mt-2">
                    {getGameInfo(gameMode)?.subtitle}
                  </p>

                  <p
                    className={
                      'text-[1rem] text-gray-500   mt-3'
                    }
                  >
                    {/* Find the hidden calculation {gameMode == 'instant' ? 'in 1 go' : 'in 6 tries'} */}
                    {/* {getGameInfo(gameMode)?.description} */}
                  </p>

                  <div text-align="center">
                    <img style={{ width: '80%', margin: "auto" }} src={getGameInfo(gameMode)?.image} />
                  </div>

                </div>

                <div className="bg-[#F1F3F9]"
                  style={{
                    boxShadow: "0px -4px 12px 0px #00000026 inset", height: "1px", width: "100%"
                  }} />

                <div className="bg-white w-full pt-4 pb-4">

                  Are you new to Nerdle?

                  <div className="flex flex-row items-center justify-center w-[80%] m-auto mt-2">

                    <button
                      className="bg-[#398873] w-full hover:bg-gray-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none"
                      onClick={() => {
                        handleLogEvent('nd_new_user')
                        handleClose('enable_hints')
                      }}
                    >
                      Yes
                    </button>

                    <button
                      className="bg-[#398873] w-full hover:bg-gray-700 text-white font-bold py-2 px-4 ml-2 rounded focus:outline-none"
                      onClick={() => {
                        localStorage.setItem('hints', 'false')
                        handleLogEvent('nd_played_before')
                        handleClose('disable_hints')
                      }}
                    >
                      No
                    </button>

                  </div>

                  <div className={'text-gray-500 w-[80%] m-auto  text-left'}
                    style={{ fontSize: '0.7rem', marginTop: '10px', marginBottom: '1px' }}>
                    <span className={'nerdle-name'} style={{ fontSize: '0.7rem' }}><b>nerdle</b></span>: <i>a daily numbers game, inspired by Wordle and a love of math, solved using colored clues and a process of elimination.</i></div>


                    {hasLogin == false && (
                  <>
                    {isNewMobileApp() && !notificationsEnabled && (
                      <p>
                        <button
                          className="bg-white drop-shadow hover:bg-gray-700 text-black font-bold py-2 px-4 rounded mt-4 focus:outline-none"
                          onClick={() => {
                            PushService.requestPermission();
                            //localStorage.setItem('pushEnabled', 'true')
                            //window.location.reload()
                          }}
                        >
                          Enable notifications
                        </button>
                      </p>
                    )}


                  </>)}

                </div>



 

              </div>


            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}