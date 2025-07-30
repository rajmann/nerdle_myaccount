import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './index.css'
import { api_url } from './index'

const ResetPassword = () => {

  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [isReset, setIsReset] = useState(false)

  const { token } = useParams() 
  const navigate = useNavigate()

  const resetPassword = () => {

    // first check that passwords match and are not empty and are at least 8 characters
    if (password !== password2) {
      alert('Passwords do not match')
      return
    }
    
    if (password.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    const api_url = 'https://api.leaderboardle.com/league/reset-password/' + token
    const payload = { password }

    fetch(api_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      // get status code
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          
          response.json().then((json) => {
            console.log(json)
            setIsReset(true)
          })

        } else {
          alert('There was an error resetting your password')
        }
      })


  }

  

  if (!isReset && token) {

    // show a form to reset password
    return (
      <div className={'flex flex-row justify-center mt-4'}>
        <div className="max-w-[100%] w-[450px] items-center text-center">
          <div className="max-w-[95%] w-[440px] mx-auto pb-nav main-nav">
            <h1 className="nerdle-name">Reset password</h1>

            <p className={'mt-4 mb-4'}>Enter your new password</p>

            <div className="mx-auto max-w-[300px] text-sm text-gray-500  dark:text-[#D7DADC] text-left">

              <p className="mt-2">New password:</p>

              <input
                className="mt-1 w-[100%] border-sollid border-2 rounded-lg dark:text-[#000000]"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />

              <p className="mt-2">Confirm password:</p>

              <input
                className="mt-1 w-[100%] border-sollid border-2 rounded-lg dark:text-[#000000]"
                type="password"
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value)
                }}
              />

            </div>

            <button
              className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-8"
              onClick={() => {
                
                resetPassword();
               
              }}
            >
              Reset password
            </button>

          </div>
        </div>
      </div>
    )

  } else {
    
    return (
      <div className={'flex flex-row justify-center mt-4'}>
        <div className="max-w-[100%] w-[450px] items-center text-center">
          <div className="max-w-[95%] w-[440px] mx-auto pb-nav main-nav">
            <h1 className="nerdle-name">Reset password</h1>
            <p className={'mt-4 mb-4'}>Your password has been updated!</p>

            <img src="/numbot_tracks.png" />

            <button
              className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-8"
              onClick={() => window.location.href = '/game'}
            >
              Back to game!
            </button>

          </div>
        </div>
      </div>
    )
  }
}

export default ResetPassword
