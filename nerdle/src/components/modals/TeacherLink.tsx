import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, ArrowCircleUpIcon, ArrowCircleDownIcon } from '@heroicons/react/outline'
import QRCode from "react-qr-code";


type Props = {
  isOpen: boolean
  handleClose: () => void
  link: string
  gameName: string
}

export const TeacherLink = ({ isOpen, handleClose, link, gameName }: Props) => {

  const [position, setPosition] = useState("middle")

  const linkWithOutHttp = link.replace('https://', '').replace('http://', '')

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
            <div id="infoText" className="h-[500px] inline-block align-bottom bg-white dark:bg-gray-800  dark:text-[#D7DADC] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
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
                    Game link
                  </Dialog.Title>
                  <div className="mt-2">

                    <div className="text-center col-span-4  mb-2 mt-2 h-[2rem] pr-2 ">
                      <span className="ml-auto mb-4 font-bold h-[2rem] w-50">
                      <a className="underline pointer focus:outline-none" href={link}>{gameName}<br /><span className="text-xs">{linkWithOutHttp}</span></a></span>
                      <div>

                      <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%", marginTop:10 }}
                        value={link}
                        viewBox={`0 0 256 256`}
                      />

                      </div>
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
