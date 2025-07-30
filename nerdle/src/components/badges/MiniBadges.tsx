import { useState, useEffect } from 'react'
import { fetchAchievementData } from '../../lib/cloudStats'
import { enabledGameModes } from './EnabledGames';

/**
 * Returns a promise that resolves to the notification dot color for the cup icon.
 * - green: straight
 * - purple: nerdleverse points
 * - red: broken straight
 * - null: no dot
 */
export async function getCupNotificationDotColor(gameMode: string): Promise<string | null> {
    try {
        const achievements = await fetchAchievementData()
        if (!achievements || !enabledGameModes.includes(gameMode)) return null

        console.log('getCupNotificationDotColor', gameMode, achievements)

        const myGameMode = gameMode === '' ? 'classic' : gameMode

        // 1. Check for straight badge (not broken)
        const straightAwardObj = (achievements.data.straightAwards || []).find(
            (e: any) => e.gameMode === myGameMode
        )
        if (straightAwardObj && straightAwardObj.award && !straightAwardObj.award.broken ) {
            return '#A020F0' // purple
        }

        // 2. Check for nerdleverse points
        const nvAwardObj = (achievements.data.nerdleVerseAwards || []).find(
            (e: any) => ((e.award.largeImage != '') && (!e.award.largeImage.includes('gray')) && !e.award.smallImage.includes('gray'))
        )

        console.log('nvAwardObj', nvAwardObj)

        if (nvAwardObj && nvAwardObj.award) {
            console.log('got nvaward')  
            return '#3CB371' // green
        }

        console.log('straightAwardObj', straightAwardObj)

        // 3. Check for broken straight
        if (straightAwardObj && straightAwardObj.award && straightAwardObj.award.broken
            && !straightAwardObj.award.largeImage.includes('gray')
        ) {

            // return null if the straight award was broken more than 7 days ago
            const brokenDate = new Date(straightAwardObj.award.lastPlayed)

            const now = new Date()
            const diffDays = Math.floor((now.getTime() - brokenDate.getTime()) / (1000 * 3600 * 24))    

            if (diffDays > 6) {
                return null
            }

            return '#E53E3E' // red
        }

        // 4. No dot
        return null
    } catch (e) {
        return null
    }
}

type Props = {
    gameMode: string
    handleOpenMenu: () => void,
    handleAchievementClick: (largeImage: string) => void,
    update: boolean
}

type Achievements = {
    data: {
        straightAwards: { gameName: string, gameMode: string, award: { name: string, smallImage: string, largeImage: string } }[],
        nerdleVerseAwards: { gameName: string, gameMode: string, award: { name: string, smallImage: string, largeImage: string } }[],
        challengeAwards: { award: { name: string, smallImage: string, largeImage: string } }[]
    }
}

const MiniStreakBadge = (award: any) => {

    const streakAchievements = award.award

    if (streakAchievements && streakAchievements.smallImage != '') {

        const smallImage = streakAchievements.smallImage
        const name = streakAchievements.name

        return (
            <>
                <img src={smallImage} alt={name} style={{ width: 45, height: 45, marginRight: 2 }} />
            </>
        )
    } else {
        return <div />
    }

}

const NVPointsBadge = (award: any) => {

    const nvAchievements = award.award

    if (nvAchievements && nvAchievements.smallImage != '' /*&& nvAchievements.dateAchieved != null*/) {

        const smallImage = nvAchievements.smallImage
        const name = nvAchievements.name

        return (
            <>
                <img src={smallImage} alt={name} style={{ width: 45, height: 45, marginRight: 2 }} />
            </>
        )

    } else {
        return <div />
    }

}

const ChallengeBadge = (award: any) => {

    const challenges = award.award

    if (challenges && challenges.smallImage != '' /*&& nvAchievements.dateAchieved != null*/) {

        const smallImage = challenges.smallImage
        const name = challenges.name

        return (
            <>
                <img src={smallImage} alt={name} style={{ width: 45, height: 45, marginRight: 2 }} />
            </>
        )

    } else {
        return <div />
    }

}


export const MiniBadges = ({ gameMode, handleOpenMenu, handleAchievementClick, update }: Props) => {

    const [achievements, setAchievements] = useState({ data: { straightAwards: [], nerdleVerseAwards: [], challengeAwards: [] } } as Achievements)
    const isLoggedIn = localStorage.getItem('lbl_token') ? true : false

    useEffect(() => {

        // if we have testNoAch in local storage do not fetch achievements - for testing purposes
        if (localStorage.getItem('testNoAch')) {
            return
        }

        fetchAchievementData().then((data) => {
            setAchievements(data)
        })
    }, [update])

    let nerdleVerseAward = null
    let challengeAward = null
    var straightAward: { largeImage: any; name?: string; smallImage?: string } | null = null

    if (achievements && enabledGameModes.includes(gameMode)) {

        const straightAwards = achievements.data.straightAwards;
        let straightAwardF = straightAwards && straightAwards.length > 0 ?
            straightAwards.filter(award => award.gameMode == (gameMode == '' ? 'classic' : gameMode)) : []

        if (straightAwardF.length > 0) {
            straightAward = straightAwardF[0].award
        }

        const nerdleVerseAwards = achievements.data.nerdleVerseAwards;
        if (nerdleVerseAwards && nerdleVerseAwards.length > 0) {
            nerdleVerseAward = nerdleVerseAwards[0].award
        }

        const challegeAwards = achievements.data.challengeAwards;
        if (challegeAwards && challegeAwards.length > 0) {
            challengeAward = challegeAwards[0].award
        }

    }

    return (

        <span className="cursor-pointer left-[70px] convert-minibadges" id="miniBadges">
            {!achievements || (!straightAward && !nerdleVerseAward) ?

                enabledGameModes.includes(gameMode) === false ?
                    <div onClick={() => {
                        handleOpenMenu()
                    }}>
                        <img src="/more_games_min.webp" className="moreGamesNumBot" style={{ height: 52, paddingRight: 10, transform: 'rotate(4deg)' }}></img>
                    </div>
                    : <div />
                :
                <div>
                    <table>
                        <tr>
                            <td style={{ paddingLeft: 15 }}
                                onClick={() => {
                                    if (straightAward !== null) {
                                        handleAchievementClick(straightAward.largeImage)
                                    }
                                }}
                            >
                                <MiniStreakBadge
                                    award={straightAward}
                                />
                                
                            </td>
                            <td
                                onClick={() => {
                                    if (straightAward) {
                                        handleAchievementClick(straightAward.largeImage)
                                    } 
                                }}
                            >
                                <NVPointsBadge
                                    award={nerdleVerseAward}
                                />
                            </td>

                            <td style={{display: 'flex'}}
                                onClick={() => {
                                    if (straightAward) {
                                        handleAchievementClick(straightAward.largeImage)
                                    }
                                }}
                            >
                                <ChallengeBadge
                                    award={challengeAward}
                                />
                                {!isLoggedIn && <img src="/badges/badges_pointer.png" alt="lock" style={{ height: 45, marginRight: 2 }} />}

                            </td>

                            <td>
                                {/* <img src='https://nerdlegame.com/badges/challenges/advent.png' alt='nerdle advent challenge' style={{width:45, height:45, marginRight:2}}/> */}
                            </td>
                        </tr>
                    </table>
                </div>
            }

        </span>
    )

}
