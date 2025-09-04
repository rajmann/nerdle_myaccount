import {defaultStatsState } from './storage'
import { mpTrackIfEnabled } from './mixpanel'
import { getLocalStraights } from './localStraights'

declare var window: any
declare var _conv_q: any

var api_url = 'https://api.leaderboardle.com'
// if (window.location.hostname.includes('localhost')) {
//     api_url = 'http://localhost:3001/prod'
// }

export const saveStatsToCloud = (stats: string, gameName: string) => {
   
    const token = localStorage.getItem('lbl_token')
 
    console.log('save to cloud');   
    mpTrackIfEnabled('saving stats to cloud', { stats })

    if (stats && token) {
        const url = api_url + '/user/stats/update'
        const payload = {
         gameName, 
         stats,
        }
        fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
        }).then((res) => {
        if (res.status === 201) {
            // success
            res.json().then((json) => {
                console.log(json)
                mpTrackIfEnabled('stats saved to cloud', { json })
            })
        } else {
            // error
            console.log(res)
            mpTrackIfEnabled('error saving stats to cloud', { res })
        }
        })
    }
}

export const getCloudStats = async (gameName: string) => {

    mpTrackIfEnabled('getting cloud stats', { gameName })
    const token = localStorage.getItem('lbl_token')
  
    //const gameName = localStorage.getItem('gameMode')
    if (token) {
      const url = `${api_url}/user/stats/get?gameName=${gameName}`

      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
        
      })
      
      if (response.status === 200) {
        const json = await response.json()
        mpTrackIfEnabled('got cloud stats', { json })
        return {stats: json.stats, authorized: true}
      } else {

        if (response.status >= 400 && response.status < 500) {
            
            // auth error - somehow need to get user to log back in ... 
            console.log('error with token?')
            mpTrackIfEnabled('error getting cloud stats', { response })
            // remove the token from local storage, as it is invalid, tell the user to log back in
            localStorage.removeItem('lbl_token')
            localStorage.removeItem('userEmail')
            return {stats: null, authorized: false}
        
        }
        //error 
        console.log(response)
        return {stats: null, authorized: true}
      }

    } else {
      return {stats: null, authorized: true}
    }
  }

  export const store7DaysToCloud = () => {

    const gameMode = localStorage.getItem('gameMode')
    const token = localStorage.getItem('lbl_token')
    const sevenDayStats = localStorage.getItem('lastSevenDaysScores')
    // loop through lastSevenDaysScores and store each day in cloud
    if (sevenDayStats && token) {
     
      // loop through lastSevenDaysScores and store each day in cloud
      const sevenDayStatsObj = JSON.parse(sevenDayStats)
      const days = Object.keys(sevenDayStatsObj)
      days.forEach((day) => {
        const gameIndex = sevenDayStatsObj[day].gameIndex
        const winRows = sevenDayStatsObj[day].rows
        const scoreText = (gameMode===''?'':gameMode+' ') + 'nerdlegame ' + gameIndex + ' ' + winRows + '/6\n\n' 

        const url = api_url + '/user/score/create'
        fetch(url, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: scoreText,
        }).then((res) => {
          if (res.status === 201) {    
            // success
            res.json().then((json) => {
              console.log(json)
            })
          } else {
            // error
            console.log(res)
          } 
        })
      })

    }


  }

  
  export const getGameDiary = (callback: (json: any, success:boolean) => void, all:boolean=false) => {

    //const localDate = Date.parse('2023-06-21T00:00:00.000Z')
    //get localDate in this format "2023-06-21T00:00:00.000Z"

    // get local date in YYYY-MM-DD format
    const date = new Date()
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    
    const dateString = year + '-' + month + '-' + day + 'T00:00:00.000Z'
    const localDate = Date.parse(dateString)

    let gameName = 'all'
    if (!all) {
      const gameMode = localStorage.getItem('gameMode')
      gameName = gameMode==='' ? 'nerdlegame' : (gameMode==='instant' ? 'instant%20nerdle' : (gameMode==='micro' ? 'micro%20nerdle' : gameMode + '%20nerdlegame'))
      gameName = gameMode==='midi' ? 'midi%20nerdle' : gameName
    }

    const url = api_url + '/user/game-diary?game='+ gameName + '&localDate=' + localDate;

    const token = localStorage.getItem('lbl_token')
    if (token) {
      fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status === 200) {
          // success
          res.json().then((json) => {
            callback(json, true)
          })
        } else {
          // error
          console.log(res)

          if (res.status >= 400 && res.status < 500) {
            // remove the token from local storage, as it is invalid, tell the user to log back in
            localStorage.removeItem('lbl_token')
            localStorage.removeItem('userEmail')
            callback([], false)
          } else {
            callback([], true)
          }

        }
      })
    } else {
      callback([], true)
    }
  }

  export const getLeagues = (callback: (json: any) => void, all:boolean=false) => {

    //SEND LOCAL DATE IN MILLISECONDS.
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const completeDate = `${ye}-${mo}-${da}T00:00:00.000Z`;
    const currentDayForGameDate = Date.parse(completeDate);

    //const url = api_url + '/league/list?game=all&localDate=' + currentDayForGameDate + '&date=All%20time'
    const url = api_url + '/league/list?game=all&localDate=' + currentDayForGameDate + '&date=This%20week'

    const token = localStorage.getItem('lbl_token')

    if (token) {
      fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status === 200) {
          // success
          res.json().then((json) => {
            callback(json)
          })
        } else {
          // error
          console.log(res)
          callback([])
        }
      })
    } else {
      callback([])
    }

  }

  export const getLeague = (ID: string, game: string, callback: (json: any) => void, all:boolean=false) => {

    // need to map from current gameMode to LeaderboardLe internal game name
    const gameMaps: { [key: string]: string } = {
      '': 'nerdlegame',
      'mini': 'mini%20nerdlegame',
      //'binerdle',
      //'mini binerdle',
      'instant': 'instant%20nerdle',
      'speed': 'speed%20nerdlegame',
      'micro': 'micro%20nerdle',
      'maxi': 'maxi%20nerdlegame',
      //'quad nerdle',
    }

    const gameName = gameMaps[game]

    //SEND LOCAL DATE IN MILLISECONDS.
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const completeDate = `${ye}-${mo}-${da}T00:00:00.000Z`;
    const currentDayForGameDate = Date.parse(completeDate);

    const url = api_url + '/league/single?id=' + ID + '&game=' + gameName + '&date=This%20week' + '&localDate=' + currentDayForGameDate

    const token = localStorage.getItem('lbl_token')

    if (token) {
      fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status === 200) {
          // success
          res.json().then((json) => {
            callback(json)
          })
        } else {
          // error
          console.log(res)
          callback(null)
        }
      })
    } else {
      callback(null)
    }

  }

  export const createLeague = (profile: any, callback: (json: any) => void) => {
  
    const url = api_url + '/league/create';
    const token = localStorage.getItem('lbl_token')

    if (token) {
      fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', },
        body: JSON.stringify(profile),
      }).then((res) => {
        if (res.status === 201) {
          // success
          res.json().then((json) => {
            console.log('create league response: ', json)
            callback(json)
          })
        } else {
          // error
          console.log(res)
          callback(null)
        }
      })
    } else {
      callback(null)
    }
  
  }

  export const joinLeague = (inviteCode: string, callback: (statusCode: number, json: any) => void) => {
    const url = api_url + '/league/join';
    const token = localStorage.getItem('lbl_token')
    const payload = {
      inviteCode,
    }
    if (token) {
      fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', },
        body: JSON.stringify(payload),
      }).then((res) => {

        const statusCode = res.status
        res.json().then((json) => {
          console.log('join league response: ', json)
          callback(statusCode, json)
        })

      
      })
    } else {
      callback(0, null)
    }
  }

  export const deleteLeague = (ID: string, callback: (json: any) => void) => {

    const url = api_url + '/league/remove?id=' + ID;
    const token = localStorage.getItem('lbl_token')

    if (token) {
      fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', },
      }).then((res) => {
        if (res.status === 200) {
          // success
          res.json().then((json) => {
            console.log('delete league response: ', json)
            callback(json)
          })
        } else {
          // error
          console.log(res)
          callback(null)
        }
      })
    } else {
      callback(null)
    }

  }

  export const getProfile = (callback: (json: any) => void) => {
  
    const url = api_url + '/user/profile';

    const token = localStorage.getItem('lbl_token') || ""

    if (token) {

      fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status === 200) {
          // success
          res.json().then((json) => {
            console.log('Profile endpoint response:', json)
            callback(json)
          })
        } else {
          // error
          console.log(res)
          callback({})
        }
      }
      )
    } else {
      callback({})
    }
  }

  export const updatePreferences = (preferences: any, callback: (json: any) => void) => {
  
    const url = api_url + '/user/updateMarketingPreferences';
    const token = localStorage.getItem('lbl_token')

    if (token) {
      fetch(url, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', },
        body: JSON.stringify(preferences),
      }).then((res) => {
        if (res.status === 200) {
          // success
          res.json().then((json) => {
            console.log('preferences: ', json)
            callback(json)
          })
        } else {
          // error
          console.log(res)
          callback(null)
        }
      })
    } else {
      callback(null)
    }
  
  }

  export const sendEmailVerification = (email: string, callback: (json: any) => void) => {
  
    const url = api_url + '/league/send-email-verification/';
    const token = localStorage.getItem('lbl_token')

    if (token) {
      fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', },
        body: JSON.stringify({email, source:'nerdle'}),
      }).then((res) => {
        if (res.status === 200) {
          // success
          res.json().then((json) => {
            console.log('email verification: ', json)
            callback(json)
          })
        } else {
          // error
          console.log(res)
          callback(null)
        }
      })
    }

  }

  export const removeAccount = (id: string, callback: (json: any) => void) => {
  
    const url = api_url + '/account/remove?id=' + id;
    const token = localStorage.getItem('lbl_token')

    if (token) {

      fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', },
      }).then((res) => {
        if (res.status === 200) {
          // success
          res.json().then((json) => {
            console.log('remove account: ', json)
            callback(json)
          })
        } else {
          // error
          console.log(res)
          callback(null)
        }
      }
      )
    } else {
      callback(null)
    }
  
  }

// *** ACHIEVEMENTS ***
export const getAchievementData = async (updateProfile=false, challengeAwards="") => {
   
    const token = localStorage.getItem('lbl_token')
  
    if (token) {
      const url = `${api_url}/user/achievements${updateProfile ? '?updateProfile=true' : ''}${challengeAwards!="" ? '&challengeAwards=' + challengeAwards : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
        
      })
      
      if (response.status === 200) {
        const json = await response.json()

        // replace achievementsOld with achievements
        localStorage.setItem('achievementsOld', localStorage.getItem('achievements') || '')
        localStorage.setItem('achievements', JSON.stringify(json))

        // record the last time we fetched achievements
        const date = new Date()
        const timestamp = date.toISOString()
        localStorage.setItem('lastAchievementsFetch', timestamp)

        return json
      } else {

        if (response.status >= 400 && response.status < 500) {
            
            // auth error - somehow need to get user to log back in ... 
            console.log('error')
            // remove the token from local storage, as it is invalid, tell the user to log back in
            localStorage.removeItem('lbl_token')
            localStorage.removeItem('userEmail')
        
        }
        //error 
        return null
      }

    } else {
        return null
    }
  }

export const fetchAchievementData = async (updateProfile=false, updChallengeAwards="") => {

    // when did we last fetch achievement data?
    const lastFetch = localStorage.getItem('lastAchievementFetch') || '0'
    // if it was less than 1 minute ago, return the data from local storage
    if (new Date().getTime() - parseInt(lastFetch) < 60000) {
        return JSON.parse(localStorage.getItem('achievements') || '')
    }

    // otherwise, fetch the data from the server
    var achievementData = await getAchievementData(updateProfile, updChallengeAwards)

    if (!achievementData) {

      // if we got null then look for local storage
      const localStraightAwards = getLocalStraights()

      if (localStraightAwards) {
          achievementData = {
              data: {
                  straightAwards: [{ gameName: 'classic', gameMode: 'classic', award: localStraightAwards }],
                  nerdleVerseAwards: [{ gameName: 'classic', gameMode: 'classic', award: { name: 'nerdleverse', smallImage: '', largeImage: '' } }],
                  offline: true
              }
          }
      } else {

        achievementData = {
          data: {
              straightAwards: [{ gameName: 'classic', gameMode: 'classic', award: 

                { name: '7 day straight', 
                  smallImage: 'https://nerdlegame.com/badges/straights/small/7_gray.png', 
                  largeImage: 'https://nerdlegame.com/badges/straights/large/7_gray.png',
                  broken:true }
               }],
              nerdleVerseAwards: [{ gameName: 'classic', gameMode: 'classic', award: { name: 'nerdleverse', smallImage: '', largeImage: '' } }],
              offline: true
          }
      }
      }
    }

    // if there are no straightAwards then create one which is the gray 7 day straight award
    if (achievementData && achievementData.data) {

        // do we have any straightAwards for the CURRENT gameMode?
        let gameMode = localStorage.getItem('gameMode')
        if (gameMode == '') {
          gameMode = 'classic'
        }
        const straightAwards = achievementData.data.straightAwards.filter((award: any) => award.gameMode === gameMode)
        if (straightAwards.length === 0) {
          achievementData.data.straightAwards.push({ gameName: gameMode, gameMode: gameMode, 
            award: { name: '7 day straight', 
                    smallImage: 'https://nerdlegame.com/badges/straights/small/7_gray.png', 
                    largeImage: 'https://nerdlegame.com/badges/straights/large/7_gray.png',
                    broken:true } })
        }
    }

    // ** ADVENT 2024 CHALLENGE ** 
    if (!achievementData.data.challengeAwards) {
      achievementData.data.challengeAwards = []
    }
    const challengeAwards = JSON.parse(localStorage.getItem('challengeAwards') || '[]')
    let foundAdventChallenge = false
    // if we have one with name='Advent 2024 Challenge' then get achievedOn. If achievedOn is today or yesterday then add it to the achievementData
    const adventChallenge = challengeAwards.find((award: any) => award.name === 'Advent 2024 Challenge')
    if (adventChallenge) {
      const achievedOn = adventChallenge.achievedOn.split('T')[0]
      const date = new Date()
      const today = date.toISOString().split('T')[0]
      date.setDate(date.getDate() - 1)
      const yesterday = date.toISOString().split('T')[0]

      if (achievedOn === today || achievedOn === yesterday) {
        //achievementData.data.challengeAwards = [{ award: adventChallenge }]
        achievementData.data.challengeAwards.push({ award: adventChallenge })
        foundAdventChallenge = true
      }
    } 
    if (!foundAdventChallenge) {
      // if today is 1st December 2024 to 25 December 2024 add a gray one
      const date = new Date()
      const today = date.toISOString().split('T')[0]
      const year = today.split('-')[0]
      const month = today.split('-')[1]
      const day = today.split('-')[2]
      if (year === '2024' && month === '12' && parseInt(day) >= 1 && parseInt(day) <= 25) {
        achievementData.data.challengeAwards.push({ award: 
          { name: 'Advent 2024 Challenge', 
            smallImage: 'https://nerdlegame.com/badges/challenges/advent_gray.png', 
            largeImage:  'https://nerdlegame.com/badges/challenges/advent_gray.png', 
            broken:true
          } })
      }

    }
    // ** END ADVENT 2024 CHALLENGE **

    // CONVERT GOALS 
    window._conv_q = window._conv_q || [];  
    const lastPlayed = JSON.parse(localStorage.getItem('lastPlayed') || '{}')
    let lastPlayedDate = lastPlayed['crossnerdle']
    let daysBetween = lastPlayedDate === undefined ? 1 : Math.floor((new Date().getTime() - new Date(lastPlayedDate).getTime()) / (1000 * 60 * 60 * 24))        
    if (daysBetween <= 1) {
      let currentStraight = parseInt(localStorage.getItem('currentStraight_crossnerdle') || '0') 
      if (currentStraight >= 3) {
        _conv_q.push(["triggerConversion", "100484746"]);   
      }
      if (currentStraight >= 5) {
        _conv_q.push(["triggerConversion", "100484747"]);   
      }
      if (currentStraight >= 7) {
        _conv_q.push(["triggerConversion", "100484748"]);
      }
    }
    lastPlayedDate = lastPlayed['classic']
    daysBetween = lastPlayedDate === undefined ? 1 : Math.floor((new Date().getTime() - new Date(lastPlayedDate).getTime()) / (1000 * 60 * 60 * 24))        
    if (daysBetween <= 1) {
      let currentStraight = parseInt(localStorage.getItem('currentStraight') || '0') 
      if (currentStraight >= 3) {
        _conv_q.push(["triggerConversion", "100484750"]);   
      }
      if (currentStraight >= 5) {
        _conv_q.push(["triggerConversion", "100484751"]);   
      }
      if (currentStraight >= 7) {
        _conv_q.push(["triggerConversion", "100484752"]);
      }
    }

    return achievementData

}
// *** ACHIEVEMENTS ***