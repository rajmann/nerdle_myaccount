import { MiniCompletedRow } from './MiniCompletedRow'

type Props = {
  guesses: string[]
  solution: string
  className?: string
  cellClasses?: string
}

export const MiniGrid = ({ guesses, solution, className, cellClasses }: Props) => {
  return (
    <div className={className ? className : "pb-6"}>
      {guesses.map((guess, i) => (
        <MiniCompletedRow key={i} guess={guess} solution={solution} cellClasses={cellClasses} />
      ))}
    </div>
  )
}
