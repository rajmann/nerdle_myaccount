import { getGuessStatuses } from '../../lib/statuses'
import { MiniCell } from './MiniCell'

type Props = {
  guess: string
  solution: string
  cellClasses?: string
}

export const MiniCompletedRow = ({ guess, solution, cellClasses }: Props) => {

  if (guess.length == solution.length && !guess.includes(',')) {

    const statuses = getGuessStatuses(guess, solution)
    return (
      <div className="flex justify-center mb-1">
        {guess.split('').map((letter, i) => (
          <MiniCell key={i} status={statuses[i]} cellClasses={cellClasses}/>
        ))}
      </div>
    )
  } else {
    const revealArray = guess.split(',').map((item) => {
      return item.length > 1 ? item.charAt(0) : item
    })
    const revealString = revealArray.join('')
    const statuses = getGuessStatuses(revealString, solution)

    return (
      <div className="flex justify-center mb-1">
        {guess.split(',').map((letter, i) => (
          <MiniCell key={i} status={statuses[i]} cellClasses={cellClasses}/>
        ))}
      </div>
    )
  }
}
