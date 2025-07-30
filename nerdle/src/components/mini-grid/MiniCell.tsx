import { CharStatus } from '../../lib/statuses'
import classnames from 'classnames'

type Props = {
  status: CharStatus
  cellClasses? : string
}

export const MiniCell = ({ status, cellClasses="" }: Props) => {
  const colorBlindMode = localStorage.getItem('colorBlindMode') === 'true'

  const classes = classnames(
    'w-8 h-8 border-solid border-2 border-slate-200 flex items-center justify-center mx-0.5 text-lg font-bold rounded',
    {
      'bg-[#161803]': status === 'absent' && !colorBlindMode,
      'bg-[#FFFFFF]': status === 'absent' && colorBlindMode,
      'bg-[#398874]': status === 'correct' && !colorBlindMode,
      'bg-[#66FF66]': status === 'correct' && colorBlindMode,
      'bg-[#820458]': status === 'present' && !colorBlindMode,
      'bg-[#DD77FF]': status === 'present' && colorBlindMode,
    },
    cellClasses
  )

  return (
    <>
      <div className={classes}></div>
    </>
  )
}
