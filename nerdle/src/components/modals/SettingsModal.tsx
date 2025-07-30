import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  XCircleIcon,
  QuestionMarkCircleIcon,
  HomeIcon,
} from '@heroicons/react/outline'
import { useState, useEffect } from 'react'
import Switch from 'react-switch'
import { FacebookIcon, TwitterIcon } from 'react-share'
import { api_url } from '../../index'
import { getProfile, updatePreferences, sendEmailVerification, removeAccount } from '../../lib/cloudStats'
import { isNewMobileApp, postToFlutter } from '../../lib/isPWA'

type Props = {
  isOpen: boolean
  handleClose: () => void
  handleUpdate: (action: number) => void
}

declare var PushService: any

export const SettingsModal = ({ isOpen, handleClose, handleUpdate }: Props) => {
  const [colorBlind, setColorBlind] = useState(
    localStorage.getItem('colorBlindMode') === 'true'
  )
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkModeNew') === 'true'
  )
  //const [miniMode, setMiniMode] = useState(localStorage.getItem('gameMode')==='mini');
  const [acceptCommut, setAcceptCommut] = useState(
    (localStorage.getItem('disallowCommut') || 'false') === 'false'
  )
  const [winAnimations, setWinAnimations] = useState(
    (localStorage.getItem('disableWinAnimations') || 'false') === 'false'
  )
  //const [flexInput, setFlexInput] = useState(localStorage.getItem('flexInput') === 'true')
  const [disableAdsTimestamp, setDisableAdsTimestamp] = useState(
    localStorage.getItem('disableAdsTimestamp') || ''
  )
  const [loggedInUser, setLoggedInUser] = useState(
    (localStorage.getItem('lbl_token') || '') !== ''
  )

  const [marketing, setMarketing] = useState(
    (localStorage.getItem('marketing') || 'true') === 'true'
  )

  const [useLocalTime, setUseLocalTime] = useState( localStorage.getItem('useLocalTime') || 'false' )

  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem('pushEnabled')==='true')
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [updatesOptIn, setUpdatesOptIn] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [email, setEmail] = useState('')
  const [profileId, setProfileId] = useState('')
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [isMobileApp, setIsMobileApp] = useState(false)

  const handleImport = () => {
    // ask for stats and import
    const statsImport = window.prompt(
      'Paste your exported stats code here. To export stats, click the "Export" button in the stats window.'
    )
    if (statsImport) {
      // warn that this will overwrite your current stats
      let importStats = window.confirm(
        'This will overwrite any existing stats. Are you sure you want to continue?'
      )
      if (importStats === true) {
        try {
          const statsImportString = atob(statsImport.trim())
          if (window.location.href.includes('?de')) {
            localStorage.setItem('deviceStatsState', statsImportString)
          } else {
            localStorage.setItem('statsState', statsImportString)
          }
          alert('Stats imported')
          window.location.reload()
        } catch {
          alert('Invalid stats code')
        }
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('lbl_token')
    localStorage.removeItem('userEmail')

    if (isNewMobileApp()) {
      postToFlutter('logout')
    }

    window.location.reload()
  }

  const handleCloseAccount = () => {
    // ask for confirmation
    let closeAccount = window.confirm(
      'Are you sure you want to delete your account?'
    )
    if (closeAccount === true) {
      removeAccount(profileId, (data) => {
        console.log(data)
        alert('Your account has been deleted')
        localStorage.removeItem('lbl_token')
        localStorage.removeItem('userEmail')
        window.location.reload()
      })
    }
  }

  // const handleSetMarketingPreferences = (marketing: boolean) => {
  //   // send request to server
  //   fetch(`${api_url}/setMarketingPreferences`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'token': localStorage.getItem('userToken') || ''
  //     },
  //     body: JSON.stringify({
  //       marketing: marketing,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status=='ok') {
  //         //alert('Marketing preferences updated')
  //         localStorage.setItem('marketing', marketing.toString())
  //         setMarketing(marketing)
  //       } else {
  //         alert('Error: ' + data.msg)
  //       }
  //     })
  // }

  useEffect(() => {
    if (isOpen) {

      getProfile((data) => {

        const updatesOptOut = data ? data.updatesOptOut === 0 ? false: true: false;
        const marketingOptIn = data ? data.marketingOptIn === 0 ? false: true: false;
        const isVerified = data ? data.isVerified === undefined ? true: data.isVerified: false;
        const email = data ? data.email : '';
        const id = data ? data.id : '';

        setUpdatesOptIn(!updatesOptOut)
        setMarketingOptIn(marketingOptIn)
        setIsVerified(isVerified)
        setEmail(email)
        setProfileId(id)
        setProfileLoaded(true)
        setLoggedInUser(id!=='')

      })

      // get useragent string
      const userAgent = window.navigator.userAgent
      // if "Nerdle/1.0" in userAgent then set isMobileApp to true
      // if (userAgent.includes('Nerdle/1.0')) {
      //   setIsMobileApp(true)
      // }
      setIsMobileApp(isNewMobileApp());

    }
  },[isOpen])

  useEffect(() => {

    if (profileLoaded) {
      console.log('need to update ... ')
      updatePreferences({ 
        marketingOptIn: marketingOptIn, updatesOptOut: !updatesOptIn
      }, (data) => {
        console.log(data)
      });
    }

  },[profileLoaded, updatesOptIn, marketingOptIn])

  const doSendEmailVerification = () => {
    sendEmailVerification(email, (data) => {
      console.log(data)
      alert('We have sent you an email with a link to verify your email address.')
    })
  }

  useEffect(() => {
    if (notificationsEnabled == true) {
      PushService.requestPermission();
    }
  },[notificationsEnabled])


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
                    Options
                  </Dialog.Title>

                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-6 ">
                      <div className="pb-0">
                        Dark theme
                        <div className="text-sm">{''}</div>
                      </div>
                    </div>
                    <div className="text-right col-span-2">
                      <Switch
                        checked={darkMode}
                        onChange={(checked) => {
                          setDarkMode(checked)
                          var element = document.getElementById('html')
                          element?.classList.toggle('dark')
                          localStorage.setItem(
                            'darkModeNew',
                            checked.toString()
                          )
                          handleUpdate(3)
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-6 ">
                      <div className="pb-0">
                        Colorblind mode
                        <div className="text-sm">Higher contrast colors</div>
                      </div>
                    </div>
                    <div className="text-right col-span-2">
                      <Switch
                        checked={colorBlind}
                        onChange={(checked) => {
                          setColorBlind(checked)
                          localStorage.setItem(
                            'colorBlindMode',
                            checked.toString()
                          )
                          handleUpdate(1)
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-6 ">
                      <div className="pb-0">
                        Allow commutative answers
                        <div className="text-sm">
                          (a+b = b+a){' '}
                          <a
                            href="https://faqs.nerdlegame.com/?faq=14"
                            target="_new"
                            className="focus:outline-none"
                          >
                            <QuestionMarkCircleIcon className="h-6 w-6 cursor-pointer inline" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right col-span-2">
                      <Switch
                        checked={acceptCommut}
                        onChange={(checked) => {
                          setAcceptCommut(checked)
                          localStorage.setItem(
                            'disallowCommut',
                            (!checked).toString()
                          )
                          handleUpdate(4)
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-6 ">
                      <div className="pb-0">
                        Win animations enabled
                        <div className="text-sm">Tiles dance when you win</div>
                      </div>
                    </div>
                    <div className="text-right col-span-2">
                      <Switch
                        checked={winAnimations}
                        onChange={(checked) => {
                          setWinAnimations(checked)
                          localStorage.setItem(
                            'disableWinAnimations',
                            (!checked).toString()
                          )
                          handleUpdate(7)
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-6 ">
                      <div className="pb-0">
                        Use local time
                        <div className="text-sm">Set game to change at local midnight</div>
                      </div>
                    </div>
                    <div className="text-right col-span-2">
                      <Switch
                        checked={useLocalTime === 'true'}
                        onChange={(checked) => {
                          if (checked) {
                            console.log('storing')
                            localStorage.setItem(
                              'useLocalTime',
                              checked.toString()
                            )
                            setUseLocalTime(checked.toString())
                          } else {
                            console.log('removing')
                            localStorage.removeItem('useLocalTime')
                            setUseLocalTime('false')
                          }
                          handleUpdate(8)
                        }}
                      />
                    </div>
                  </div>


                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-6 ">
                      <div className="pb-0">
                        Turn off ads for 3 days
                        <div className="text-sm"> </div>
                      </div>
                    </div>
                    <div className="text-right col-span-2">
                      <Switch
                        checked={disableAdsTimestamp !== ''}
                        onChange={(checked) => {
                          if (checked) {
                            console.log('storing')
                            localStorage.setItem(
                              'disableAdsTimestamp',
                              Date.now().toString()
                            )
                            setDisableAdsTimestamp(Date.now().toString())
                          } else {
                            console.log('removing')
                            localStorage.removeItem('disableAdsTimestamp')
                            setDisableAdsTimestamp('')
                          }
                          handleUpdate(6)
                        }}
                      />
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                     <div className="text-left col-span-6 ">
                         <div className="pb-0">Allow flexible input
                            <div className="text-sm">Enter values non sequentially</div>
                         </div>
                         
                     </div>
                     <div className="text-right col-span-2">
                        <Switch checked={flexInput} onChange={(checked)=>{ 
                            setFlexInput(checked)
                            localStorage.setItem('flexInput', checked.toString())
                            handleUpdate(5)
                        }}/>
           
                     </div>
                  </div> */}
                  {/* 
                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                     <div className="text-left col-span-6">
                         <div>mini Nerdle

                         <div className="text-sm">Easier mode with 6 columns</div>
                         </div>
                         
                     </div>
                     <div className="text-right col-span-2">
                        <Switch checked={miniMode} onChange={(checked)=>{
                            setMiniMode(checked)
                            localStorage.setItem('gameMode', checked? 'mini':'')
                            handleUpdate(2)
                         }}/>
                     </div>
                  </div> */}

                  <div className="grid grid-cols-8 gap-1 dark:text-[#D7DADC]">
                    <div className="text-left col-span-8">
                      <div>
                        <span
                          className="underline cursor-pointer focus:outline-none"
                          onClick={() => handleImport()}
                        >
                          Import stats
                        </span>

                        <div className="text-sm">
                          Import stats from another browser/device
                        </div>

                      </div>
                    </div>
                  </div>


                  {/* <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-8">
                      <div>
                        <span
                          className="underline cursor-pointer focus:outline-none"
                          onClick={() => handleUpdate(9)}
                        >
                          Login to Nerdle cloud (LeaderboardLe)
                        </span>

                        <div className="text-sm">
                          Login to sync your stats across devices
                        </div>

                      </div>
                    </div>
                  </div> */}

                  {/* <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-6 ">
                      <div className="pb-0">More games</div>
                    </div>
                    <div className="text-right col-span-2">
                      <HomeIcon
                        className="ml-auto h-8 w-8 cursor-pointer dark:text-[#D7DADC]"
                        onClick={() => {
                          window.location.href = 'https://www.nerdlegame.com'
                        }}
                      />
                    </div>
                  </div> */}

                  {loggedInUser && (
                    <>
                      {/* <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                      <div className="text-left col-span-8 font-bold">
                        <hr />
                          Account options
                      </div>
                    </div> */}
                      <hr className="mt-4" />
                      <h3 className="text-lg text-left leading-6 font-medium mt-2 text-gray-900 dark:text-[#D7DADC]">
                        Account options
                      </h3>

                    {email != '' && (
                      <div className="text-left text-sm col-span-8 text-gray-500  dark:text-[#D7DADC]">{email}</div>
                    )}

                    {email != '' && isVerified==false && (
          
                      <div className="grid grid-cols-8 gap-1 mt-4 mb-4 dark:text-[#D7DADC]">
                        <div className="text-left col-span-8">
                          <div style={{ width: '100%' }}>
                            <span
                              className="underline cursor-pointer focus:outline-none"
                              onClick={() => {
                                doSendEmailVerification()
                              }}
                            >
                              Please verify your email address
                            </span>
                          </div>
                        </div>
                      </div>
                    )}


                     {email != '' && isVerified && (
                      <>


                      <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                        <div className="text-left col-span-6 ">
                          <div className="pb-0">
                            Send me marketing emails
                            <div className="text-sm">
                              
                            </div>
                          </div>
                        </div>
                        <div className="text-right col-span-2">
                          <Switch
                            checked={marketingOptIn}
                            onChange={(checked) => {
                              setMarketingOptIn(checked)
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-8 gap-1 mt-2 dark:text-[#D7DADC]">
                        <div className="text-left col-span-6 ">
                          <div className="pb-0">
                            Send me game updates
                            <div className="text-sm">
                             
                            </div>
                          </div>
                        </div>
                        <div className="text-right col-span-2">
                          <Switch
                            checked={updatesOptIn}
                            onChange={(checked) => {
                              setUpdatesOptIn(checked)
                            }}
                          />
                        </div>
                      </div>

                      </>)}

                 

                      <div className="grid grid-cols-8 gap-1 mb-2 dark:text-[#D7DADC]">
                        <div className="text-left col-span-8">
                          <div style={{ width: '100%' }}>
                            <span
                              className="underline cursor-pointer focus:outline-none"
                              onClick={() => handleLogout()}
                            >
                              Log out
                            </span>
                            <span
                              style={{ marginLeft: 20 }}
                              className="underline cursor-pointer focus:outline-none"
                              onClick={() => handleCloseAccount()}
                            >
                              Delete account
                            </span>
                          </div>
                        </div>
                      </div>

                      <hr />
                    </>
                  )}

                    {isMobileApp && (
                      <>
                      <div className="grid grid-cols-8 gap-1 mt-2 dark:text-[#D7DADC]">
                        <div className="text-left col-span-6 ">
                          <div className="pb-0">
                            Enable notifications
                            <div className="text-sm">
                            Get updates &amp; new challenge announcements
                            </div>
                          </div>
                        </div>
                        <div className="text-right col-span-2">
                          <Switch
                            checked={notificationsEnabled}
                            onChange={(checked) => {
                              setNotificationsEnabled(checked)
                            }}
                          />
                        </div>
                      </div>
                      <hr />
                      </>
                    )}

                  {/* <h3
                    className="text-lg text-left leading-6 font-medium mt-4 text-gray-900 dark:text-[#D7DADC]"
                  >More</h3> */}

                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                    <div className="text-left col-span-2 ">
                      <div className="pb-0">Follow us</div>
                    </div>
                    <div className="text-right col-span-6">
                      <a
                        href="https://www.facebook.com/nerdlegame"
                        target="_new"
                        className="inline-block"
                      >
                        <FacebookIcon size={28} round={true} />
                      </a>

                      <a
                        href="https://twitter.com/nerdlegame"
                        target="_new"
                        className="inline-block ml-2"
                      >
                        <TwitterIcon size={28} round={true} />
                      </a>

                      <a
                        href="https://www.instagram.com/nerdle_game/"
                        target="_new"
                        className="inline-block ml-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          viewBox="0 0 333333 333333"
                          shape-rendering="geometricPrecision"
                          text-rendering="geometricPrecision"
                          image-rendering="optimizeQuality"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        >
                          <defs>
                            <linearGradient
                              id="a"
                              gradientUnits="userSpaceOnUse"
                              x1="250181"
                              y1="308196"
                              x2="83152.4"
                              y2="25137"
                            >
                              <stop offset="0" stop-color="#f58529" />
                              <stop offset=".169" stop-color="#feda77" />
                              <stop offset=".478" stop-color="#dd2a7b" />
                              <stop offset=".78" stop-color="#8134af" />
                              <stop offset="1" stop-color="#515bd4" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M166667 0c92048 0 166667 74619 166667 166667s-74619 166667-166667 166667S0 258715 0 166667 74619 0 166667 0zm-40642 71361h81288c30526 0 55489 24654 55489 54772v81069c0 30125-24963 54771-55488 54771l-81289-1c-30526 0-55492-24646-55492-54771v-81069c0-30117 24966-54771 55492-54771zm40125 43843c29663 0 53734 24072 53734 53735 0 29667-24071 53735-53734 53735-29672 0-53739-24068-53739-53735 0-29663 24068-53735 53739-53735zm0 18150c19643 0 35586 15939 35586 35585 0 19647-15943 35589-35586 35589-19650 0-35590-15943-35590-35589s15940-35585 35590-35585zm51986-25598c4819 0 8726 3907 8726 8721 0 4819-3907 8726-8726 8726-4815 0-8721-3907-8721-8726 0-4815 3907-8721 8721-8721zm-85468-20825h68009c25537 0 46422 20782 46422 46178v68350c0 25395-20885 46174-46422 46174l-68009 1c-25537 0-46426-20778-46426-46174v-68352c0-25395 20889-46177 46426-46177z"
                            fill="url(#a)"
                          />
                        </svg>
                      </a>

                      <a
                        href="https://www.tiktok.com/@nerdlegame"
                        target="_new"
                        className="inline-block ml-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          viewBox="0 0 3333 3333"
                          shape-rendering="geometricPrecision"
                          text-rendering="geometricPrecision"
                          image-rendering="optimizeQuality"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        >
                          <path d="M1667 0c920 0 1667 746 1667 1667 0 920-746 1667-1667 1667C747 3334 0 2588 0 1667 0 747 746 0 1667 0zm361 744c31 262 177 418 430 434v294c-147 14-276-34-426-124v550c0 700-763 918-1069 417-197-322-76-889 556-911v311c-48 8-99 20-146 36-141 47-220 137-198 294 43 301 595 390 549-198V745h305z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* 
                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                     <div className="text-left col-span-8">
                         <div>pro Nerdle
                          <div className="text-sm">
                            <a href="https://create.nerdlegame.com/play.html" target="_new" className="underline font-bold focus:outline-none">Create and play your own Nerdle game</a>
                          </div>
                         </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-8 gap-1 mt-4 dark:text-[#D7DADC]">
                     <div className="text-left col-span-8">
                         <div>instant Nerdle

                         <div className="text-sm">Follow us on Twitter/Facebook for more challenges:</div>
                         </div>
                         
                     </div>
                  </div> */}

                  {/*                   
                  <div className="mt-3 text-center sm:mt-5 space-x-2 flex justify-center">
                      <a href="https://www.facebook.com/nerdlegame" target="_new">
                        <FacebookIcon size={36} round={true}/>
                      </a>
                      
                      <a href="https://twitter.com/nerdlegame" target="_new">
                        <TwitterIcon size={36} round={true}/>
                      </a>
                    </div> */}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
