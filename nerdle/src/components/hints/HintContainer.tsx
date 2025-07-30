import { useEffect, useState, useRef } from 'react'
import { HintBox } from './HintBox'
import { Cell } from '../grid/Cell'
import {
    QuestionMarkCircleIcon,
    MenuIcon,
} from '@heroicons/react/outline'
import { render } from '@testing-library/react'

type Props = {
    currentRow: number
    gamesPlayed: number
    columns: number
    callback: (action: string) => void
    update: boolean
}

export const HintContainer = ({ currentRow, gamesPlayed, columns, callback, update }: Props) => {

    const [rowBottoms, setRowBottoms] = useState([0, 0, 0])
    const [exampleIndex, setExampleIndex] = useState(0)
    const indexRef = useRef(exampleIndex)
    const currentRowRef = useRef(currentRow)
    const columnsRef = useRef(columns)
    const [doBounce, setDoBounce] = useState(false)
    const [positionsCalculated, setPositionsCalculated] = useState(false)
    const [visible, setVisible] = useState(true)
    const validGameLengths = [5, 6, 7, 8, 10]

    const gameExamples = [
        { columns: 5, solutions: ['3+4=7', '2*3=6', '9-5=4'] },
        { columns: 6, solutions: ['9+5=14', '13-7=6', '6*2=12'] },
        { columns: 7, solutions: ['29-27=2', '1+8/1=9', '4*1/2=2'] },
        { columns: 8, solutions: ['19+28=47', '12-3*2=6', '5*6-3=27'] },
        { columns: 10, solutions: ['19+28-4=43', '12-3*2+1=7', '5*6-3+2=29', '2*(7+8)=30', '2²/4+85=86'] }
    ]

    const offset = -4

    useEffect(() => {

        const oldRowBottoms = rowBottoms

        const row1 = document.getElementById('row1')
        const position1Info = row1?.getBoundingClientRect()
        const row2 = document.getElementById('row2')
        const position2Info = row2?.getBoundingClientRect()
        const row3 = document.getElementById('row3')
        const position3Info = row3?.getBoundingClientRect()

        // avoid a re-render if the rowBottoms are the same as before
        if (position1Info?.bottom == oldRowBottoms[0] && position2Info?.bottom == oldRowBottoms[1] && position3Info?.bottom == oldRowBottoms[2]) {
            return
        }

        setRowBottoms([position1Info?.bottom || 0, position2Info?.bottom || 0, position3Info?.bottom || 0])

        // every 5 seconds increment the example index (if on row 1)
        setPositionsCalculated(true)

    });

    useEffect(() => {

        const shakeTiles = () => {
            const keyboardCells = document.getElementsByClassName('mini-cell')
            for (let i = 0; i < keyboardCells.length; i++) {
                if (i % 2 === 0) {
                    keyboardCells[i].classList.add('shake2')
                } else {
                    if (i % 3 === 0) {
                        keyboardCells[i].classList.add('shake3')
                    } else {
                        keyboardCells[i].classList.add('shake1')
                    }
                }
            }
        }

        const removeShake = () => {
            const keyboardCells = document.getElementsByClassName('mini-cell')
            for (let i = 0; i < keyboardCells.length; i++) {
                keyboardCells[i].classList.remove('shake1')
                keyboardCells[i].classList.remove('shake2')
                keyboardCells[i].classList.remove('shake3')
            }
        }

        if (positionsCalculated) {

            const myInterval = setInterval(() => {
                if (currentRowRef.current == 1) {
                    shakeTiles()
                    const solutionsLength = gameExamples.find((game) => game.columns === columnsRef.current)?.solutions.length || 3
                    indexRef.current = (indexRef.current + 1) % solutionsLength
                    setExampleIndex(indexRef.current)
                    setTimeout(() => {
                        removeShake()
                    }, 1000)
                } else {
                    clearInterval(myInterval)
                }
            }, 5000)

        }
    }, [positionsCalculated])

    useEffect(() => {
        currentRowRef.current = currentRow
    }, [currentRow])

    useEffect(() => {
        indexRef.current = exampleIndex
    }, [exampleIndex])

    useEffect(() => {
        columnsRef.current = columns
    }, [columns])

    const renderGameExample = (columns: number, ndx = 0) => {
        // find the example in the gameExamples array
        const examples = gameExamples.find((game) => game.columns === columns)
        const numSolutions = examples?.solutions.length || 0
        if (ndx >= numSolutions) {
            ndx = 0
        }
        const example = examples?.solutions[ndx]
        if (example) {
            return (
                <div className="flex justify-center mb-1 mt-1">
                    {example.split('').map((char, i) => {
                        return <Cell key={i} value={char} size={'mini'} animateBounce={doBounce} />
                    })}
                </div>
            )
        } else {
            return <div />
        }
    }

    const getGameExample = (columns: number, ndx = 0) => {
        const examples = gameExamples.find((game) => game.columns === columns)
        const numSolutions = examples?.solutions.length || 0
        if (ndx >= numSolutions) {
            ndx = 0
        }
        return examples?.solutions[ndx] || ''
    }

    if (gamesPlayed > 4) {
        return <div />
    }

    if (currentRow == 1) {

        return (
            <HintBox yPosition={rowBottoms[0] + offset} visible={validGameLengths.includes(columns) && visible} update={update}
                disableCallBack={() => {
                    callback("disableHints")
                }}
            >
                <div className={'text-center text-xs hintBoxOld'}>
                    <p>The solution is {columns == 8 ? 'an' : 'a'} {columns} digit calculation, e.g.</p>
                    <p>
                        {renderGameExample(columns, exampleIndex)}
                    </p>
                    <p>Enter any {columns}-digit calculation as your first guess to get some clues{" "}
                        <QuestionMarkCircleIcon
                            className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]" style={{ display: 'inline-block', verticalAlign: 'middle' }}
                            onClick={() => {
                                callback('hint1')
                            }}
                        />
                    </p>
                </div>

                <div className={'text-left text-sm hintBoxNew px-2'}>
                    <p className="bg-[#E8E8E8] rounded-[4px] py-1 px-4 mb-3 mt-2">
                        {renderGameExample(columns, exampleIndex)}
                    </p>
                    <p>The solution is {columns == 8 ? 'an' : 'a'} {columns} digit calculation. 
                        Try entering {getGameExample(columns, 0)} as your first guess to get some clues!</p>

                    <div className="flex justify-between items-center mt-2 text-sm cursor-pointer pt-2 pb-2">
                        <div className="flex items-center"
                            onClick={() => {
                                callback('hint1')
                            }}>
                            <QuestionMarkCircleIcon
                                className="h-6 w-6 dark:text-[#D7DADC] text-[#820458]"
                                style={{ display: 'inline-block', verticalAlign: 'middle' }}
                            />
                            <span className="ml-2 cursor-pointer dark:text-[#D7DADC] text-[#820458]" onClick={() => callback('allRules')}>
                                All Rules
                            </span>
                        </div>
                        <span
                            className="cursor-pointer text-black dark:text-[#D7DADC]"
                            onClick={() => {
                                callback('disableHints')
                                console.log('disable hints')
                                setVisible(false)
                            }}
                        >
                            X Disable Hints
                        </span>
                    </div>
                </div>

            </HintBox>
        )
    }

    if (currentRow == 2) {
        return (
            <HintBox yPosition={rowBottoms[1] + offset} visible={validGameLengths.includes(columns) && visible} update={update}
                disableCallBack={() => {
                    callback("disableHints")
                }}>
                <div className={'text-center text-xs hintBoxOld'}>
                    <p>Enter your second guess using these clues:</p>
                    <div className="flex mt-1 mb-1 items-center"><Cell status={"correct"} value="✓" size="mini" /> = in the solution and the correct spot</div>
                    <div className="flex mb-1 items-center"><Cell status={"present"} value="?" size="mini" /> = in the solution but the wrong spot</div>
                    <div className="flex items-center"><Cell status={"absent"} value="X" size="mini" /> = not in the solution{" "}
                        <QuestionMarkCircleIcon
                            className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 'auto' }}
                            onClick={() => {
                                callback('hint1')
                            }}
                        /></div>

                </div>

                <div className={'text-left text-sm hintBoxNew px-2'}>
                    <p className=" pb-2">
                        Use the clues to make your next guess:
                    </p>

                    <p className="bg-[#E8E8E8] rounded-[4px] py-2 px-4 mb-2">
                        <div className="flex mt-1 mb-1 items-center"><Cell status={"correct"} value="✓" size="mini" />&nbsp; In the solution and correct spot</div>
                        <div className="flex mb-1 items-center"><Cell status={"present"} value="?" size="mini" />&nbsp; In the solution, but the wrong spot </div>
                        <div className="flex items-center"><Cell status={"absent"} value="X" size="mini" />&nbsp; Not part of the solution</div>
                    </p>
                    <div className="flex justify-between items-center mt-2 text-sm cursor-pointer pb-2">
                        <div className="flex items-center"
                            onClick={() => {
                                callback('hint1')
                            }}>
                            <QuestionMarkCircleIcon
                                className="h-6 w-6 dark:text-[#D7DADC] text-[#820458]"
                                style={{ display: 'inline-block', verticalAlign: 'middle' }}
                            />
                            <span className="ml-2 cursor-pointer dark:text-[#D7DADC] text-[#820458]" onClick={() => callback('allRules')}>
                                All Rules
                            </span>
                        </div>
                        <span
                            className="cursor-pointer text-black dark:text-[#D7DADC] "
                            onClick={() => {
                                callback('disableHints')
                                setVisible(false)
                            }}
                        >
                            X Disable Hints
                        </span>
                    </div>
                </div>

            </HintBox>
        )
    }

    if (currentRow == 3) {
        return (
            <HintBox yPosition={rowBottoms[2] + offset} visible={validGameLengths.includes(columns) && visible} update={update}
                disableCallBack={() => {
                    callback("disableHints")
                }}>
                <div className={'text-center text-xs hintBoxOld'}>
                    <p>Make your next guesses using all the clues:</p>
                    <div className="flex mt-1 mb-1 items-center"><Cell status={"correct"} value="✓" size="mini" /> = in the solution and the correct spot</div>
                    <div className="flex mb-1 items-center"><Cell status={"present"} value="?" size="mini" /> = in the solution but the wrong spot</div>
                    <div className="flex items-center"><Cell status={"absent"} value="X" size="mini" /> = not in the solution{" "}
                        <QuestionMarkCircleIcon
                            className="h-6 w-6 cursor-pointer dark:text-[#D7DADC]" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 'auto' }}
                            onClick={() => {
                                callback('hint1')
                            }}
                        /></div>

                </div>

                <div className={'text-left text-sm hintBoxNew px-2'}>
                    <div style={{display: "flex", justifyContent: "center"}} className="pt-2">
                     🎉 You're doing great! Need a hand?
                     Check 'How to play' under the menu (☰) to get help at any time.
                     </div>

                   
                    <div className="flex justify-between items-center mt-2 text-sm cursor-pointer pb-2 pt-2">
                        <div className="flex items-center"
                            onClick={() => {
                                callback('hint1')
                            }}>
                            <QuestionMarkCircleIcon
                                className="h-6 w-6 dark:text-[#D7DADC] text-[#820458]"
                                style={{ display: 'inline-block', verticalAlign: 'middle' }}
                            />
                            <span className="ml-2 cursor-pointer dark:text-[#D7DADC] text-[#820458]" onClick={() => callback('allRules')}>
                                All Rules
                            </span>
                        </div>
                        <span
                            className="cursor-pointer text-black dark:text-[#D7DADC] "
                            onClick={() => {
                                callback('disableHints')
                                setVisible(false)
                            }}
                        >
                            X Disable Hints
                        </span>
                    </div>
                </div>

            </HintBox>
        )
    }

    return <div />

}