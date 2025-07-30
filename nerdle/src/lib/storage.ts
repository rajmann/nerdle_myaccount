import { saveStatsToCloud, getCloudStats, getGameDiary } from './cloudStats'
import { mpTrack, mpTrackIfEnabled } from './mixpanel'

const gameStateKey = 'gameState'
const statsStateKey = 'statsState'
const deviceStatsStateKey = 'deviceStatsState'
const miniGameStateKey = 'miniGameState'

type StoredGameState = {
  guesses: string[]
  solution: string,
  gameMode: string,
}

export const defaultStatsState = {
  lastUpdated: '',
  gamesPlayed: 0,
  gamesWon: 0,
  winRows: [0,0,0,0,0,0],
  currentStreak: 0,
  maxStreak: 0,
  averageGuessTime: { gamesWon: 0, totalTime: 0 },
}

export type StoredStatsState = {
  lastUpdated: string
  gamesPlayed: number
  gamesWon: number
  winRows: number[]
  currentStreak: number
  maxStreak: number
  averageGuessTime: { gamesWon: number, totalTime: number }
}

export const saveGameState = (gameMode: string, gameState: StoredGameState) => {
  localStorage.setItem(gameMode==='mini'?miniGameStateKey:gameStateKey, JSON.stringify(gameState))
}

export const saveGameStats = (gameMode: string, statsState: StoredStatsState, winRows: number, gameIndex: number) => {
  // set statsState.lastUpdated to the ISO date - date only YYYY-MM-DD
  statsState.lastUpdated = new Date().toISOString().split('T')[0]
  localStorage.setItem(statsStateKey, JSON.stringify(statsState))
  mpTrackIfEnabled('saving stats', { statsState })
  console.log('now save stats to cloud')
  saveStatsToCloud(JSON.stringify(statsState), gameMode)
  update7DayStats(winRows, gameIndex)
}

export const loadGameState = (gameMode: string) => {
  const state = localStorage.getItem(gameMode==='mini'?miniGameStateKey:gameStateKey)

  mpTrackIfEnabled('loading game state', { state })

  return state ? (JSON.parse(state) as StoredGameState) : null
}

export const loadStatsState = async (gameMode: string) => {
  let state = localStorage.getItem(statsStateKey) || null
  mpTrackIfEnabled('loading stats state', { state })

  // try cloud storage now - if we have a token we'll get the cloud stats
  // if we don't have a token, we'll just use the local stats
  const token = localStorage.getItem('lbl_token')
  if (token) {

    mpTrackIfEnabled('getting cloud stats', { })
    const cloudState = await getCloudStats(gameMode)

    if (!cloudState.authorized) {
      console.log('not authorized to get cloud stats')
      return {stats: null, authorized: false}
    }

    if (cloudState.stats != null) {

      mpTrackIfEnabled('got cloud stats', { cloudState })

      // how many games played in cloudState?
      const cloudGamesPlayed = cloudState.stats.gamesPlayed
      // how many games played in localState?
      const localState = state ? (JSON.parse(state) as StoredStatsState) : null
      const localGamesPlayed = localState ? localState.gamesPlayed : 0

      mpTrackIfEnabled('comparing cloud and local stats', { cloudGamesPlayed, localGamesPlayed })

      // if cloudGamesPlayed < localGamesPlayed then do NOT update local state with cloudState
      if (cloudGamesPlayed >= localGamesPlayed) {
        console.log('more or equals in cloud than local, use cloud')
        mpTrackIfEnabled('using cloud stats', { cloudState })
        state = JSON.stringify(cloudState.stats)
        localStorage.setItem(statsStateKey, state)
      } else {
        console.log('less in cloud than local, use local')
      }
    }

  }

  if (state != null) {
    let stateObj = JSON.parse(state)
    // if stateObj does not contain lastUpdated set lastUpdated to ''
    if (!stateObj.lastUpdated) {
      stateObj.lastUpdated = ''
      state = JSON.stringify(stateObj)
      localStorage.setItem(statsStateKey, state)
    }
  }

  return {stats: state ? (JSON.parse(state) as StoredStatsState) : null, authorized: true}
}

// loads a copy of state state from deviceStatsState if it exists.
// if it doesn't exist it creates it based on statsState. Thus we have a backup
export const loadDeviceStatsState = () => {
  mpTrackIfEnabled('loading device stats state', { deviceStatsStateKey })
  let state = localStorage.getItem(deviceStatsStateKey) || null
  // if state is null, load from statsStateKey and save to deviceStatsStateKey
  if (!state) {
    mpTrackIfEnabled('no device stats', {});
    const statsState =  localStorage.getItem(statsStateKey) || null
    if (statsState) {
      mpTrackIfEnabled('using regular stats for device stats', { });
      localStorage.setItem(deviceStatsStateKey, statsState)
      state = statsState
    }
  }

  return state ? (JSON.parse(state) as StoredStatsState) : defaultStatsState
}

// saves passed statsState to deviceStatsState
export const saveDeviceGameStats = (statsState: StoredStatsState) => {
  localStorage.setItem(deviceStatsStateKey, JSON.stringify(statsState))
}


const update7DayStats = (winRows: number, gameIndex: number) => {
   // retrieve and update lastSevenDaysScores from localStorage. lastSevenDaysScores looks like this:
  // [{date: '2021-01-01', gameIndex: 0, rows: 0}, {date: '2021-01-02', gameIndex: 0, rows: 0}, ...]
  const lastSevenDaysScores = JSON.parse(localStorage.getItem('lastSevenDaysScores') || '[]')
  // get today's date
  const today = new Date().toISOString().split('T')[0]
  // find today's score in lastSevenDaysScores
  const todayScore = lastSevenDaysScores.find((score: { date: string }) => score.date === today)
  // if today's score is found replace rows with winRows
  if (todayScore) {
    todayScore.rows = winRows
  } else {
    // if today's score is not found, add it to lastSevenDaysScores
    lastSevenDaysScores.push({ date: today, rows: winRows, gameIndex: gameIndex+1 })
  }
  // keep only last 7 days, so sort by date and slice to last 7
  const sortedScores = lastSevenDaysScores.sort((a: { date: string }, b: { date: string }) => {
    return a.date > b.date ? 1 : -1
  } )
  const lastSevenDays = sortedScores.slice(-7)
  // save lastSevenDays to localStorage
  localStorage.setItem('lastSevenDaysScores', JSON.stringify(lastSevenDays))
}

const update7DaysStatsFromDiary = (diary: any) => {

  // retrieve and update lastSevenDaysScores from localStorage. lastSevenDaysScores looks like this:
  // [{date: '2021-01-01', gameIndex: 0, rows: 0}, {date: '2021-01-02', gameIndex: 0, rows: 0}, ...]
  const lastSevenDaysScores = JSON.parse(localStorage.getItem('lastSevenDaysScores') || '[]')
  // get today's date
  const today = new Date().toISOString().split('T')[0]

  // find today's score in gameDiary (diary.data.today)


}