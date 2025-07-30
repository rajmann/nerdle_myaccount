import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './index.css'
import { postToFlutter } from './lib/isPWA'
import { LBLLoginModal } from './components/modals/LBLLoginModal'

const AppSplashScreen = () => {
    const navigate = useNavigate()
    const [isLBLLoginOpen, setIsLBLLoginOpen] = useState(false)

    return (
        <div className={'flex flex-row justify-center mt-4'}>
            <div className="max-w-[100%] w-[450px] items-center text-center">
                <div className="max-w-[95%] w-[440px] mx-auto pb-nav main-nav">

                    <img src="/app_splash_logo_small.png" className="mx-auto" />

                    <p className="mx-2">Welcome to the new <span style={{ fontFamily: 'Quicksand, sans-serif', color: '#820458' }}>nerdle</span> app. To get started please choose one of the following:</p>


                    <button
                        className="bg-[#398874] hover:bg-gray-700 text-white py-2 px-4 rounded mt-4"
                        onClick={() => {
                            window.location.href = '/game';
                        }}
                    >
                        I'm new to <span style={{ fontFamily: 'Quicksand, sans-serif' }}>nerdle</span> and don't have stats to import. Let's go!
                    </button>

                    <button
                        className="bg-[#820458] hover:bg-gray-700 text-white py-2 px-4 rounded mt-2"
                        onClick={() => setIsLBLLoginOpen(true)}
                    >
                        I've got a <span style={{ fontFamily: 'Quicksand, sans-serif' }}>nerdle</span> account. Log me in and import my stats ...
                    </button>


                    <button
                        className="bg-[#398874] hover:bg-gray-700 text-white py-2 px-4 rounded mt-2"
                        onClick={() => postToFlutter('noAndroidStats:' + window.location.host)}
                    >
                        I don't have a <span style={{ fontFamily: 'Quicksand, sans-serif' }}>nerdle</span> account. Tell me how I can import my stats from the old app.
                    </button>

                    <p className="text-sm mt-4">This new app stores stats in a different place. So if you have just upgraded and don't have a{" "}
                        <span style={{ fontFamily: 'Quicksand, sans-serif', color: '#820458' }}>nerdle</span> account you will need to import your stats from Chrome.
                    </p>

                </div>
            </div>

            <LBLLoginModal
                isOpen={isLBLLoginOpen}
                handleClose={() => {
                    setIsLBLLoginOpen(false)
                }}
                scoreText={''}
                handleLogin={() => {
                    setIsLBLLoginOpen(false)
                    window.location.href = '/game';
                }}
            />

        </div>
    )
}

export default AppSplashScreen
