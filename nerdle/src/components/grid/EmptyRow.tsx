import { Cell } from './Cell'

type Props = {
  columns: number
  showPenaltyBadges?: boolean
  penaltyText?: string
  id: string;
}

export const EmptyRow = ({ columns, showPenaltyBadges, penaltyText, id }: Props) => {
  const emptyCells = Array.from(Array(columns))

  return (
    <div className="relative flex justify-center mb-1" id={id}>
      {emptyCells.map((_, i) => (
        <Cell key={i}/>
      ))}
      {showPenaltyBadges && <div className="absolute top-1 pr-0 text-right text-[#820458]"  style={{width: (columns*58)+4, maxWidth:"97%"}}>
       <span className="bg-white rounded" style={{padding:2}}>{penaltyText}</span>
      </div>}
    </div>
  )
}
