import { analytics } from '../index'
import { logEvent} from 'firebase/analytics'

export const checkTeacherCode = () => {

    // if path is /school/{code} then we need to validate the code
    if (window.location.pathname.includes('/school/')) {
        const code = window.location.pathname.split('/')[2]
        console.log('the code: ', code)
        let api_url = 'https://api.leaderboardle.com/teachercode/validate/' + code
        if (window.location.hostname.includes('localhost')) {
            api_url = 'http://localhost:3001/prod/teachercode/validate/' + code
        }
        fetch(api_url, {
        method: 'GET'
        })
        .then((response) => response.json())
        .then((json) => {
            console.log('validate json: ', json)
            console.log(json)
            if (json.valid === true) {
                // we can disable ads 
                localStorage.setItem(
                    'disableAdsTimestamp',
                    Date.now().toString()
                )

                // get the subdomain from the url
                const gameMode = window.location.hostname.split('.')[0] || ''
                logEvent(analytics, 'teacher_code_valid' + (gameMode !== '' ? '_' + gameMode : 'classic'))
            }

            // redirect to '/'
            window.location.href = '/'

        })
    }

}