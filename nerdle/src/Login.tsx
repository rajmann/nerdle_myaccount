import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'
import { api_url } from './index'

//define props
interface Props {
    service?: string
}

const LoginHeader = () => {
    return (
        <div className="flex max-w-[95%] w-[440px] mx-auto items-center pb-nav main-nav">
        <a href={'https://www.nerdlegame.com'}>
          <img
            src={'/logo192.png'}
            alt="Nerdlegame - the daily numbers game"
            style={{
              height: 32,
              paddingRight: 10,
            }}
            aria-label="Nerdle home page"
          />
        </a>

        <span style={{marginLeft:'auto'}}>
          <div className={'dark:text-white nerdle-sub-name'}>midi</div>
          <div>
            <span
              className={'dark:text-white nerdle-name'}
              style={{ fontSize: undefined }}
            >
              nerdle
            </span>
            <span className="nerdle-dot">.</span>
          </div>
        </span>
      </div>
    )
}

const LoginForm = () => {
    // timestamp
    const timestamp = new Date().getTime()

    return (
        <div className={'flex flex-row justify-center mt-4'}>
          <div className="max-w-[100%] w-[450px] items-center">
            <LoginHeader />
    
            <div className="max-w-[95%] w-[440px] mx-auto pb-nav main-nav">
              <h1 className="nerdle-name">Welcome</h1>
    
              <p className={'mt-4 mb-4'}>midi Nerdle is a special version of Nerdle available exlusively to Amazon Prime gaming members.</p>
    
              {/* <p className={'mt-4 mb-4'}>To play midi Nerdle please log in below:</p>
    
              <iframe
                src={'/amazonbutton.html?' + timestamp}
                style={{ height: 48, marginLeft: 'auto' }}
              />

     
              <hr />
    
              <p>
                Once logged in you will be asked for your special entitlement code that you will find in your Prime gaming account.
              </p> */}

              <p className={'mt-4 mb-4'}>To play midi Nerdle please visit the special game link from your Amazon Prime Gaming account.</p>
    
              {/* <p className="mt-2 mb-2"><a className="text-sm cursor-pointer underline" href="https://www.nerdlegame.com/privacy.html" target="_blank">Privacy policy</a></p>
     */}

            </div>
          </div>
        </div>
      )
}

interface GameCodeProps {
    onChange: (gameCode: string) => void
    onClaim: () => void
    setMarketing: (marketing: boolean) => void
    marketing: boolean
}

const GameCodeForm = ({onChange, onClaim, setMarketing, marketing}: GameCodeProps) => {
    // timestamp
    const timestamp = new Date().getTime()

    return (
        <div className={'flex flex-row justify-center mt-4'}>
          <div className="max-w-[100%] w-[450px] items-center">
            <LoginHeader />
    
            <div className="max-w-[95%] w-[440px] mx-auto pb-nav main-nav">
              <h1 className="nerdle-name">Claim your game code</h1>
    
              <p className={'mt-4 mb-4'}>Please enter your claim code below:</p>
    
              <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                  placeholder="NDXXXXXXXXXX"
                  onChange={(e) => onChange(e.target.value)}
              />

              <div className="flex items-center mt-4">

                <input  
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                    checked={marketing}
                    onChange={(e) => { setMarketing(e.target.checked) }}
                />

                <p className={'ml-2'}>Please send me news &amp; announcements by email</p>
              </div>

              <button
                  className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                  onClick={() => {
                      onClaim()
                  }}
              >
                  Claim
              </button>
 
            </div>
          </div>
        </div>
      )
}

const Login = ({service}:Props) => {
  const [gameCode, setGameCode] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [gameMode, setGameMode] = useState('')
  const [marketing, setMarketing] = useState(true)
  const navigate = useNavigate()

  
  useEffect(() => {
    // if service is set in props
    if (service) {
        // if service is amazon
        if (service === 'amazon') {
            // get the code from the url
            const urlParams = new URLSearchParams(window.location.search)
            const code = urlParams.get('code')
            // if code is set
            if (code) {
                const redirect_uri = window.location.protocol + '//' + window.location.host + '/lwa-callback'
                // we need to pass this to our backend and check if it is valid ... if so we can set the game code
                // and redirect to the game
                fetch(`${api_url}/lwalogin?123`, {
                    method: 'POST',
                    body: JSON.stringify({ code: code, redirect_uri: redirect_uri }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => response.json())
                .then((json) => 
                    {
                        console.log(json)

                        const state = urlParams.get('state') || ''
                        setGameMode(state)

                        if (json.status === 'error') {
                            //alert('An error occurred ... please try again')
                            alert(json.msg)
                            navigate('/login')
                        } else {
                            setLoggedIn(true)
                            const gameCode = json.gameCode
                            localStorage.setItem('userToken', json.token)
                            if (gameCode!='') {
                                if (window.location.hostname.includes('localhost')) {
                                  window.location.href = 'http://localhost:3000/storePrime?gameMode=' + state
                                } else {
                                  if (window.location.hostname.includes('dev.')) {
                                      window.location.href = 'https://dev.nerdlegame.com/storePrime?gameMode=' + state
                                  } else {
                                      window.location.href = 'https://nerdlegame.com/storePrime?gameMode=' + state
                                  }
                                }
                            } else {

                            }   
                        }
                    }
                )

            } else {
                // redirect to /login
                alert("An error occurred ... please try again")
                navigate('/login')
            }
        }
    }
  }, [])

  const doClaim = () => {
    console.log('claiming game code', gameCode)
    fetch(`${api_url}/claimPrimeCode`, {
        method: 'POST',
        body: JSON.stringify({ gameCode: gameCode, marketing: marketing }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('userToken') || ''
        }})
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            if (json.status === 'error') {
                alert('An error occurred ... please try again')
            }
            if (json.status === 'ok') {
                //navigate('/')
                //get hostname
                if (window.location.hostname.includes('localhost')) {
                  window.location.href = 'http://localhost:3000/storePrime?gameMode=' + gameMode
                } else {

                  if (window.location.hostname.includes('dev.')) {
                      window.location.href = 'https://dev.nerdlegame.com/storePrime?gameMode=' + gameMode
                  } else {
                      window.location.href = 'https://nerdlegame.com/storePrime?gameMode=' + gameMode
                  }
                }
                
            }
        });

  }

  return (
    loggedIn ? <GameCodeForm 
                    onChange={(value) => setGameCode(value)} 
                    onClaim={() => { doClaim() }}
                    setMarketing={(value) => setMarketing(value)}
                    marketing={marketing}
                /> 
             : <LoginForm />
)

  
}


export default Login
