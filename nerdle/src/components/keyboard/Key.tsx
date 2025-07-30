import { ReactNode } from 'react'
import classnames from 'classnames'
import { KeyValue } from '../../lib/keyboard'
import { CharStatus } from '../../lib/statuses'

type Props = {
  children?: ReactNode
  value: KeyValue
  width?: number
  gap?: number
  status?: CharStatus
  onClick: (value: KeyValue) => void
  className: string
}

export const Key = ({
  children,
  status,
  width = 42,
  gap = 0,
  value,
  onClick,
  className
}: Props) => {

  const colorBlindMode = localStorage.getItem('colorBlindMode') === 'true'

  const classes = classnames(
    'flex-grow flex items-center justify-center rounded text-lg font-bold cursor-pointer h-13 select-none ' + className,
    {
      'bg-white hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-200': !status && !colorBlindMode,
      'bg-slate-200 hover:bg-slate-300 dark:bg-slate-400 dark:hover:bg-slate-200 active:bg-slate-400': !status && colorBlindMode,
      'bg-[#161803] text-white': status === 'absent' && !colorBlindMode,
      'bg-[#FFFFFF] text-black': status === 'absent' && colorBlindMode,
      'bg-[#398874] hover:bg-[#398894] active:bg-[#398898] text-white':  status === 'correct' && !colorBlindMode,
      'bg-[#66FF66] hover:bg-[#66FF66] active:bg-[#33AA33] text-slate':  status === 'correct' && colorBlindMode,
      'bg-[#820458] hover:bg-[#820480] active:bg-[#820492] text-white':  status === 'present' && !colorBlindMode,
      'bg-[#DD77FF] hover:bg-[#DD77FF] active:bg-[#aa3377] text-white':  status === 'present' && colorBlindMode
    }
  )

  return (
    <button
      aria-label={(value==='-'?'minus':value) + ' ' + (status===undefined?'':status)}
      style={{boxShadow: '0px 1px 2px 0px #00000026', marginRight: `${gap}px`, marginLeft: `${gap}px` }}
      className={classes}
      onClick={() => onClick(value)}
    >
      {children || value}
    </button>
  )
}
