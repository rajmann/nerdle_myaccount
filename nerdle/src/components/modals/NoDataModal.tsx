import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, TranslateIcon } from '@heroicons/react/outline'
import {
  FacebookIcon,
  TwitterIcon,
} from "react-share";
import { doTranslateLink } from '../../lib/translate'

type Props = {
  isOpen: boolean
  handleClose: () => void
  handleLogEvent: (val: string) => void
}

export const NoDataModal = ({ isOpen, handleClose, handleLogEvent }: Props) => {

  const [showQuestions, setShowQuestions] = useState(false)

  // Define the button data
  const buttonData = [
    {
      text: "I'm using private/incognito mode",
      logEvent: 'nd_private_mode',
    },
    {
      text: 'My browser clears site data automatically',
      logEvent: 'nd_clear_data_auto',
    },
    {
      text: 'I manually clear my cookies/storage',
      logEvent: 'nd_clear_data_manual',
    },
    {
      text: "I'm using a different device or browser",
      logEvent: 'nd_different_device',
    },
    {
      text: 'I have no idea, just let me play!',
      logEvent: 'nd_no_idea',
    },
  ]

  // Shuffle the button data
  const shuffledButtons = buttonData.sort(() => Math.random() - 0.5)


  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => { }}
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
            <div id="infoText" className="inline-block align-bottom bg-white dark:bg-gray-800  dark:text-[#D7DADC] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div className="absolute left-4 top-4">
                {/* <TranslateIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => doTranslateLink(document.getElementById('infoText')?.innerText || '')}
                /> */}
              </div>
              <div className="absolute right-4 top-4">
                {/* <XCircleIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => handleClose()}
                /> */}
              </div>
              <div>
                <div>
                  <Dialog.Title
                    as="h1"
                    className="text-lg leading-6 font-medium text-gray-900  dark:text-white nerdle-name"
                  >
                    {/* <img src="/logo192.png" width="50%" style={{ paddingTop: 30 }}></img> */}
                    nerdle

                  </Dialog.Title>
                  <div className="mt-2">




                    {!showQuestions && (

                      <p>

                        <h3 style={{ paddingTop: '1em' }}>It looks like you might be new here?</h3>
                        <p className="mt-2 text-sm text-gray-500  dark:text-[#D7DADC]">
                          We couldn't find any game history.
                        </p>

                        <button
                          className="bg-[#820458] w-full hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none"
                          onClick={() => {
                            handleLogEvent('nd_new_user')
                            handleClose()
                          }}
                        >
                          Yes, I'm new to Nerdle
                        </button>

                        <button
                          className="bg-[#820458] w-full hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none"
                          onClick={() => {
                            setShowQuestions(true)
                            handleLogEvent('nd_played_before')
                          }}
                        >
                          Nope, I've played before
                        </button>

                      </p>)}

                    {showQuestions && (
                      <p>

                        <h3 style={{ paddingTop: '1em' }}>Please select an option below.</h3>
                        <p className="mt-2 text-sm text-gray-500  dark:text-[#D7DADC]">
                          We're just trying to work out why we can't find any game history. Any ideas?
                        </p>


                        {/* Render shuffled buttons */}
                        {shuffledButtons.map((button, index) => (
                          <button
                            key={index}
                            className="bg-[#398874] w-full hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none"
                            onClick={() => {
                              handleClose()
                              handleLogEvent(button.logEvent)
                            }}
                          >
                            {button.text}
                          </button>
                        ))}

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
