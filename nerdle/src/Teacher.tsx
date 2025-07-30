import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfile } from './lib/cloudStats'
import { TeacherLink} from './components/modals/TeacherLink'
import './index.css'
import { get } from 'http'

const api_url = 'https://api.leaderboardle.com'

const Teacher = () => {
    const navigate = useNavigate()
    const [isTeacher, setIsTeacher] = useState(false)
    const [teacherCodes, setTeacherCodes] = useState([{ code: '', expires: '' }])
    const [loggedIn, isLoggedIn] = useState(localStorage.getItem('lbl_token') ? true : false)
    const [email, setEmail] = useState(localStorage.getItem('userEmail') ? localStorage.getItem('userEmail') : '')
    const [isLinkOpen, setIsLinkOpen] = useState(false)
    const [link, setLink] = useState('')
    const [gameName, setGameName] = useState('')

    //   let { token } = useParams()

    useEffect(() => {

        getProfile((profile) => {
            console.log('got profile')
            console.log(profile)
            if (profile.teacher === true) {
                setIsTeacher(true)

                getTeacherCodes()

            } else {
                setIsTeacher(false)
            }
        })

    }, []);

    const createCode = () => {

        let token = localStorage.getItem('lbl_token')

        // fetch user/teachercode/create
        fetch(`${api_url}/user/teachercode/create`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },

        }).then((response) => response.json())
            .then((json) => {
                console.log(json)
                getTeacherCodes()
            });

    }

    const getTeacherCodes = () => {

        let token = localStorage.getItem('lbl_token')

        fetch(`${api_url}/user/teachercodes/get`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => response.json())
            .then((json) => {
                if (json.teacherCodes) {
                    
                    // sort json.teacherCodes by 'expires' DESCENDING
                    json.teacherCodes.sort((a: any, b: any) => new Date(b.expires).getTime() - new Date(a.expires).getTime())

                    // remove any that have expired already
                    json.teacherCodes = json.teacherCodes.filter((code: any) => new Date(code.expires).getTime() > new Date().getTime())

                    // now shrink array to only first element
                    json.teacherCodes = json.teacherCodes.slice(0, 1)

                    console.log(json)
                    setTeacherCodes(json.teacherCodes)
                }
            });

    }

    const prettifyDate = (date: string) => {
        return new Date(date).toLocaleDateString()
    }

    return (
        <div className={'flex flex-row justify-center mt-4'}>
            <div className="max-w-[100%] w-[450px] items-center text-center">
                <div className="max-w-[95%] w-[440px] mx-auto pb-nav main-nav">
                    <h1 className="nerdle-name">Hey teach!</h1>

                    {!loggedIn && <p className={'mt-4 mb-2'}>(you are not currently logged in)  </p>}
                    {loggedIn && !isTeacher &&
                        <p className={'mt-4 mb-2'}>
                            (you are logged in as {email} but this account is not yet registered as a teacher account)
                        </p>
                    }
                    {loggedIn && isTeacher &&
                        <p className={'mt-4 mb-2'}>
                            (you are logged in as {email} with an active teacher account)
                        </p>
                    }
                    <img src="/numbot_tracks.png" />



                    <p className={'mt-4 mb-2'}>There's nothing we love more than nerdle played in school.  So here are some tools to make that a bit easier for you...</p>


                    <h1 className={'mt-4 text-lg'}><b>ad free in the classroom</b></h1>

                    {isTeacher &&
                        <p className="mb-2">Create a teacher code below and share it with your class for an ad-free nerdle experience.
                        </p>}


                    {!isTeacher && loggedIn && <p className={'mb-2'}>
                        To upgrade your nerdle account and enable ad-free nerdling for the whole class,
                        just send an email to <a className="underline pointer" href="mailto:contact@nerdlegame.com">contact@nerdlegame.com</a> requesting a teacher account.
                    </p>}

                    {!isTeacher && !loggedIn && <p className={'mb-2'}>
                        Register for a teacher account to enable ad-free nerdling for the whole class.  
                        Just sign-up for a nerdle account with your school email address then send an email to{" "}
                        <a className="underline pointer" href="mailto:contact@nerdlegame.com">contact@nerdlegame.com</a> requesting a teacher account.
                    </p>}

                    {isTeacher && <button
                        className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={createCode}
                    >
                        Create a teacher code
                    </button>}


                    {isTeacher && <div className="mt-4">

                        <h2 className="text-lg">Your teacher code:</h2>
                        <ul>
                            {teacherCodes.map((code) => {

                                // if code has not expired (code.expires > now) don't really need this now cos we now handle in fetch above
                                if (code.expires > new Date().toISOString()) {

                                    return <li>{code.code} - expires: {prettifyDate(code.expires)} <br />
                         

                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/school/${code.code}`)
                                            setGameName('classic')
                                            setIsLinkOpen(true) 
                                        } }> classic</span>,{" "}


                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://midi.nerdlegame.com/school/${code.code}`)
                                            setGameName('midi')
                                            setIsLinkOpen(true) 
                                        } }> midi</span>,{" "}

                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://mini.nerdlegame.com/school/${code.code}`)
                                            setGameName('mini')
                                            setIsLinkOpen(true) 
                                        } }> mini</span>,{" "}

                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://micro.nerdlegame.com/school/${code.code}`)
                                            setGameName('micro')
                                            setIsLinkOpen(true) 
                                        } }> micro</span>,{" "}


                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://bi.nerdlegame.com/school/${code.code}`)
                                            setGameName('bi')
                                            setIsLinkOpen(true) 
                                        } }> bi</span>,{" "}

                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://quad.nerdlegame.com/school/${code.code}`)
                                            setGameName('quad')
                                            setIsLinkOpen(true) 
                                        } }> quad</span>

                                        <br/>
                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/crossnerdle/school/${code.code}`)
                                            setGameName('cross nerdle')
                                            setIsLinkOpen(true) 
                                        } }> cross nerdle</span>,{" "}

                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/s/targets/school/${code.code}`)
                                            setGameName('targets')
                                            setIsLinkOpen(true) 
                                        } }> targets</span>,{" "}

                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/maffdoku/school/${code.code}`)
                                            setGameName('maffdoku')
                                            setIsLinkOpen(true) 
                                        } }> maffdoku</span>
                                    
                                        <br/>
                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/s/2dnerdle/school/${code.code}`)
                                            setGameName('2d nerdle')
                                            setIsLinkOpen(true) 
                                        } }> 2d nerdle</span>,{" "}
                                    
                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/s/shuffle/school/${code.code}`)
                                            setGameName('shuffle')
                                            setIsLinkOpen(true) 
                                        } }> shuffle</span>,{" "}
                                    
                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/nanagrams/school/${code.code}`)
                                            setGameName('nanagrams')
                                            setIsLinkOpen(true) 
                                        } }> nanagrams</span><br />
                                    
                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/decoy/school/${code.code}`)
                                            setGameName('decoy')
                                            setIsLinkOpen(true) 
                                        } }> decoy</span>, {" "}                                  
                          
                                         <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://nerdlegame.com/twords/school/${code.code}`)
                                            setGameName('twords')
                                            setIsLinkOpen(true) 
                                        } }> twords</span>, {" "}                                  
 
                                        <span className="underline pointer" style={{cursor:'pointer'}} onClick={() => { 
                                            setLink(`https://cup.nerdlegame.com/cup/home/?school/${code.code}`)
                                            setGameName('nerdle cup')
                                            setIsLinkOpen(true) 
                                        } }> nerdle cup</span>

                                        </li>

                                } else {
                                    return <div />
                                }
                            })}
                        </ul>

                    </div>}

                    <h2 className={'mt-4 text-lg'}><b>pro nerdle for the classroom</b></h2>
                    <p><a className="underline pointer" href="https://www.nerdlegame.com/create.html">set your own nerdle</a></p>

                    <h2 className={'mt-4 text-lg'}><b>nerdle cup for the classroom</b></h2>
                    <p><a className="underline pointer" href="https://cup.nerdlegame.com/">multi-player nerdle</a></p>

                    <h2 className={'mt-4 text-lg'}><b>spread the word</b></h2>
                    <p>
                        any teacher can register for a teacher account
                        Just ask them to email <a className="underline pointer" href="mailto:contact@nerdlegame.com">contact@nerdlegame.com</a> from their school email address
                    </p>


                    <button
                        className="bg-[#820458] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-8"
                        onClick={() => window.location.href = '/game'}
                    >
                        Back to game!
                    </button>

                </div>
            </div>

            <TeacherLink isOpen={isLinkOpen} handleClose={() => setIsLinkOpen(false)} link={link} gameName={gameName} />

        </div>
    )
}

export default Teacher
