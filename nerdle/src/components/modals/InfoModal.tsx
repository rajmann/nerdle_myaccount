import { Fragment, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Cell } from '../grid/Cell'
import { XCircleIcon, TranslateIcon, PlayIcon } from '@heroicons/react/outline'
import { doTranslateLink } from '../../lib/translate'

declare var window: any
declare var _conv_q: any

type Props = {
  isOpen: boolean
  handleClose: () => void
  gameMode: string
}

export const InfoModal = ({ isOpen, handleClose, gameMode }: Props) => {
  let closeButtonRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      window._conv_q = window._conv_q || [];
      _conv_q.push(["triggerConversion", "100481187"]);
    }
  }, [isOpen])

  const renderName = (gameMode: string) => {
    return (
      <>
        <span
          className="text-[#989484] dark:text-[#D7DADC]"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          {gameMode}
        </span>{' '}
        <span
          className="text-[#820458] dark:text-[#D7DADC]"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          nerdle
        </span>
      </>
    )
  }

  // var videoLink =
  //   'https://www.tiktok.com/@nerdlegame/video/7077517936906259717?is_from_webapp=1&sender_device=pc&web_id=7077961740898010629'
  // if (gameMode === 'mini') {
  //   videoLink =
  //     'https://www.tiktok.com/@nerdlegame/video/7080600319381507333?is_from_webapp=1&sender_device=pc&web_id=7077961740898010629'
  // }
  // if (gameMode === 'instant') {
  //   videoLink =
  //     'https://www.tiktok.com/@nerdlegame/video/7078727697987374342?is_from_webapp=1&sender_device=pc&web_id=7077961740898010629'
  // }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
        initialFocus={closeButtonRef}
      >
        <div
          id="infoText"
          className="flex items-end justify-center min-h-screen pt-4 px-4 pb-4 text-center sm:block sm:p-0 "
        >
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
              <div className="absolute left-4 top-4">
                <TranslateIcon
                  className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]"
                  onClick={() =>
                    doTranslateLink(
                      document.getElementById('infoText')?.innerText || ''
                    )
                  }
                />
              </div>
              <div className="absolute right-4 top-4 dark:text-[#D7DADC]">
                <button
                  aria-label="Home"
                  type="button"
                  onClick={() => handleClose()}
                  className="focus:outline-none"
                >
                  <XCircleIcon
                    aria-label="Close"
                    aria-hidden={false}
                    role="navigation"
                    className="h-6 w-6 cursor-pointer"
                    ref={closeButtonRef}
                  />
                </button>
              </div>
              <div>
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-[#D7DADC]"
                  >
                    {'How to play '}
                    {gameMode !== '' && gameMode !== 'pro' && (
                      <span
                        className="text-[#398874] dark:text-[#D7DADC]"
                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                      >
                        {gameMode}
                      </span>
                    )}{' '}
                    <span
                      className="text-[#820458] dark:text-[#D7DADC]"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      nerdle
                    </span>
                  </Dialog.Title>
                  <div className="mt-2">
                    {gameMode === 'speed' && (
                      <p className="text-sm text-gray-500 dark:text-[#820458] text-left mb-2">
                        {renderName(gameMode)} rules are the same as the classic
                        nerdle rules below except you play against the clock and
                        the first guess has been taken for you. But be careful,
                        some rows have time penalties. 3,2,1….go!
                      </p>
                    )}

                    {gameMode === 'mini' && (
                      <p className="text-sm text-gray-500 dark:text-[#820458] text-left mb-2">
                        {renderName(gameMode)} rules are the same as the classic
                        nerdle rules below except all calculations are just six
                        tiles instead of eight. Smaller but no less tricky!
                      </p>
                    )}

                    {gameMode === 'micro' && (
                      <p className="text-sm text-gray-500 dark:text-[#820458] text-left mb-2">
                        {renderName(gameMode)} rules are the same as the classic
                        nerdle rules below except all calculations are just five
                        tiles instead of eight. Smaller but no less tricky!
                      </p>
                    )}

                    {gameMode === 'midi' && (
                      <p className="text-sm text-gray-500 dark:text-[#820458] text-left mb-2">
                        {renderName(gameMode)} rules are the same as the classic
                        nerdle rules below except all calculations are just 7
                        tiles instead of eight. A little smaller but no less tricky!
                      </p>
                    )}

                    {gameMode === 'maxi' && (
                      <p className="text-sm text-gray-500 dark:text-[#820458] text-left mb-2">
                        {renderName(gameMode)} rules are the same as the classic
                        nerdle rules below except there are 10 tiles instead of 8 with
                        the addition of brackets, squared (<sup>2</sup>), and cubed (<sup>3</sup>) symbols! The most challenging Nerdle yet!
                      </p>
                    )}

                    {gameMode === 'pro' && (
                      <>
                        {' '}
                        <p className="text-sm text-gray-500 dark:text-[#820458] text-left mb-2">
                          {/* 
                        {renderName(gameMode)} rules are the same as below except you can create and play your own challenge.  The creator decides which symbols to use and how long the challenge is so a pro nerdle can be very simple or very hard.  Symbols can include ^ (power), ! (factorial), .(decimal) and ( ) (brackets). 
                        */}
                          You’re playing a special version of nerdle. The rules
                          are basically the same as a standard nerdle (rules
                          below), but with a few twists. If you unsure, try a
                          standard nerdle game first. The special twists can
                          include any of the following:
                          <ul className="ml-2 list-disc list-outside text-left mt-2 mb-2">
                            <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                              The first guess might be completed for you. This
                              will give you some clues as to the answer.{' '}
                            </li>
                            <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                              Sometimes the first guess includes letters or a
                              special message. However these letters won’t be in
                              the answer, which only contains numbers and
                              math(s) symbols.{' '}
                            </li>
                            <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                              As well as the normal +-/* symbols, the special
                              nerdles can also include other symbols such as 2
                              (squared), 3 (cubed), ^ (power), ! (factorial), .
                              (decimal) and ( ) (brackets).
                            </li>
                            <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                              You may be given more or less than the usual 6
                              guesses.
                            </li>
                          </ul>
                          You can create your own special nerdle at{' '}
                          <a
                            href="https://create.nerdlegame.com"
                            className="underline font-bold focus:outline-none"
                            target="_new"
                          >
                            create.nerdlegame.com
                          </a>
                        </p>
                        <hr className="mb-2" />
                      </>
                    )}

                    {gameMode === 'instant' && (
                      <p className="text-sm text-gray-500 dark:text-[#820458] text-left mb-2">
                        {renderName(gameMode)} rules are the same as below
                        except you are given one clue and there is only one
                        answer. Pay attention to the green tile in the clue.
                      </p>
                    )}

                    <p className="text-sm text-gray-500 dark:text-[#D7DADC] text-left ">
                      Guess the NERDLE in 6 tries. After each guess, the color
                      of the tiles will change to show how close your guess was
                      to the solution.{' '}
                      {/* <a
                        className="underline font-bold focus:outline-none"
                        href={videoLink}
                        target="_new"
                      >
                        <PlayIcon
                          style={{ height: 24, width: 24, display: 'inline' }}
                        />
                        Watch a video
                      </a>
                      . */}
                    </p>

                    <p className="text-center">
                      <img src="/nerdle-explainer.gif" />
                    </p>



                    <p className="text-sm text-gray-500 dark:text-[#D7DADC] mt-2">
                      <h4 className="mb-1 font-medium text-gray-900 dark:text-[#D7DADC]">
                        Rules
                      </h4>
                      <ul className="ml-2 list-disc list-outside text-left">
                        <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                          Each guess is a calculation.
                        </li>
                        <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                          You can use 0 1 2 3 4 5 6 7 8 9 + - * / or =.
                        </li>
                        <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                          It must contain one “=”.
                        </li>
                        <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                          It must only have a number to the right of the “=”,
                          not another calculation.
                        </li>
                        <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                          <a
                            href="https://faqs.nerdlegame.com/?faq=order"
                            target="_new"
                            className="underline font-bold focus:outline-none"
                          >
                            Standard order of operations
                          </a>{' '}
                          applies, so <b>calculate</b> * and / before + and -
                          eg. 3+2*5=13 <b>not</b> 25!{' '}
                        </li>
                        <li className="text-sm text-gray-500 dark:text-[#D7DADC]">
                          If the answer we're looking for is 10+20=30, then we
                          will accept 20+10=30 too (unless you turn off '
                          <a
                            href="https://faqs.nerdlegame.com/?faq=commutativity"
                            target="_new"
                            className="underline font-bold focus:outline-none"
                          >
                            commutative answers
                          </a>
                          ' in settings).
                        </li>
                      </ul>
                    </p>

                    <div></div>

                    <div className="flex justify-center mb-1 mt-4">
                      <Cell value="9" status="correct" size="small" />
                      <Cell value="*" size="small" />
                      <Cell value="2" size="small" />
                      <Cell value="0" size="small" />
                      <Cell value="=" size="small" />
                      <Cell value="1" size="small" />
                      <Cell value="8" size="small" />
                      <Cell value="0" size="small" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-[#D7DADC]">
                      9 is in the solution and in the correct spot.
                    </p>

                    <div className="flex justify-center mb-1 mt-4">
                      <Cell value="9" size="small" />
                      <Cell value="*" size="small" />
                      <Cell value="2" status="present" size="small" />
                      <Cell value="0" size="small" />
                      <Cell value="=" size="small" />
                      <Cell value="1" size="small" />
                      <Cell value="8" size="small" />
                      <Cell value="0" size="small" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-[#D7DADC]">
                      2 is in the solution but in the wrong spot.
                    </p>

                    <div className="flex justify-center mb-1 mt-4">
                      <Cell value="9" size="small" />
                      <Cell value="*" size="small" />
                      <Cell value="2" size="small" />
                      <Cell value="0" size="small" />
                      <Cell value="=" size="small" />
                      <Cell value="1" status="absent" size="small" />
                      <Cell value="8" size="small" />
                      <Cell value="0" size="small" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-[#D7DADC]">
                      1 is not in the solution in any spot.
                    </p>

                    <p className="text-sm text-gray-500 mt-4 dark:text-[#D7DADC]">
                      If your guess includes, say, two 1s but the answer has
                      only one, you will get one color tile and one black.
                    </p>

                    <p className="text-sm text-gray-500 mt-4 dark:text-[#D7DADC]">
                      Tiles will only go green if the number is in the correct
                      position or when a full guess is rearranged as a winning{' '}
                      <a
                        href="https://faqs.nerdlegame.com/?faq=commutativity"
                        target="_new"
                        className="underline font-bold focus:outline-none"
                      >
                        commutative
                      </a>{' '}
                      answer.
                    </p>

                    <p className="text-sm text-gray-500 mt-4 dark:text-[#D7DADC]">
                      For more help{' '}
                      <a
                        href="https://faqs.nerdlegame.com/"
                        target="_new"
                        className="underline font-bold focus:outline-none"
                      >
                        see our FAQs
                      </a>
                      .{' '}
                      <a
                        href="https://faqs.nerdlegame.com/?faq=16"
                        target="_new"
                        className="underline font-bold focus:outline-none"
                      >
                        Why Nerdle?
                      </a>
                    </p>
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
