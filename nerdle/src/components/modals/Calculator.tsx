import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, ArrowCircleUpIcon, ArrowCircleDownIcon } from '@heroicons/react/outline'
//import { Adsense } from '@ctrl/react-adsense';
import { Keyboard } from '../keyboard/Keyboard'
import { evaluate } from '../../lib/evaluate'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const Calculator = ({ isOpen, handleClose }: Props) => {

  const [calcValue, setCalcValue] = useState('')
  //const [calcAnswer, setCalcAnswer] = useState('')
  const [position, setPosition] = useState("middle")

  const onChar = (value: string) => {
    if (value === 'AC') {
      setCalcValue('')
      //setCalcAnswer('')
    } else {
      setCalcValue(calcValue + value)
    }

  }

  const onDelete = () => {
    setCalcValue(calcValue.slice(0, -1))
  }

  const onEnter = () => {
    setCalcValue(evaluate(calcValue))
  }

  //let adSlot = "2993978787"
  // if (isAndroid && isRunningInPWA()) { adSlot = "9091668603" }
  // if (isIOS && isRunningInPWA()) { adSlot = "2446369200" }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="flex items-end justify-center min-h-[100vh]  pt-4 px-4 pb-20 text-center sm:block sm:p-0" id="calculatorModal">
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

              </div>
              <div className="absolute right-4 top-4 flex">

                <ArrowCircleUpIcon
                  aria-label="Move up"
                  aria-hidden={false}
                  role="navigation"
                  className={"h-6 w-6 cursor-pointer " + (position == "top" ? "text-gray-400" : "")}
                  onClick={() => {
                    var obj = document.getElementById("calculatorModal")
                    if (obj) {
                      obj.style.alignItems = position == "bottom" ? "flex-end" : "flex-start"
                      obj.style.paddingBottom = position == "bottom" ? "5rem" : "1rem"
                    }
                    obj = document.getElementById("infoText")
                    if (obj) {
                      obj.style.verticalAlign = position == "middle" ? "top" : "middle"
                    }
                    setPosition(position == "middle" ? "top" : "middle")
                  }}
                />
                <ArrowCircleDownIcon
                  aria-label="Move down"
                  aria-hidden={false}
                  role="navigation"
                  className={"h-6 w-6 cursor-pointer " + (position == "bottom" ? "text-gray-400" : "")}
                  onClick={() => {
                    var obj = document.getElementById("calculatorModal")
                    if (obj) {
                      obj.style.alignItems = "flex-end"
                      obj.style.paddingBottom = position == "middle" ? "1rem" : "5rem"
                    }
                    obj = document.getElementById("infoText")
                    if (obj) {
                      obj.style.verticalAlign = position == "top" ? "middle" : "bottom"
                    }
                    setPosition(position == "top" ? "middle" : "bottom")
                  }}
                />

                <XCircleIcon
                  aria-label="Close"
                  aria-hidden={false}
                  role="navigation"
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => handleClose()}
                />
              </div>
              <div>
                <div className="text-center dark:text-white text-black">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC]"
                  >
                    Calculator
                  </Dialog.Title>
                  <div className="mt-2">

                    <div className="text-right col-span-4 border-black dark:border-white border-solid border-2 mb-2 mt-2 h-[2rem] pr-2">
                      <span className="ml-auto mb-2 text-2xl font-bold h-[2rem] taxt-right w-50">{calcValue}</span>
                    </div>

                    <div className="text-black">
                      <Keyboard
                        onChar={onChar}
                        onDelete={onDelete}
                        onEnter={onEnter}
                        guesses={[]}
                        solution={"123456789"}
                        additionalKeys={['AC']}
                        ommittedKeys={[]}
                        noEquals={true}
                        gameMode={""}
                      />
                    </div>

                    <div className="relative mt-4 pb-0 mx-auto text-center justify-center items-center mt-4 text-center  dark:text-[#D7DADC]">
                      {/* 
                      <Adsense
                        client="ca-pub-1008130700664775"
                        slot={adSlot}
                        style={{ display: 'inline-block', width: 320, height: 100 }}
                        format=""
                      /> */}

                      <div id="nerdlegame_D_2"></div>
                      <div id="nerdlegame_M_2"></div>

                    </div>


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
