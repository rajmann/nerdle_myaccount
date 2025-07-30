import React, {useEffect, useState} from 'react'
import classnames from 'classnames'
import './HintBox.css'
import {
    XCircleIcon
  } from '@heroicons/react/outline'

type Props = {
    yPosition: number
    children: React.ReactNode
    visible: boolean
    update: boolean
    disableCallBack: () => void
}

export const HintBox = ({yPosition, children, visible, update, disableCallBack}:Props ) => {

    const [isVisible, setIsVisible] = useState(visible && localStorage.getItem('hints') !== 'false')

    useEffect(() => {
        setIsVisible(visible && localStorage.getItem('hints') !== 'false')
    }, [update])

    if (!isVisible) {
        return <div />
    }

    return (

        <>

            <div style={{position:'absolute', top: yPosition, width:'100%'}} className="pr-6 sm:pr-12 lg:pr-16 hintBoxOld">

                <div className="triangle">
                    <div className="triangle-up-background" />
                    <div className="triangle-up-foreground" />                    
                    <div className="hint-box">
                        {children}
                        <div className="disable-hints"
                        onClick={() => {
                            console.log('disable hints')
                            localStorage.setItem('hints', 'false')
                            setIsVisible(false)
                            disableCallBack()
                        }}>
                            <p className="flex text-xs items-center justify-center underline" style={{cursor:'pointer'}}><XCircleIcon className="h-5 w-5 cursor-pointer" 
                            style={{display:'inline-block', verticalAlign:'middle'}} /> Disable hints</p>
                        </div>
                    </div>
                </div>

            </div>


            <div style={{position:'absolute', top: yPosition, width:'100%'}} className="pr-6 sm:pr-12 lg:pr-16 hintBoxNew">

                <div className="triangle-new">
                    <div className="triangle-up-background-new" />
                    <div className="triangle-up-foreground-new" />                    
                    <div className="hint-box-new">
                        {children}
                        {/* <div className="disable-hints"
                        onClick={() => {
                            console.log('disable hints')
                            localStorage.setItem('hints', 'false')
                            setIsVisible(false)
                            disableCallBack()
                        }}>
                            <p className="flex text-xs items-center justify-center underline" style={{cursor:'pointer'}}><XCircleIcon className="h-5 w-5 cursor-pointer" 
                            style={{display:'inline-block', verticalAlign:'middle'}} /> Disable hints</p>
                        </div> */}
                    </div>
                </div>

            </div>

        </>  


    )

}