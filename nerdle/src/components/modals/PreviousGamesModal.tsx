import { Fragment, useState, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'


type Props = {
    isOpen: boolean
    gameMode: string
    handleClose: () => void
}

export const PreviousGamesModal = ({ isOpen, gameMode, handleClose }: Props) => {

    let today = new Date()
    const todayStr = today.toISOString().slice(0, 10)
    let yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().slice(0, 10)

    const [selectedDate, setSelectedDate] = useState(yesterdayStr)
    let playButton = useRef(null)

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={handleClose}
                initialFocus={playButton}
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

                            </div>
                            <div className="absolute right-4 top-4">
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
                                        className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC] pl-8 pr-8"
                                    >
                                        Play a previous game
                                    </Dialog.Title>
                                    <div className="mt-2">

                                        <p>Choose a date:</p>

                                        <input className="mt-2 w-[150px] border-sollid border-2 rounded-lg dark:text-black"
                                            type="date"
                                            min="2022-01-20"
                                            max={todayStr}
                                            value={selectedDate}
                                            onChange={(e) => { setSelectedDate(e.target.value)}}
                                        />

                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                className="justify-center w-[150px] rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                                onClick={() => {

                                                    // is selectedData < 2022-01-20
                                                    if (selectedDate < '2022-01-20') {
                                                        alert('Please select a date after 2022-01-20')
                                                        return
                                                    }

                                                    // is selectedData > today
                                                    if (selectedDate > todayStr) {
                                                        alert('Please select a date before today')
                                                        return
                                                    }

                                                    const dateStr = selectedDate.replace(/-/g, '')
                                                    window.location.href = `/${dateStr}`
                                                }}
                                                ref={playButton}
                                            >Play</button>
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
