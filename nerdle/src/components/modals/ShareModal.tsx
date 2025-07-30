import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
//import { CheckIcon } from '@heroicons/react/outline'
import { MiniGrid } from '../mini-grid/MiniGrid'
import { XCircleIcon } from '@heroicons/react/outline'
import {
    EmailShareButton,
    FacebookShareButton,
    WhatsappShareButton,
    TwitterShareButton,
    LinkedinShareButton
  } from "react-share";

  import {
    EmailIcon,
    FacebookIcon,
    WhatsappIcon,
    TwitterIcon,
    LinkedinIcon,
  } from "react-share";
import {isMobile} from 'react-device-detect';
import { postToFlutter } from '../../lib/isPWA';

declare var window: any

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  handleShare: () => void
  solution: string
}

export const ShareModal = ({
  isOpen,
  handleClose,
  guesses,
  handleShare,
  solution
}: Props) => {
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
              <div className="absolute right-4 top-4 dark:text-[#D7DADC]">
                <XCircleIcon
                  aria-label="Close"
                  aria-hidden={false}
                  role="navigation"
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => handleClose()}
                />
              </div>
              <div>
                {/* <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div> */}
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC]"
                  >
                    We'd love you to tell your friends about Nerdle!
                  </Dialog.Title>
                  <div className="mt-2">
                    <MiniGrid guesses={guesses} solution={solution}/>
                    <p className="text-sm text-gray-500 dark:text-[#D7DADC]">If you complete the game first and then share you can also show them how you did today!</p>
                  </div>
                </div>
              </div>
              
              {!isMobile && (
              <div className="mt-3 text-center sm:mt-5 space-x-2 dark:text-[#D7DADC]">

                <EmailShareButton url="https://nerdlegame.com" subject="Try Nerdle - the daily numbers game" body="You'll love this:"
                className="focus:outline-none">
                    <EmailIcon size={36} round={true}/>
                </EmailShareButton>

                <FacebookShareButton url="https://nerdlegame.com" quote="Try Nerdle - the daily numbers game" hashtag="#nerdle"
                className="focus:outline-none">
                    <FacebookIcon size={36} round={true}/>
                </FacebookShareButton>

                <TwitterShareButton url="https://nerdlegame.com" title="Try Nerdle - the daily numbers game" hashtags={["nerdle"]}
                className="focus:outline-none">
                    <TwitterIcon size={36} round={true}/>
                </TwitterShareButton>

                <LinkedinShareButton url="https://nerdlegame.com" title="Try Nerdle - the daily numbers game"
                className="focus:outline-none">
                    <LinkedinIcon size={36} round={true}/>
                </LinkedinShareButton>

                <WhatsappShareButton url="https://nerdlegame.com" title="Try Nerdle - the daily numbers game"
                className="focus:outline-none">
                    <WhatsappIcon size={36} round={true}/>
                </WhatsappShareButton>

              </div>
              )}

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => {

                    if (navigator.share) {
                        navigator
                          .share({
                            title: 'Nerdle - the daily numbers game',
                            text: 'Try Nerdle - the daily numbers game',
                            url: document.location.href
                          })
                          .then(() => {
                            console.log('Successfully shared');
                          })
                          .catch(error => {
                            console.error('Something went wrong sharing the score', error);
                          });
                    } else {
                        console.log('No native share support .. post to app')
                        if (window.navigator.userAgent.includes('Nerdle/1.0') || window.isMobileApp) {
                          //send message to native app
                          postToFlutter('share:Try Nerdle - the daily numbers game: ' + document.location.href)
                        }
                    }
                    
                    navigator.clipboard.writeText(
                        'Play Nerdle - the daily numbers game - https://nerdlegame.com #nerdle'
                      )
                    handleShare()
                  }}
                >
                 {isMobile ? "Share" : "Copy to clipboard"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
