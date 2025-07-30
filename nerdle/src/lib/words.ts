import { Md5 } from 'ts-md5';

const MICROEPOCH = 1662249600000
const MAINEPOCH = 1642636800000
const INSTANTEPOCH = 1643846400000
const MAXIEPOCH = 1674172800000 //1667433600000
const MIDIEPOCH = 1679443200000 //22nd March 2023

export const isWinningWord = (solution: string, word: string) => {
  return solution === word
}

export const getDayIndex = (gameName: string, useLocalTime: boolean = false) => {

  //const epochMs = gameName === 'micro' ? MICROEPOCH : MAINEPOCH

  let epochMs = MAINEPOCH
  if (gameName === 'micro') {
    epochMs = MICROEPOCH
  }
  if (gameName === 'maxi') {
    epochMs = MAXIEPOCH
  }

  let maxSolutions = 13017
  switch (gameName) {
    case 'micro': maxSolutions = 127; break;
    case 'mini': maxSolutions = 412; break;
    case 'maxi': maxSolutions = 20000; break;
    case 'midi': maxSolutions = 5828 /*6661*/ ; break;
    default: maxSolutions = 13017;
  }
  const now = Date.now()
  const msInDay = 86400000
  let index = Math.abs(Math.floor((now - epochMs) / msInDay) % maxSolutions)
  let externalIndex = Math.abs(Math.floor((now - epochMs) / msInDay))

  if (useLocalTime) {
    const offset = new Date().getTimezoneOffset() * 60000
    const localTime = now - offset
    index = Math.abs(Math.floor((localTime - epochMs) / msInDay) % maxSolutions)
    externalIndex = Math.abs(Math.floor((localTime - epochMs) / msInDay))
  } 

  return {
    filename: Md5.hashStr(`${index}`),
    solutionIndex: index,
    externalIndex: externalIndex,
  }
}

export const getIndexFromDate = (date: string, gameName: string) => {  // date is a string in the format of 'YYYYMMDD'     
  //const epochMs = 1642636800000
  //const epochMs = gameName === 'micro' ? MICROEPOCH : MAINEPOCH

  let epochMs = MAINEPOCH
  if (gameName === 'micro') {
    epochMs = MICROEPOCH
  }
  if (gameName === 'maxi') {
    epochMs = MAXIEPOCH
  }

  let maxSolutions = 13017
  switch (gameName) {
    case 'micro': maxSolutions = 127; break;
    case 'mini': maxSolutions = 412; break;
    case 'maxi': maxSolutions = 20000; break;
    case 'midi': maxSolutions = 6661; break;
    default: maxSolutions = 13017;
  }
  const now = Date.now()
  let d = new Date(date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'))  // date is a string in the format of 'YYYYMMDD'
  d.setUTCHours(0,0,0,0)
  const then = d.getTime() 
  if (!isNaN(then) && then < now) {
    const msInDay = 86400000
    const index = Math.floor((then - epochMs) / msInDay) % maxSolutions
    const externalIndex = Math.floor((then - epochMs) / msInDay)
    if (index>-1) {
      return {
        filename: Md5.hashStr(`${index}`),
        solutionIndex: index,
        externalIndex: externalIndex,
      }
    } else {
      return getDayIndex(gameName)
    }
  } else {
    return getDayIndex(gameName)
  }
}

export const getInstantFile = (useLocalTime: boolean = false) => {
  //epoch set to start date at 00:00:00 UTC in milliseconds – e.g. this was yesterday: February 3
  const epochMS = INSTANTEPOCH
  //get today’s timestamp
  const now = Date.now()
  //get the index (number of days between)
  var index = Math.floor((now - epochMS) / 86400000)

  if (useLocalTime) {
    const offset = new Date().getTimezoneOffset() * 60000
    const localTime = now - offset
    index = Math.floor((localTime - epochMS) / 86400000)
  } 

  const indexLength = index.toString().length
  let leadingZeroes = '00000'
  return {filename: `${leadingZeroes.substring(0, leadingZeroes.length - indexLength)}${index}`, solutionIndex: index}
}

export const getInstantFileFromDate = (date: string) => {
  //epoch set to start date at 00:00:00 UTC in milliseconds – e.g. this was yesterday: February 3
  const epochMS = INSTANTEPOCH

  //get the index (number of days between)
  let d = new Date(date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'))  // date is a string in the format of 'YYYYMMDD'
  d.setUTCHours(0,0,0,0)
  const then = d.getTime()
  const index = Math.floor((then - epochMS) / 86400000)
  const indexLength = index.toString().length
  let leadingZeroes = '00000'
  return {filename: `${leadingZeroes.substring(0, leadingZeroes.length - indexLength)}${index}`, solutionIndex: index}
}

const findPermutations = (str: string):string[] => {

  if (!str || typeof str !== "string"){
    return []
      //return "Please enter a string"
  }
  
  if (!!str.length && str.length < 2 ){
      return [str]
  }

  if (str.length > 10) {
    return []
  }
  
  let permutationsArray = [] 
      
  for (let i = 0; i < str.length; i++){
      let char = str[i]
  
      if (str.indexOf(char) !== i)
      continue
  
      let remainder = str.slice(0, i) + str.slice(i + 1, str.length)
  
      for (let permutation of findPermutations(remainder)){
      permutationsArray.push(char + permutation) }
  }
  return permutationsArray
}

const findInstantSolution = (puzzle: string, correct_index: number):string => {
  //find all combinations of puzzle
  var possibles = findPermutations(puzzle)

  // remove all the words in possibles where character at correct_index does not match correct_index in puzzle
  // and word does not start or end with = sign
  possibles = possibles.filter(function(word){
      return ( (word[correct_index] === puzzle[correct_index]) &&
              ( word.charAt(0) !== '=' && word.charAt(word.length-1) !== '=') )
  })

  // remove all the words in possibles which do not end in numbers after the =
  possibles = possibles.filter(function(word){
      var splitWord = word.split('=')
      var lastPart = splitWord[1]
      if(!isNaN(lastPart as any)){
          return true
      } else {
          return false
      }
  })

  // remove all words in possibles containing two of the symbols (+,-,*,/) next to each other
  possibles = possibles.filter(function(word){
      const symbols = ['+','-','*','/']
      var splitWord = word.split('')
      var found = false
      for(var i = 0; i < splitWord.length; i++){
          if (symbols.includes(splitWord[i]) && symbols.includes(splitWord[i+1])){
              found = true
          }
      }
      return !found
  }) 

  // remove all the words in possible where the first part does not start or end with a number
  possibles = possibles.filter(function(word){
      var splitWord = word.split('=')
      var firstPart = splitWord[0]


      // if first or last char of firstPart is not a number remove word from possibles
      if(isNaN(firstPart.charAt(0) as any) || isNaN(firstPart.charAt(firstPart.length-1) as any)){
          return false
      }   else {     
          return true
      }
      
  })

  // now evaluate each one to find which one is the match
  var solutionWord = ''
  var BigEval = require('bigeval');
  var Obj = new BigEval();

  possibles.forEach((word) => {
      var splitWord = word.split('=')
      var firstPart = splitWord[0]
      var lastPart = splitWord[1]
      if (Obj.exec(firstPart).toString() === lastPart){
          solutionWord = word
          return word
      }
  })

  return solutionWord

}

export const instantToSolution = (rawChallenge: string) => {
  const [expression, correctIndex] = rawChallenge.split('_')
  const firstGuess = expression
                    .replace('a', '+')
                    .replace('m', '-')
                    .replace('d', '/')
                    .replace('t', '*')
                    .replace('e', '=')
  const solution = findInstantSolution(firstGuess, parseInt(correctIndex)-1)

  return {solution: solution, guess: firstGuess, correctIndex: parseInt(correctIndex)-1}
          
}