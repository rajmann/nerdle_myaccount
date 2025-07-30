
import { useState, useEffect } from 'react'
import { SmallBadge } from './SmallBadge'

type Props = {
    achievements: any,
    gameMode: string,
    setAchievementLargeImage: any,
    setIsAchievementModalOpen: any,
    handleClose: any,
    setCurrentTab: any,
    setThisOpen: any,
    handleLBLLogin: any,
    logEvent: any,
    hasLBLToken: any
}

export const BadgesTab =  ({ achievements, gameMode, setAchievementLargeImage, setIsAchievementModalOpen, handleClose, setCurrentTab, setThisOpen, handleLBLLogin, logEvent, hasLBLToken }: any) => {

return (

    <>
    {achievements &&
    <div className="overflow-y-scroll" style={{ flex: "1 1 0" }}>

      {/* challenges */}
      {achievements.data.challengeAwards && achievements.data.challengeAwards.map((e: any, index: number) => {

        let description = "";

        if (e.award.achievedOn) {

          var dateAchieved = new Date(e.award.achievedOn)
          // get day
          var dd = String(dateAchieved.getDate())
          // is it 'st', 'nd', 'rd', or 'th'?
          var day = dd + ('31' == dd || '21' == dd || '1' == dd ? 'st' : '22' == dd || '2' == dd ? 'nd' : '23' == dd || '3' == dd ? 'rd' : 'th')
          // get long month
          var month = dateAchieved.toLocaleString('default', { month: 'long' })

          description = "Completed on " + day + " " + month

          e.award.largeImage = e.award.smallImage

        } else {

          description = "Play add-vent"

        }

        if (description == "") {
          return <div />
        }

        const myGameMode = gameMode ? (gameMode === '' ? 'classic' : gameMode) : ''

        return (

          <span
            onClick={() => {
              if (!e.award.achievedOn) {
                window.location.href = 'https://www.nerdlegame.com/advent24/index.html'
              }
            }}>

            <SmallBadge key={index} award={e} description={description} title="challenges" measure="points" gameMode={myGameMode}
              handleBadgeClick={(largeImage) => {
                setAchievementLargeImage(largeImage)
                setIsAchievementModalOpen(true)
              }}
            />

          </span>

        )

      })}     


      {/* straight badges */}
      {achievements.data.straightAwards.map((e: any, index: number) => {

        const awardGameMode = e.gameMode
        const myGameMode = (gameMode === '' ? 'classic' : gameMode)

        let description = <span>Well done!</span>
        if (e.award.broken) {

          var dateAchieved = new Date(e.award.lastPlayed)

          // is dateAchieved a valid date?
          if (isNaN(dateAchieved.getTime())) {

            description = <span>To unlock your 7 day straight badge, keep playing!</span>

          } else {

            // get day
            var dd = String(dateAchieved.getDate())
            // is it 'st', 'nd', 'rd', or 'th'?
            var day = dd + ('31' == dd || '21' == dd || '1' == dd ? 'st' : '22' == dd || '2' == dd ? 'nd' : '23' == dd || '3' == dd ? 'rd' : 'th')
            // get long month
            var month = dateAchieved.toLocaleString('default', { month: 'long' })

            description =
              <>
                <span>{"Last achieved " + day + " " + month}.</span>{" "}
                <span className="underline cursor-pointer">Fix it</span>
              </>
          }
        } else {

          // if (awardGameMode == myGameMode) {

            // get current UTC date at midnight as ISO string
            const todayUTC = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'
            // const myStraight = (achievements && achievements.data && achievements.data.straights) ? achievements.data.straights.find((e: any) => e.gameMode == myGameMode) : null
            // if (myStraight) {
            const lastPlayed = e.award.lastPlayed

            if (lastPlayed) {
              // const lastPlayed = myStraight.lastPlayed
              // convert to ISO string
              const lastPlayedISO = new Date(lastPlayed).toISOString()

              // if today's game has not been played, description is "Play today"
              if (lastPlayedISO != todayUTC) {
                e.award.linkToGame = true
                description =
                  <>
                    <span className="underline cursor-pointer">Play today's game</span>
                  </>
              }

            } else {
              // we may be logged out
              // get lastPlayed from local storage
              const lastPlayed = JSON.parse(localStorage.getItem('lastPlayed') || '[]')
              const lastPlayedDate = lastPlayed[myGameMode||'']

              if (lastPlayedDate) {
                // convert to ISO string
                const lastPlayedISO = new Date(lastPlayedDate).toISOString()
                // if today's game has not been played, description is "Play today"
                if (lastPlayedISO != todayUTC) {
                  e.award.linkToGame = true
                  description =
                    <>
                      <span className="underline cursor-pointer">Play today's game</span>
                    </>
                }
              
              }
            }

          // }

        }

        return (

          <SmallBadge key={index} award={e} description={description} measure="days" gameMode={awardGameMode}
            handleBadgeClick={(largeImage) => {

              const parts = largeImage.split('/')
              const badgeType = parts[4]
              const lastPart = parts[parts.length - 1]
              const badgeNumber = lastPart.split('.')[0]

              let badgeGameMode  = ""
              if (badgeType === 'straights') {
                badgeGameMode = parts[6]
              }

              logEvent(`award_badge_click_stats_${badgeType}_${badgeNumber}_${badgeGameMode}` + hasLBLToken ? '_registered' : '_unregistered');

              if (e.award.broken) {
                if (awardGameMode == myGameMode) {
                  setCurrentTab('stats')
                } else {
                  // redirect to www.nerdlegame.com/replay.html
                  //window.location.href = 'https://www.nerdlegame.com/replay.html'
                  if (awardGameMode != 'classic') {
                    window.location.href = 'https://' + awardGameMode + '.nerdlegame.com/stats/stats'
                  } else {
                    window.location.href = 'https://nerdlegame.com/stats/stats'
                  }
                }
              } else {
                if (e.award.linkToGame) {
                  if (awardGameMode == myGameMode) {
                    // close the modal
                    handleClose()
                    setThisOpen(false)
                    // go to /game
                    window.location.href = '/game'
                  } else {
                    // this will work for all games currently supported but we will need to do something else in future if we add non nerdlegame.com games ... 
                    window.location.href = 'https://' + awardGameMode + '.nerdlegame.com'
                  }
                } else {
                  setAchievementLargeImage(largeImage)
                  setIsAchievementModalOpen(true)
                }
              }

              // if (e.award.broken || e.award.linkToGame) {
              //   // go to game diary
              //   if (awardGameMode == myGameMode) {
              //     if (e.award.linkToGame) {
              //       // close the modal
              //       handleClose()
              //       setThisOpen(false)
              //       // go to /game
              //       window.location.href = '/game'
              //     } else {
              //       setCurrentTab('stats')
              //     }
              //   } else {
              //     // redirect to www.nerdlegame.com/replay.html
              //     window.location.href = 'https://www.nerdlegame.com/replay.html'
              //   }
              // } else {
              //   setAchievementLargeImage(largeImage)
              //   setIsAchievementModalOpen(true)
              // }
            }} />

        )

      })}

      {/* nerdleverse points */}
      {achievements.data.nerdleVerseAwards && achievements.data.nerdleVerseAwards.map((e: any, index: number) => {

        let description = "";

        if (e.award.dateAchieved) {

          var dateAchieved = new Date(e.award.dateAchieved)
          // get day
          var dd = String(dateAchieved.getDate())
          // is it 'st', 'nd', 'rd', or 'th'?
          var day = dd + ('31' == dd || '21' == dd || '1' == dd ? 'st' : '22' == dd || '2' == dd ? 'nd' : '23' == dd || '3' == dd ? 'rd' : 'th')
          // get long month
          var month = dateAchieved.toLocaleString('default', { month: 'long' })

          description = "Completed on " + day + " " + month

        } else {
          if (e.award.smallImage.includes('gray')) {
            description = e.award.nextRuleDays + " points to go"
          }
        }

        if (description == "") {
          return <div />
        }
        
        const myGameMode = gameMode ? (gameMode === '' ? 'classic' : gameMode) : ''

        return (

          <>

          <SmallBadge key={index} award={e} description={description} title="nerdleverse" measure="points" gameMode={myGameMode}
            handleBadgeClick={(largeImage) => {
              setAchievementLargeImage(largeImage)
              setIsAchievementModalOpen(true)
            }}
          />

          {e.award.points && (
            <div className="mt-2">{e.award.points} nerdleverse points this week</div>
          )}

          </>

        )

      })}

      {achievements.data.offline && (
        <span className="mt-2 dark:text-[#D7DADC] text-sm text-center cursor-pointer   underline"
          onClick={() => {
            handleLBLLogin(2)
          }}
        >Log in / sign up for more awards</span>
      )}

    <div
      className="mt-6 dark:text-[#D7DADC] text-lg text-center"
      style={{ marginTop: 10, marginBottom: 10 }}
    >
      <a href="https://faqs.nerdlegame.com/?faq=badges_earn" className="focus:outline-none underline font-bold">How do I earn badges?</a>
    </div>

    </div>}

  </>

)

}