import { CharStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { Plus, Minus, Times, Divide, Equals, Squared, Cubed } from '../keyboard/symbols'
import { useEffect, useState } from 'react'

type Props = {
  value?: string
  status?: CharStatus
  animate?: boolean,
  animateBounce?: boolean,
  size?: string,
  col?: number
  onClick?: (col: number) => void
  selected?: boolean
  flexInput?: boolean
  border?: number
}

export const Cell = ({ value, status, animate, animateBounce, size, col, onClick, selected, flexInput, border=0 }: Props) => {

  const [isSelected, setSelected] = useState(false)
  const dimension = size || 'default'
  const colorBlindMode = localStorage.getItem('colorBlindMode') === 'true'
  border = colorBlindMode ? 2 : border
 
  const classes = classnames(
    'keyboard-cell border-solid border-' + border + ' flex items-center justify-center mx-0.5 text-lg font-bold rounded',
    {
      'w-14 h-13': dimension === 'default',
      'w-10 h10': dimension === 'small',
      'w-8 h-6': dimension === 'mini',
      'mini-cell': dimension === 'mini',
      // 'bg-[#989484] text-white border-[#989484]': !status && !colorBlindMode,
      'bg-[#F1F3F9] dark:bg-[#989484] text-black dark:text-white border-[#8F96A3]': !status && !colorBlindMode,
      'bg-white text-black border-grey': !status && colorBlindMode,
      'bg-[#161803] text-white border-[#161803]': status === 'absent' && !colorBlindMode, 
      'bg-[#FFFFFF] text-black border-[#DDDDDD]': status === 'absent' && colorBlindMode,
      'bg-[#398874] text-white border-[#398874]': status === 'correct' && !colorBlindMode,
      'bg-[#66FF66] text-slate border-[#33AA33]': status === 'correct' && colorBlindMode,
      'bg-[#820458] text-white border-[#820458]': status === 'present' && !colorBlindMode,
      'bg-[#DD77FF] text-white border-[#aa3377]': status === 'present' && colorBlindMode,   
      'animate-spin': animate || false,
      'animate-bounce': animateBounce || false
    }
  )

  const onClickHandler = () => {
    if (onClick && col) {
      onClick(col-1)
      setSelected(!isSelected)
    }
  }

  useEffect(() => {
    setSelected(selected || false)
  },[selected])

  return (
    <>
      <div 
          className={classes}
          onClick={onClickHandler}
          style={{borderColor: isSelected && (flexInput||false) ? 'black' : undefined}}
          aria-label={value + ' ' + status}
          role="navigation"
          >
        {value==='+' ? <Plus /> : value==='-' ? <Minus /> : value==='*' ? <Times /> : value==='/' ? <Divide /> : value==='=' ? <Equals /> : value==='²' ? <Squared /> : value==='³' ? <Cubed /> : value}
      </div>
    </>
  )
}
