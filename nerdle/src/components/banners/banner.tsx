import { useEffect, useState } from 'react'
import { logEvent } from 'firebase/analytics'
import { XCircleIcon } from '@heroicons/react/outline'

type Props = {
    gameMode: string;
    analytics?: any;
    onShow?: () => void;
}

export const Banner = ({ gameMode, analytics, onShow }: Props) => {

    const [showBanner, setShowBanner] = useState(false)
    const [bannerJsx, setBannerJsx] = useState<any>()
    const [bannerBackgroundColor, setBannerBackgroundColor] = useState('')

    useEffect(() => {

        const date = new Date()
        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)

        // create a timestamp
        const timestamp = new Date().toISOString()

        const host = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://nerdlegame.com'

        fetch(host + '/banners/banners.json?t=' + timestamp)
            .then((response) => response.json())
            .then((data) => {
                const banners = data.banners

                banners.forEach((banner: { active: boolean; start: string | number | Date; end: string | number | Date; fileName: string; GAEvent: string; backgroundColor: string, games?: string[] }) => {

                    const dateStart = new Date(banner.start)
                    const dateEnd = new Date(banner.end)
                    const dateStartUTC = new Date(dateStart.getTime() + dateStart.getTimezoneOffset() * 60000)
                    const dateEndUTC = new Date(dateEnd.getTime() + dateEnd.getTimezoneOffset() * 60000)
                    const myGameMode = gameMode === '' ? 'classic' : gameMode

                    if (banner.games && !(banner.games.includes(myGameMode) || banner.games.includes('all'))) return

                    if (banner.active && utcDate >= dateStartUTC && utcDate <= dateEndUTC) {
                        fetch(`${host}/banners/${banner.fileName}?t=${timestamp}`)
                            .then((response) => response.text())
                            .then((text) => {
                                if (banner.backgroundColor) {
                                    setBannerBackgroundColor(banner.backgroundColor)
                                }
                                setBannerJsx(<span dangerouslySetInnerHTML={{ __html: text }} onClick={() => {
                                    if (analytics) {
                                        logEvent(analytics, banner.GAEvent)
                                    }
                                }
                                }
                                />)
                                setShowBanner(true)
                                if (onShow) {
                                    onShow()
                                }
                            })
                    }
                })

            })


    }, [gameMode])

    if (!showBanner) {
        return <div />
    }

    return (
        <div className="mb-2">
            <div className="relative text-black text-center p-2 px-6 rounded" style={{ backgroundColor: bannerBackgroundColor }}>
                <div className="absolute right-1 top-1">
                    <XCircleIcon
                        aria-label="Close"
                        aria-hidden={false}
                        className="h-6 w-6 cursor-pointer"
                        onClick={() => setShowBanner(false)}
                    />
                </div>
                <div>
                    {bannerJsx}
                </div>
            </div>
        </div>
    )

}