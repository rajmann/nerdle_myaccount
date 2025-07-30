import { getGuessStatuses } from './statuses'
import { isMobile } from 'react-device-detect';
import { postToFlutter } from './isPWA';

declare var window: any

export const shareText = (withURL:boolean, guesses:string[], solution:string, solutionIndex: number, timerString:String, hasClueRow:boolean, clueGameIndex:string, numRows:number=6) => {

  const validGameModes = ['', 'micro', 'mini', 'midi', 'maxi', 'speed', 'instant', 'pro'];
  const gameMode = localStorage.getItem('gameMode') || ''

  // if gameMode is NOT in validGameModes then set to ''
  if (!validGameModes.includes(gameMode)) {
    localStorage.setItem('gameMode', '')
  }

  var text = ""

  if (gameMode === 'pro' || gameMode === 'speed') {
    text = gameMode + " nerdlegame " + (gameMode==='speed'?(solutionIndex+1)+' ':'') +  "solved" + (timerString===""?"":" in " + timerString) + "!\n\n" +
           generateEmojiGrid(guesses, solution, gameMode) + (timerString===""?"":"⏱️")
    if (gameMode === 'pro') {
        //text = text +  "\n\nCustom game code: " + window.location.pathname.substring(1)
        text = window.location.href + "\n" 
        text = text + "Can you solve this special nerdle game?"
        text = text + "\nMy score: " + (guesses.length - (hasClueRow?1:0)) + '/' + numRows
        text = text + ". Now it’s your turn!"
    }

    return text
  } 

  if (gameMode === 'instant') {
    let text = `\n🟩 🟪 ⬛️ Instant Nerdle ${(solutionIndex+1)} solved in ${timerString}!`
    return text
  }
  
  text = (gameMode===''?'':gameMode+' ') + 'nerdlegame ' +
          (solutionIndex+1) + ' ' + (guesses.length - (hasClueRow?1:0)) + '/6\n\n' +
           generateEmojiGrid(guesses, solution, gameMode)

  return text
}

export const shareStatus = (guesses: string[], solutionIndex: number, solution:string, timerString:String, hasClueRow:boolean, clueGameIndex:string) => {

  const doMobileShare =  () => {
    if (isMobile && navigator.share) {
      navigator
        .share({
          text: clueGameIndex=='' ? shareText(false, guesses, solution, solutionIndex, timerString, hasClueRow, clueGameIndex) : '',
          url: clueGameIndex!=='' ? 'https://clue.nerdlegame.com/clue/'+clueGameIndex+'/' + (guesses.length - (hasClueRow?1:0)) : undefined
        })
        .then(() => {
          console.log('Successfully shared');
        })
        .catch(error => {
          console.error('Something went wrong sharing the score', error);
        });
    }

    if (!navigator.share && (window.navigator.userAgent.includes('Nerdle/1.0') || window.isMobileApp)) {
      //send message to native app
      const text = clueGameIndex=='' ? shareText(false, guesses, solution, solutionIndex, timerString, hasClueRow, clueGameIndex) : ''
      const url = clueGameIndex!=='' ? 'https://clue.nerdlegame.com/clue/'+clueGameIndex+'/' + (guesses.length - (hasClueRow?1:0)) : undefined
      if (url!==undefined) {
        postToFlutter('share:' + url)
      } else {
        postToFlutter('share:' + text)
      }
    }
  }

  try {

    let doneNavShare = false;

    // do this first cos the navigator.share action may put this page in the background, preventing copy?
    let textToShare = ''
    if (clueGameIndex!=='') {
      textToShare = 'https://clue.nerdlegame.com/clue/'+clueGameIndex+'/' + (guesses.length - (hasClueRow?1:0))
    } else {
      textToShare = shareText(false, guesses, solution, solutionIndex, timerString, hasClueRow, clueGameIndex)
    }

    if (!navigator.share && (window.navigator.userAgent.includes('Nerdle/1.0') || window.isMobileApp)) {
      doMobileShare()
      doneNavShare = true
    }

    navigator.clipboard.writeText(textToShare).then(() => {
      //only do share AFTER copy has finished
      console.log('written to clipboard', textToShare)
      if (!doneNavShare) {
        doMobileShare()
      }
    })
  } catch (err) {
    //share failed, do copy .. 
    console.error('Failed to write to clipboard: ', err);
    doMobileShare()
  }


}

export const generateEmojiGrid = (guesses: string[], solution:string, gameMode: string) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess, solution)
      return guess
        .split('')
        .map((letter, i) => {
          switch (status[i]) {
            case 'correct':
              return '🟩'
            case 'present':
              return '🟪'
            default:
              return gameMode==='pro'?'🔲':'⬛'
          }
        })
        .join('')
    })
    .join('\n')
}
