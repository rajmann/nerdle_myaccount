import { Cell } from './Cell'
import { useState, useEffect } from 'react'

type Props = {
  guess: string
  columns: number
  showPenaltyBadges?: boolean
  penaltyText? : string
  onCellClick?: (col:number) => void
  selectedCol: number
  flexInput: boolean
  id: string
}

export const CurrentRow = ({ guess, columns, showPenaltyBadges, penaltyText, onCellClick, selectedCol, flexInput, id }: Props) => {

  const [selCol, setSelCol] = useState(-1)

  const splitGuess = guess.split('')
  const emptyCells = Array.from(Array(columns - splitGuess.length))
  var col = 0

  const onCellClickHandler = (col: number) => {
    if (onCellClick) {
      onCellClick(col)
      setSelCol(col)
    }
  }

  useEffect(() => {
    setSelCol(selectedCol)
  },[selectedCol])

  return (
    <div className="relative flex justify-center mb-1" id={id}>
      {splitGuess.map((letter, i) => {
        col = col + 1;
        return (
        <Cell key={i} value={letter} col={col} onClick={(col) => onCellClickHandler(col)} selected={col-1===selCol} flexInput={flexInput} border={2}/>
      )})}
      {emptyCells.map((_, i) => {
        col = col + 1; 
        return (
        <Cell key={i} value={' '} col={col} onClick={(col) => onCellClickHandler(col)} selected={col-1===selCol} flexInput={flexInput} border={2}/>
      )})}
      {showPenaltyBadges && splitGuess.length < columns-1 && <div className="absolute top-1 pr-0 text-right text-[#820458]"  style={{width: (columns*58)+4, maxWidth:'97%'}}>
        <span className="bg-white rounded" style={{padding:2}}>{penaltyText}</span>
      </div>}
    </div>
  )
}
