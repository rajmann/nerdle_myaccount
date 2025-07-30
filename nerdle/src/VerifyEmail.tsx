import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './index.css'
import { api_url } from './index'

const VerifyEmail = () => {
  const navigate = useNavigate()

  let { token } = useParams()

  useEffect(() => {
    console.log(token)

    // get lbl_token from localstorage
    const lbl_token = localStorage.getItem('lbl_token')

    fetch('https://api.leaderboardle.com/verify-email/' + token, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${lbl_token}` },
    })
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
        });

  },[token]);

  return (
    <div className={'flex flex-row justify-center mt-4'}>
      <div className="max-w-[100%] w-[450px] items-center text-center">
        <div className="max-w-[95%] w-[440px] mx-auto pb-nav main-nav">
          <h1 className="nerdle-name">Email verification</h1>
          <p className={'mt-4 mb-4'}>Your email has been verified!</p>

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

export default VerifyEmail
