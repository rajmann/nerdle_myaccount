import mixpanel from 'mixpanel-browser';

export const init = () => {
    mixpanel.init('7d7edc7d12220fa479a6af9903923057', {debug: true, track_pageview: true, persistence: 'localStorage'})
    if (localStorage.getItem('email')) {
        mixpanel.identify(localStorage.getItem('email') || '')
        mixpanel.people.set({ email: localStorage.getItem('email') })
    }
    if (localStorage.getItem('userEmail')) {
        mixpanel.identify(localStorage.getItem('userEmail') || '')
        mixpanel.people.set({ email: localStorage.getItem('userEmail') })
    }
}

export const mpTrack = (event: string, data: any) => {
    mixpanel.track(event, data = {})
}

export const mpInitIfEnabled = () => {
    if (localStorage.getItem('mplog')) {
        const logTime = new Date(localStorage.getItem('mplog') || '').getTime()
        const currentTime = new Date().getTime()
        if (currentTime - logTime < 86400000) {
            init()
        } else {
            console.log('log time expired')
        }
    }
}

export const mpTrackIfEnabled = (event: string, data: any) => {
    if (localStorage.getItem('mplog')) {
        const logTime = new Date(localStorage.getItem('mplog') || '').getTime()
        const currentTime = new Date().getTime()
        if (currentTime - logTime < 86400000) {
            mixpanel.track(event, data)
        }
    }
}