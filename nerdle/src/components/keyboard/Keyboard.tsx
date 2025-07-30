import { KeyValue } from '../../lib/keyboard'
import { getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { useEffect } from 'react'
import { Plus, Minus, Times, Divide, Equals } from './symbols'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  guesses: string[],
  solution: string,
  additionalKeys: string[]
  ommittedKeys: string[]
  noEquals?: boolean
  gameMode: string
}

export const Keyboard = ({ onChar, onDelete, onEnter, guesses, solution, additionalKeys, ommittedKeys, noEquals, gameMode }: Props) => {
  const charStatuses = getStatuses(guesses, solution)

  const onClick = (value: KeyValue) => {
    if (value === 'ENTER') {
      onEnter();
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value);
      (document.activeElement as HTMLElement).blur();
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else {
        const key = e.key.toUpperCase()
        if (key.length === 1 && ((key >= '0' && key <= '9')
          || key === '+' || key === '-' || key === '*' || key === '/' || key === '='
          || additionalKeys.includes(key))) {
          if (!ommittedKeys.includes(key)) {
            onChar(key)
          }
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar, ommittedKeys, additionalKeys])

  return (
    <div className="z-[9] bg-[#DEE3ED] pt-2 pb-2 px-[5px] dark:bg-gray-800">
      <div
        className="grid grid-cols-10 gap-[5px] select-none"
        style={{ gridTemplateColumns: 'repeat(10, 1fr)', gridAutoFlow: 'row' }}
      >
        {/* Number keys */}
        <Key value="1" onClick={onClick} status={charStatuses['1']} className="col-span-1" />
        <Key value="2" onClick={onClick} status={charStatuses['2']} className="col-span-1" />
        <Key value="3" onClick={onClick} status={charStatuses['3']} className="col-span-1" />
        <Key value="4" onClick={onClick} status={charStatuses['4']} className="col-span-1" />
        <Key value="5" onClick={onClick} status={charStatuses['5']} className="col-span-1" />
        <Key value="6" onClick={onClick} status={charStatuses['6']} className="col-span-1" />
        <Key value="7" onClick={onClick} status={charStatuses['7']} className="col-span-1" />
        <Key value="8" onClick={onClick} status={charStatuses['8']} className="col-span-1" />
        <Key value="9" onClick={onClick} status={charStatuses['9']} className="col-span-1" />
        <Key value="0" onClick={onClick} status={charStatuses['0']} className="col-span-1" />
      </div>
      <div
        className={(gameMode == "maxi" || gameMode == "pro") 
          ? "flex justify-center mt-2 gap-[5px] select-none"
          : "grid grid-cols-10 gap-[5px] select-none mt-2"}
        style={{ gridTemplateColumns: 'repeat(10, 1fr)', gridAutoFlow: 'row' }} 
        > 
    
        {/* Operator keys */}
        {!ommittedKeys.includes('+') && (
          <Key value="+" onClick={onClick} status={charStatuses['+']} className="col-span-1">
            <Plus />
          </Key>
        )}
        {!ommittedKeys.includes('-') && (
          <Key value="-" onClick={onClick} status={charStatuses['-']} className="col-span-1">
            <Minus />
          </Key>
        )}
        {!ommittedKeys.includes('*') && (
          <Key value="*" onClick={onClick} status={charStatuses['*']} className="col-span-1">
            <Times />
          </Key>
        )}
        {!ommittedKeys.includes('/') && (
          <Key value="/" onClick={onClick} status={charStatuses['/']} className="col-span-1">
            <Divide />
          </Key>
        )}

        {/* Additional keys */}
        {additionalKeys.map((key, index) => {
          if (!ommittedKeys.includes(key)) {
            if (key === '²' || key === '³') {
              return (
                <Key key={index} value={key as KeyValue} onClick={onClick} status={charStatuses[key]} className="col-span-1">
                  X<sup>{key === '²' ? '2' : '3'}</sup>
                </Key>
              )
            } else {
              return (
                <Key key={index} value={key as KeyValue} onClick={onClick} status={charStatuses[key]} className="col-span-1" />
              )
            }
          }
        })}

        {/* Equals key */}
        {!noEquals && (
          <Key value="=" onClick={onClick} status={charStatuses['=']} className="col-span-1">
            <Equals />
          </Key>
        )}

        {/* Enter and Delete keys */}
        <Key value="ENTER" onClick={onClick} className="col-span-3">
          <span className="text-base">Enter</span>
        </Key>
        <Key value="DELETE" onClick={onClick} className="col-span-2">
          <span className="text-base">
            <img src="/new-images/delete-key.png" alt="Delete" className="w-5 h-5" />
          </span>
        </Key>
      </div>
    </div>
  )
}
