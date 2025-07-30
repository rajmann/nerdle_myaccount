import { Fragment } from 'react'
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
  isUK: boolean
  handleLogEvent: (val:string) => void
}

export const PositiveNumbersModal = ({ isOpen, handleClose, isUK, handleLogEvent }: Props) => {

  //const pwaMode = localStorage.getItem('pwa') === 'true'

  const donateLink = isUK ? 'https://www.savethechildren.org.uk/donate-hub-rgpp' : 'https://support.savethechildren.org/site/Donation2?df_id=1620&1620.donation=form1';
  const donateEvent = isUK ? 'donate_stc_uk_click' : 'donate_stc_row_click';

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
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
                <TranslateIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => doTranslateLink(document.getElementById('infoText')?.innerText || '')}
                />
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

                 <div className="flex mx-auto mt-8 text-left cursor-pointer text-[20px] items-center text-[#820458] dark:text-[#C80458]">
                    <img src="/positive_numbers.png" alt="Logo" style={{ height: 24, marginRight:5 }} /> Positive numbers
                 </div>  

                <div className="text-left">
       
         

                  <div className="mt-4">


                    <p className="text-sm text-gray-500  dark:text-[#D7DADC]">
                    Our mission is to make math(s) more accessible and even a little less scary for everyone.  Our nerdle games are intended to be challenging, fun and educational.  But not everyone has the same opportunity to learn these skills.  
                    With your support, our positive numbers initiative aims to make a positive impact on child numeracy.
                                       </p>

                    <p className="text-sm text-gray-500 mt-4  dark:text-[#D7DADC]">
                    We are big fans of Save The Children’s <a  className="underline font-bold focus:outline-none" href="https://www.savethechildren.org/us/what-we-do/education/a-world-with-no-math" target="_new">‘Numeracy Boost’</a> programme, 
                    helping develop math(s) skills inside and outside the classroom.  Please support Numeracy Boost and Save The Children’s other great projects by donating what you can.
                    </p>

                    <p className="text-sm text-gray-500 mt-4 text-center">
                      <a href={donateLink} target="_new"
                          onClick={() => { handleLogEvent(donateEvent)}}>
                          <img src="/donate-stc-min.png" alt="Donate to Save The Children" className="mx-auto"/>
                      </a>
                    </p>

                    <p className="text-sm text-gray-500 mt-4  dark:text-[#D7DADC]">
                    If you would like to support our mission in other ways, please contact us at <a className="underline font-bold focus:outline-none" href="mailto:contact@nerdlegame.com">contact@nerdlegame.com</a>. 
                    </p>


                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap');
                    </style>
                    <p className="text-gray-500 mt-4 ml-2 dark:text-[#D7DADC] text-2xl" style={{fontFamily: 'Dancing Script'}}>
                        Richard and Marcus
                    </p>

                    {/* {!pwaMode && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      <a href="https://www.nerdlegame.com/donateRedirect.html?v1" target="_new">
                        <button type="button"
                          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                          Donate to support Nerdle<br />and our n+ mission
                        </button>
                      </a>
                    </p>
                    )} */}
                    
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      <a href="https://faqs.nerdlegame.com/?faq=16" target="_new" className="underline font-bold focus:outline-none">Why Nerdle?</a>
                    </p>
                    <div className="mt-4 text-center sm:mt-5 space-x-2 flex justify-center">
                      <a href="https://www.facebook.com/nerdlegame" target="_new">
                        <FacebookIcon size={36} round={true}/>
                      </a>
                      
                      <a href="https://twitter.com/nerdlegame" target="_new">
                        <TwitterIcon size={36} round={true}/>
                      </a>
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
