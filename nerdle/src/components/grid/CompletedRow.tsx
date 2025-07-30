import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'

type Props = {
  guess: string
  columns: number
  solution: string
  animate?: boolean
  rawReveal?: boolean
  id: string
}

export const CompletedRow = ({ guess,columns,solution, animate, rawReveal, id }: Props) => {
  
  if (!rawReveal) {

    const statuses = getGuessStatuses(guess,solution)

    return (
      <div className="flex justify-center mb-1" id={id}>
        {guess.slice(0,columns).split('').map((letter, i) => (
          <Cell key={i} value={letter} status={statuses[i]} animate={animate} />
        ))}
      </div>
    )

  } else {

    const revealArray = guess.split(',').map((item) => {
      return item.length>1 ? item.charAt(0) : item
    })
    const revealString = revealArray.join('')
    const statuses = getGuessStatuses(revealString,solution)
    
    return (
      <div className="flex justify-center mb-1" id={id}>
        {guess.split(',').map((letter, i) => (
          <Cell key={i} value={letter} status={statuses[i]} animate={animate} />
        ))}
      </div>
    )
  }
}
