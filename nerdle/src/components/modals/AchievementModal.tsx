import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, UploadIcon } from '@heroicons/react/outline'


import './cards.css'

import { postToFlutter } from '../../lib/isPWA'

declare var window: any

type Props = {
  isOpen: boolean
  handleClose: () => void
  handleStats: () => void
  handleLogEvent: (log_text: string) => void
  largeImage: string
}

{/* MJT - need to add in logic to open modal from winmodal first time that a new badge is achieved */ }

export const AchievementModal = ({
  isOpen,
  handleClose,
  handleStats,
  handleLogEvent,
  largeImage,
}: Props) => {

  const LBLToken = localStorage.getItem('lbl_token') || ''

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
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
                  onClick={() => handleClose()}
                />
              </div>
              <div>
                <div className="absolute top-0 left-0">
                  {/*<img src="/numbot_winner.png" className="h-[120px]" />*/}
                </div>

                <div className="h-0" />

                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC]"
                    style={{ marginTop: '10px' }}
                  >
                    <b>Congratulations!</b>
                  </Dialog.Title>
                  <Dialog.Title
                    as="h2"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC]"
                    style={{ marginTop: '10px' }}
                  >
                    You've earned a new badge
                  </Dialog.Title>
                </div>
                <div className="badge-image-large shake5">
                  <img id="imageToShare" src={largeImage} alt='' /> {/* MJT make dynamic */}
                </div>

              </div>

              <div className="mt-5 sm:mt-6 text-center">
                <button
                  type="button"
                  className="inline-flex justify-center w-full max-w-[320px] rounded-md border border-black shadow-sm px-4 py-2 bg-[#E4E3E0] text-base font-medium text-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-m"
                  onClick={() => {
                    {/*MJT add image share function*/ }
                    //handleLogEvent('winmodal_share_win')
                    console.log('share image', largeImage)

                    // split largeImage by /
                    const parts = largeImage.split('/')
                    const badgeType = parts[4]
                    const lastPart = parts[parts.length - 1]
                    const badgeNumber = lastPart.split('.')[0]

                    let badgeGameMode  = ""
                    if (badgeType === 'straights') {
                      badgeGameMode = parts[6]
                    }

                    const theUrl = `https://clue.nerdlegame.com/badge/${badgeType}.${badgeNumber}.${badgeGameMode}`

                    if (navigator.share) {
                      navigator
                        .share({
                          url: theUrl
                        })
                        .then(() => {
                          console.log('Successfully shared');
                        })
                        .catch(error => {
                          console.error('Something went wrong sharing the badge', error);
                        });
                    } else {
                      console.log('No native share support .. post to app')
                      if (window.navigator.userAgent.includes('Nerdle/1.0') || window.isMobileApp) {
                        //send message to native app
                        postToFlutter('share:Someone just earned their nerdle badge: ' + theUrl)
                      }
                    }

                    navigator.clipboard.writeText(theUrl)

                    handleLogEvent(`share_award_badge_${badgeType}_${badgeNumber}_${badgeGameMode}` + LBLToken == '' ? '_unregistered' : '_registered')

                  }}
                >
                  <b>Share</b> &nbsp;&nbsp;&nbsp;
                  <UploadIcon
                    aria-label="Close"
                    aria-hidden={false}
                    role="navigation"
                    className="h-6 w-6 cursor-pointer"
                  // onClick={() => 
                  // {

                  //   // so here we want to share the image using the navigator.share API
                  //   shareImage(largeImage)


                  // }}
                  />

                </button>
              </div>


              <div onClick={() => {
                handleStats();
                handleClose()
              }
              } className="pt-2 mt-2 text-sm cursor-pointer text-center dark:text-[#D7DADC]" >
                For more badges, <u>view your profile</u>
              </div>

            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
