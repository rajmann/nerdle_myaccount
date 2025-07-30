import React, { Suspense, lazy, useEffect, useState } from 'react'
//import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { loginRequired, verifyAmazon } from './auth' -- no longer needed as was only used for prime verification
import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { GoogleOAuthProvider } from '@react-oauth/google';
import {Helmet} from "react-helmet";
import {getMeta} from './lib/getMeta'
import { checkTeacherCode } from './lib/checkTeacherCode'
import { resolve } from 'path';

// export const api_url = window.location.href.includes('localhost')
//   ? 'http://localhost:9000'
//   : 'https://clue.nerdlegame.com'
export const api_url = 'https://clue.nerdlegame.com';
//export const api_url = 'http://localhost:9000'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCrw9zOEPd_8YN6hCutWzKqE4-ESV1cINY',
  authDomain: 'nerdle.firebaseapp.com',
  databaseURL: 'https://nerdle-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'nerdle',
  storageBucket: 'nerdle.appspot.com',
  messagingSenderId: '31436486735',
  appId: '1:31436486735:web:20ebd7255a9cc8324c523a',
  measurementId: 'G-MRLY2WKXE9',
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)

// // if /storePrime is in the url then store that user is prime eligible then redirect back to subdomain in url
// if (window.location.href.includes('/storePrime')) {
//   const url = new URL(window.location.href)
//   const gameMode = url.searchParams.get('gameMode')
//   localStorage.setItem('primeUser', 'true')

//   if (window.location.hostname.includes('localhost')) {
//     window.location.href = `http://${gameMode}.localhost:3000/`
//   } else {
//     if (window.location.hostname.includes('dev.')) {
//       window.location.href = `https://${gameMode}.dev.nerdlegame.com`
//     } else {
//       window.location.href = `https://${gameMode}.nerdlegame.com`
//     }
//   }
// }

if (window.location.hostname.includes('midi.localhost')) {
  //get token from querystring
  const url = new URL(window.location.href)
  const token = url.searchParams.get('token')
  if (token) {
    localStorage.setItem('userToken', token)
    console.log('got token')
    window.location.href = '/game'
  }
}

checkTeacherCode()
 
// async function checkAuth() {
//   if (loginRequired()) {
//     // do we have a userToken in localStorage?
//     const userToken = localStorage.getItem('userToken')
//     console.log('userToken', userToken)
//     // get gameMode from subdomain of url
//     const gameMode = window.location.hostname.split('.')[0]
//     if (userToken) {
//       // is the userToken valid?
//       const response = await fetch(`${api_url}/validateToken?gm=${gameMode}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           token: userToken,
//         },
//       })
//       const json = await response.json()
//       console.log(json)
//       if (json.status === 'ok') {
//         localStorage.setItem('marketing', json.marketing?.toString() || 'false')
//         return true
//       }
//     } else {
//       //need to log in ...
//       console.log('no token')
//       return false
//     }
//   } else {
//     // login not required ... 
    
//     // but is it an Amazon Prime user?
//  //   const isPrimeValid = await verifyAmazon()
//  //   return isPrimeValid // we get true here if it's a prime game and they are a valid user, or if it's not a prime game ... 

//     return true //login is not required so just return logged in
//   }
// }

const hasRefreshed = JSON.parse(
  window.sessionStorage.getItem('retry-lazy-refreshed') || 'false'
);

const MainApp = lazy(() => 
  import('./App').then((module) => {
    return { default: module.default }
  }).catch((error) => {
    console.error(error)
    if (!hasRefreshed) {
      window.sessionStorage.setItem('retry-lazy-refreshed', 'true'); // we are now going to refresh
      window.location.reload();
    }
    return { default: () => <div>Something went wrong</div> }
  })
)
// const MainApp = lazy(() => import('./App'))

// const Login = lazy(() => import('./Login'))
const VerifyEmail = lazy(() => import('./VerifyEmail'))
const ResetPassword = lazy(() => import('./ResetPassword'))
const AppSplashScreen = lazy(() => import('./AppSplashScreen'))
const Teacher = lazy(() => import('./Teacher'))

const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="text-center">
      <div className="text-3xl font-bold text-gray-800">Loading...</div>

      <button
        className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-8"
        onClick={() => window.location.reload()}
      >
        Reload
      </button>
    </div>
  </div>
)

const App = () => {
  // const [isAuthorised, setIsAuthorised] = useState(false)
  const [isReady, setIsReady] = useState(true)

  // useEffect(() => {
  //   checkAuth().then((isAuthorised) => {
  //     setIsReady(true)
  //     setIsAuthorised(isAuthorised || false)
  //   })
  // }, [])

  const meta = getMeta();

  if (!isReady) return <LoadingIndicator />

  return (
    <GoogleOAuthProvider clientId="31436486735-bhmnsmajv93uuausn61nckdstfhq36c7.apps.googleusercontent.com">
    <Router>

      <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />

          <meta property="twitter:title" content={meta.title} />
          <meta property="twitter:description" content={meta.description} />
        
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
      </Helmet>

      <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          <Route path="/" element={<MainApp />} />
          {/* {isAuthorised ? (
            <Route path="/" element={<MainApp />} />
           ) : (
             <Route path="/" element={<Login />} />
          )} */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/lwa-callback" element={<Login service="amazon" />} /> */}
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/app-splash" element={<AppSplashScreen />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/*" element={<MainApp />} />
          {/* {isAuthorised ? (
            <Route path="/*" element={<MainApp />} />
          ) : (
            <Route path="/*" element={<Login />} />
          )} */}
        </Routes>
      </Suspense>
    </Router>
    </GoogleOAuthProvider>
  )
}

const container = document.getElementById('root');
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
