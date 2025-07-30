import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  guesses: string[]
  currentGuess: string
  columns: number
  solution: string
  rows: number
  animate?: boolean
  showPenaltyBadges?: boolean
  onCellClick?: (col: number) => void
  col: number,
  flexInput: boolean,
  rawReveal: boolean,
  gameWon?: boolean,
}

export const Grid = ({ guesses, currentGuess, columns, solution, rows, animate, showPenaltyBadges, onCellClick, col, flexInput, rawReveal, gameWon = false }: Props) => {

  const empties =
    guesses.length < rows - 1 ? Array.from(Array(rows - 1 - guesses.length)) : []

  var row = 0

  return (
    <div className="pb-grid main-grid z-[9]">

      {guesses.map((guess, i) => {
        row = row + 1
        return (
          <CompletedRow key={i} guess={guess} columns={columns} solution={solution} animate={animate && i === guesses.length - 1} rawReveal={rawReveal && row == 1} id={'row' + row} />
        )
      })}
      {guesses.length < rows && !gameWon && <CurrentRow selectedCol={col} guess={currentGuess} columns={columns}
        onCellClick={onCellClick} flexInput={flexInput} showPenaltyBadges={showPenaltyBadges && row > 2} penaltyText={'+' + 10 * (row - 2) + 's added'} id={'row' + (row + 1)} />}
      
      {guesses.length < rows && gameWon && <EmptyRow columns={columns} showPenaltyBadges={showPenaltyBadges && row > 2} penaltyText={'+' + 10 * (row - 2) + 's penalty'} id={'row' + (row + 1)} />}

      {empties.map((_, i) => {
        row = row + 1
        const penaltyText = '+' + 10 * (row - 2) + 's penalty'
        return (
          <EmptyRow key={i} columns={columns} showPenaltyBadges={showPenaltyBadges && row > 2} penaltyText={penaltyText} id={'row' + (row + 1)} />
        )
      })}

    </div>
  )
}
