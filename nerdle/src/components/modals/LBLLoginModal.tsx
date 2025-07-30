import { Fragment, useState, useRef, useCallback, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import { store7DaysToCloud } from '../../lib/cloudStats'
import FacebookLogin from '@greatsumini/react-facebook-login'
import { useGoogleLogin } from '@react-oauth/google'
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from 'react-social-login-buttons'
import { doLblOauth } from '../../lib/lblcallback'
import { isNewMobileApp, postToFlutter } from '../../lib/isPWA'
import { analytics } from '../../index'
import { logEvent} from 'firebase/analytics'


declare var passedParams: any
declare var PushService: any

type Props = {
  isOpen: boolean
  scoreText: string
  handleClose: () => void
  handleLogin: () => void
}

export const LBLLoginModal = ({
  isOpen,
  scoreText,
  handleClose,
  handleLogin,
}: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')

  const [provider, setProvider] = useState('')
  const [profile, setProfile] = useState<any>()

  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [showEmailSignup, setShowEmailSignup] = useState(false)
  const [doingForgotPassword, setDoingForgotPassword] = useState(false)
  const [doneForgotPassword, setDoneForgotPassword] = useState(false)

  const onLoginStart = useCallback(() => {
    alert('login start')
  }, [])

  const onLogoutSuccess = useCallback(() => {
    setProfile(null)
    setProvider('')
    alert('logout success')
  }, [])

  useEffect(() => {
    if (isOpen === true) {
      console.log('setting newAccount to false')
      localStorage.setItem('newAccount', 'false')


      if (isNewMobileApp()) {
        window.addEventListener('message', (event) => {
          if (event.data.startsWith('finishSignIn')) {
            const body = event.data.split('finishSignIn')[1]
            const messageData = JSON.parse(body)

            const data = {
              provider: messageData.provider,
              googleId: messageData.id,
              fullname: messageData.name,
              email: messageData.email,
              source: 'nerdle'
            }
            doLogin(data, false)
            PushService.requestPermission();
          }
        })
      }

      // if we have profile in querystring we have been pushed here from mobile app to finish off a sign in
      // if (isNewMobileApp() && window.location.search.includes('profile=')) {
      //   console.log('doing mobile app login')
      //   var profile = window.location.search.split('profile=')[1]
      //   console.log(profile)
      //   //base 64 decode profile
      //   var decodedProfile = atob(profile)
      //   console.log(decodedProfile)
      //   var jsonProfile = JSON.parse(decodedProfile)

      //   const data = {
      //     provider: 'google',
      //     googleId: jsonProfile.id,
      //     fullname: jsonProfile.name,
      //     email: jsonProfile.email,
      //     source: 'nerdle'
      //   }

      //   console.log('doing back end login')
      //   doLogin(data, false)

      // }

    }
  }, [isOpen])

  const doLogin = (payload: any, signup: boolean) => {
    //first check if email and password are valid
    if (!payload.provider) {
      if (email.length === 0) {
        alert('Please enter an email address')
        return
      }
      if (password.length === 0) {
        alert('Please enter a password')
        return
      }
      // check email is a valid email address
      if (!email.includes('@')) {
        alert('Please enter a valid email address')
        return
      }
      if (signup) {
        if (payload.fullname.length === 0) {
          alert('Please enter a name')
          return
        }
        // also check we have a confirmPassword and that it matches password
        if (confirmPassword.length === 0) {
          alert('Please confirm your password')
          return
        }
        if (password !== confirmPassword) {
          alert('Your passwords do not match')
          return
        }
        payload.source = 'nerdle'
      } else {
        delete payload.fullname
      }
      delete payload.confirmPassword
    }

    const authUrl = signup
      ? 'https://api.leaderboardle.com/user/create'
      : 'https://api.leaderboardle.com/login'

    // const authUrl = signup
    //   ? 'http://localhost:3000/prod/user/create'
    //   : 'https://api.leaderboardle.com/login'

    console.log('payload', payload)

    fetch(authUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json)

        if (json.token) {
          console.log('login success ' + json.token)
          console.log('message ' + json.message)
          localStorage.setItem('lbl_token', json.token)
          localStorage.setItem('userEmail', payload.email)

          if (
            json.message == 'User used a provider to sign in' ||
            json.message == 'User used a provider to sign in with email'
          ) {
            console.log('created new account')
            localStorage.setItem('newAccount', 'true')
          }

          // post message to app
          if (
            (window as any).webkit &&
            (window as any).webkit.messageHandlers &&
            (window as any).webkit.messageHandlers.lblLogin
          ) {
            ; (window as any).webkit.messageHandlers.lblLogin.postMessage({
              message: json.token,
            })
          }

          if (scoreText !== '') {
            //now if we have scoreText, log it ...
            const createScoreUrl =
              'https://api.leaderboardle.com/user/score/create'

            //api is text/plain
            fetch(createScoreUrl, {
              method: 'POST',
              headers: { Authorization: `Bearer ${json.token}` },
              body: scoreText,
            })
              .then((res) => res.json())
              .then((json) => {
                // do this AFTER we have already created the score to avoid potential race/duplicates
                store7DaysToCloud()
                handleLogin()
              })
          } else {
            handleLogin()
          }


        } else {
          if (showEmailSignup) {
            if (json.item == 'Success') {
              //successful sign up, let's go ahead and log in
              console.log('successful login')

              if (json.message == 'User is created') {
                console.log('created new account')
                localStorage.setItem('newAccount', 'true')
              }

              doLogin({ email, password }, false)
            } else {
              if (json.message) {
                alert(json.message)
              }
            }
          } else {
            if (json.message) {
              alert(json.message)
            }
          }
        }
      })
  }

  const forgotPassword = () => {

    if (!doingForgotPassword) {
      setDoingForgotPassword(true)
      return
    }

    if (email.length === 0) {
      alert('Please enter an email address')
      return
    }
    // check email is a valid email address
    if (!email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    const payload = {
      source: 'nerdle',
      email: email,
    }

    const authUrl = 'https://api.leaderboardle.com/league/forgot-password'
    //const authUrl = 'http://localhost:3000/prod/league/forgot-password'

    fetch(authUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
      //get status code
      .then((res) => {
        console.log(res.status)
        if (res.status === 200) {
          //alert('Password reset email sent')
          console.log('Password reset email sent')
          setEmail('')
          setDoneForgotPassword(true)
          setDoingForgotPassword(false)
        } else {
          alert('Error sending password reset email')
        }
      })
  }

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse)

      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: { Authorization: `Bearer ${codeResponse.access_token}` },
        redirect: 'follow',
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json)
          const email = json.email
          const name = json.name
          const googleId = json.sub

          console.log(email, name)

          const data = {
            provider: 'google',
            googleId: googleId,
            fullname: name,
            email: email,
            source: 'nerdle'
          }

          doLogin(data, false)
        })
    },
    flow: 'implicit',
  })

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
              className=" inline-block align-top bg-white dark:bg-gray-800  dark:text-[#D7DADC] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6"
            >
              <div className="absolute left-4 top-4"></div>
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
                    Log in to <span className="nerdle-name">nerdle</span>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="my-2 mx-2 text-sm text-gray-500  dark:text-[#D7DADC] text-left">
                      Sync your stats across devices, share your scores.
                      {/* Continue with Google{!isNewMobileApp ? ', Facebook ' : ' '}or email. */}
                    </p>

                    <p>
                      {/* {!isNewMobileApp() && (
                      <FacebookLogin
                        appId="279421891424310"
                        onSuccess={(response) => {
                          console.log('Login Success!', response)
                        }}
                        onFail={(error) => {
                          console.log('Login Failed!', error)
                        }}
                        onProfileSuccess={(response) => {
                          console.log('Get Profile Success!', response)
                          logEvent(analytics, 'facebook_login')
                          doLogin(
                            {
                              provider: 'facebook',
                              fbId: response.id,
                              fullname: response.name,
                              email: response.email,
                              source: 'nerdle'
                            },
                            false
                          )
                        }}
                        style={{ width: '100%' }}
                      >
                        <FacebookLoginButton text="Continue with Facebook" style={{ fontSize: 17, minHeight: 50 }} />
                      </FacebookLogin>)} */}

                    </p>

                    <p className="mb-2">
                      <GoogleLoginButton
                        text="Continue with Google"
                        onClick={() => {
                          if (isNewMobileApp()) {
                            postToFlutter('googleSignIn')
                          } else {
                            googleLogin()
                          }
                        }}
                        style={{ fontSize: 17, minHeight: 50 }}
                      />
                    </p>
                    <p>
                      <button
                        type="button"
                        style={{
                          display: 'block',
                          border: '0px',
                          borderTopLeftRadius: '3px',
                          borderTopRightRadius: '3px',
                          borderBottomRightRadius: '3px',
                          borderBottomLeftRadius: '3px',
                          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 1px 2px',
                          color: 'rgb(255, 255, 255)',
                          cursor: 'pointer',
                          fontSize: '17px',
                          margin: '5px',
                          width: 'calc(100% - 10px)',
                          overflow: 'hidden',
                          padding: '0px 10px',
                          minHeight: '50px',
                          //backgroundColor: 'rgb(59, 89, 152)',
                          backgroundColor: 'rgb(167, 139, 250)'
                        }}
                        onClick={() => {
                          doLblOauth()
                        }}
                      >
                        <div
                          style={{
                            alignItems: 'center',
                            display: 'flex',
                            height: '100%',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              minWidth: '26px',
                            }}
                          >
                            <img
                              src="data:image/png;base64,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"
                              alt="Leaderboardle App"
                              className="h-8 w-8"
                            />
                          </div>
                          <div style={{ width: '10px' }} />
                          <div style={{ textAlign: 'left', width: '100%' }}>
                            Continue with LeaderboardLe
                          </div>
                        </div>
                      </button>
                    </p>

                    <p className="mt-4 text-gray-500 dark:text-[#D7DADC]">OR</p>
                    <p className="mt-2 mx-1">
                      <button
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                        onClick={() => {
                          //setShowEmailSignup(true)
                          setShowEmailLogin(true)
                          setDoneForgotPassword(false)
                          setDoingForgotPassword(false)
                        }}
                      >
                        Use email
                      </button>
                    </p>

                    {/* <p className="mt-2 text-sm text-gray-500 dark:text-[#D7DADC]">
                      Have a password?{' '}
                      <span
                        className="text-sm mt-2 sm:mt-2 underline cursor-pointer text-gray-500 dark:text-[#D7DADC]"
                        onClick={() => {
                          setShowEmailSignup(false)
                          setShowEmailLogin(true)
                        }}
                      >
                        Sign in with email
                      </span>
                      .
                    </p> */}

                    <p className="mt-2 text-sm text-gray-500 dark:text-[#D7DADC] text-left mx-2">
                      A Nerdle login also gives you access to{' '}
                      <a
                        className="underline cursor-pointer"
                        href="https://leaderboardle.com"
                        target="_new"
                      >
                        LeaderboardLe
                      </a>{' '}
                      where you can share scores from other -Le games and join
                      leagues.
                    </p>

                    {doneForgotPassword && (
                      <p className="text-center mt-2">Thanks - please check your email</p>
                    )}


                    {showEmailLogin && !doneForgotPassword && (
                      <p className="mt-2 text-sm text-gray-500  dark:text-[#D7DADC] text-left">
                        <p className="mt-2">Email:</p>

                        <input
                          id="emailInput"
                          className="mt-1 w-[100%] border-sollid border-2 rounded-lg dark:text-[#000000]"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                          }}
                        />

                        {!doingForgotPassword && (
                          <>
                            <p className="mt-2">Password:</p>

                            <input
                              className="mt-1 w-[100%] border-sollid border-2 rounded-lg dark:text-[#000000]"
                              type="password"
                              value={password}
                              onChange={(e) => {
                                console.log('changing password')
                                setPassword(e.target.value)
                              }}
                            />
                          </>
                        )}

                        {showEmailSignup && (
                          <>
                            <p className="mt-2">Confirm password:</p>

                            <input
                              className="mt-1 w-[100%] border-sollid border-2 rounded-lg dark:text-[#000000]"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value)
                              }}
                            />
                          </>
                        )}


                        {showEmailSignup && (
                          <>
                            <p className="mt-2">Name:</p>

                            <input
                              className="mt-1 w-[100%] border-sollid border-2 rounded-lg dark:text-[#000000]"
                              type="text"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value)
                              }}
                            />

                            <p className="mt-2">Date of birth:</p>

                            <input
                              className="mt-1 w-[100%] border-sollid border-2 rounded-lg dark:text-[#000000]"
                              type="date"
                              value={dob}
                              onChange={(e) => {
                                setDob(e.target.value)
                              }}
                            />
                          </>
                        )}

                        <p className="mt-4">
                          {!showEmailSignup && !doingForgotPassword && (
                            <button
                              className="inline-flex justify-center mb-2 mx-[1%] w-[48%] rounded-md border border-transparent shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                              onClick={() => {
                                doLogin(
                                  {
                                    email,
                                    password,
                                    fullname: name,
                                    confirmPassword,
                                  },
                                  showEmailSignup
                                )
                              }}
                            >
                              Log in
                            </button>
                          )}

                          {!doingForgotPassword && (
                            <button
                              className="inline-flex justify-center mb-2 mx-[1%] w-[48%] rounded-md border border-transparent shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                              onClick={() => {
                                if (showEmailSignup) {
                                  doLogin(
                                    {
                                      email,
                                      password,
                                      fullname: name,
                                      confirmPassword,
                                      dob,
                                    },
                                    showEmailSignup
                                  )
                                } else {
                                  setShowEmailSignup(true)
                                }
                              }}
                            >
                              Sign up
                            </button>)}

                          {doingForgotPassword && (
                            <p className="text-center mb-2">Click continue to send password reset instructions</p>
                          )}

                          {doingForgotPassword && (
                            <button
                              className="inline-flex justify-center mb-2 mx-[1%] w-[48%] rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                              onClick={() => {
                                forgotPassword()
                              }}
                            >
                              Continue
                            </button>
                          )}

                          {(showEmailSignup || doingForgotPassword) && (
                            <button
                              className="inline-flex justify-center mb-2 mx-[1%] w-[48%] rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                              onClick={() => {
                                setShowEmailSignup(false)
                                setDoingForgotPassword(false)
                              }}
                            >
                              Cancel
                            </button>
                          )}

                        </p>

                        {showEmailLogin && !showEmailSignup && !doingForgotPassword && (
                          <p className="text-right mt-2">
                            <span className="underline cursor-pointer" id="forgotPasswordButton" onClick={() => forgotPassword()}>Forgot password</span>
                          </p>
                        )}



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
