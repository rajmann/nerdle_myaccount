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
  handleClose: () => void
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
        onClose={() =>{
          handleLogEvent('abt_close')
          handleClose()
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
              className="inline-block align-bottom bg-white dark:bg-gray-800  dark:text-[#D7DADC] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6  w-[500px] z-[9999] relative"
            >
              <div className="absolute left-4 top-4">
                {/* <TranslateIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => doTranslateLink(document.getElementById('infoText')?.innerText || '')}
                /> */}
              </div>
              <div className="absolute right-4 top-4">
                <XCircleIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => {
                    handleLogEvent('abt_close')
                    handleClose()
                  }}
                />
              </div>
              <div>
                <div className="text-center">
                  {/* <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC]"
                  >
                    About
                  </Dialog.Title> */}
                  <div className="mt-2">
                    <div style={{ position: 'absolute', top: 0 }}>
                      <img style={{width:'60%'}} src="/numbot_help_min.webp?v3" />
                    </div>

                    <div style={{ height: '60px' }}></div>

                    <p className={'dark:text-white nerdle-name'}>
                      <span className={'dark:text-white nerdle-sub-name'}>
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
                        'text-[1rem] text-gray-500  dark:text-[#D7DADC] mt-3'
                      }
                    >
                      {/* Find the hidden calculation {gameMode == 'instant' ? 'in 1 go' : 'in 6 tries'} */}
                      {getGameInfo(gameMode)?.description}
                    </p>

                    <div text-align="center"><img style={{width:'80%', margin:"auto"}} src={getGameInfo(gameMode)?.image} /></div>   

                    <p>
                      <button
                        className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none"
                        onClick={() => {
                          ReactPixel.trackCustom('PlayPressed', { gameMode: gameMode })
                          handleLogEvent('abt_play')
                          handleClose()
                        }}
                      >
                        play now
                      </button>
                    </p>
                      
                    {(doAdventPreview || doAdvent) && (
                    <div className="mt-2 rounded border-[rgb(255,0,0)] border-2">
                        <span className="mt-2 font-bold" style={{color: 'rgb(255,0,0)'}}>
                          {doAdventPreview ? "Charity add-vent - starts 1 December" : "Seasonal challenges"}
                        </span>

                        <img className="px-2 pb-2" src="https://www.nerdlegame.com/advent24/assets/images/addvent24-share.png" />
                        <a href='https://www.nerdlegame.com/advent24/index.html' target="_blank" rel="noreferrer">
                          <button 
                            className="bg-[rgb(255,0,0)] hover:bg-gray-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none"
                            onClick={() => { handleLogEvent('advent24_splash_banner')}}
                          >
                            {doAdventPreview ? 'preview' : 'play 𝒳math games'}
                          </button>
                        </a>
                    </div>)}

                    <div className="grid grid-cols-8 gap-1 mt-2">
                      <div className="text-center col-span-4">

                        {/* <p> */}
                        <button
                          className="bg-white drop-shadow hover:bg-gray-700 text-black font-bold py-2 px-4 rounded mt-2 focus:outline-none"
                          onClick={() => {
                            handleLogEvent('abt_how')
                            handleHelp()
                          }}
                        >
                          how to play
                        </button>
                        {/* </p> */}
                      </div>
                      <div className="text-center col-span-4">
                        {/* <p> */}
                        <button
                          className="bg-[#398874] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none"
                          onClick={() => {
                            handleLogEvent('abt_more')
                            window.location.href = 'https://www.nerdlegame.com'
                          }}
                        >
                          more games
                        </button>
                        {/* </p> */}
                      </div>
                    </div>

                    <div className={'text-gray-500  dark:text-[#D7DADC]'} style={{fontSize:'0.7rem', marginTop:'10px', marginBottom:'1px'}}><span className={'dark:text-white nerdle-name'} style={{fontSize:'0.7rem'}}><b>nerdle</b></span>: <i>a daily numbers game, inspired by Wordle and a love of math, solved using colored clues and a process of elimination.</i></div>

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

                        <p
                          className={
                            'text-[1.2rem] text-gray-500  dark:text-[#D7DADC] mt-6'
                          }
                        >
                          Upgrade with a free{' '}
                          <span className={'dark:text-white nerdle-name'}>
                            nerdle
                          </span>{' '}
                          account
                        </p>

                        <p
                          className={
                            'text-[1.2rem] text-gray-500  dark:text-[#D7DADC] mt-1'
                          }
                        >
                          <span className="underline cursor-pointer" onClick={() => handleLogin()}>log in / sign up</span>
                        </p>
                      </>)}

                    {stats.gamesPlayed > 5 && (
                      <p
                        onClick={() => {
                          localStorage.setItem('showInfoPop', 'false')
                          handleClose()
                        }}
                        style={{ marginTop: "10px", marginBottom: "-15px" }}
                        className="underline cursor-pointer mt-4 text-xs  text-gray-500  dark:text-[#D7DADC]">
                        Don't show this again
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}