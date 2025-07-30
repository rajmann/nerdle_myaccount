import { api_url, analytics } from './index'
import { logEvent } from 'firebase/analytics'

//const siteTokens = ['midi','prime','amazon']
const siteTokens = ['login-required-not-using-at-the-moment']
//const amazonSites = ['midi', 'prime', 'amazon']
const amazonSites = ['NOT-USED']

const amazonRedirectUrl = "https://gaming.amazon.com/web-games?ref_=SM_WEB_NER_IGP_T1"
//const amazonRedirectUrl = "/amazon-temp.html"
const amazonErrorUrl = "https://gaming.amazon.com/web-games?ref_=SM_WEB_NER_IGP_T1"
//const amazonErrorUrl = "/amazon-error.html"

export const loginRequired = () => {
        // does any of siteTokens exist in the hostname?
        const siteToken = siteTokens.find(token => window.location.hostname.includes(token))
        return siteToken
}

const logPrimeUserEvent = (userId: string, gameName: string, event: string)  => {

        fetch(`${api_url}/logPrimeUserEvent`, {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId, gameName, event }),
                })
                .then(response => response.json())
                .then(json => {
                        console.log(json)
                }
        )

}

// make it so we can wait for response .. 

// if we are on a prime gaming link we need to get the signature from the query string
export async function verifyAmazon() {

        // if localhost:3000 juis return true
        // if (window.location.hostname.includes('localhost')) {
        //         return true;
        // }
        
        const siteToken = amazonSites.find(token => window.location.hostname.includes(token))
        // if we have a siteToken we need to verify the signature
        if (siteToken) {
                // get 'Signature' parameter from query string
                const urlParams = new URLSearchParams(window.location.search)
                const signature = urlParams.get('Signature')

                logEvent(analytics, 'amazon_prime_verify_' + siteToken)

                if (signature) {

                        const response = await fetch(`${api_url}/validateAmazonToken`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ token: signature, request_time: (new Date()).getTime() / 1000 }),
                        })
                        const json = await response.json()

                        if (json.status === 'ok') {
                                const userId = json.customerId

                                // log event to firebase
                                logEvent(analytics, 'amazon_prime_token_login_' + siteToken)
        
                                // store userId in a 90 day cookie
                                const date = new Date()
                                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000))
                                const expires = `expires=${date.toUTCString()}`
                                document.cookie = `primeUserId=${userId};${expires};path=/`

                                console.log('signature verified')

                                window.location.href = '/'
                                return true;
                        } else {
                                // invalid signature, redirect to amazon page
                                logEvent(analytics, 'amazon_prime_token_error_' + siteToken)
                                window.location.href = amazonErrorUrl
                                return false;
                        }

                } else {

                        // do we already have a valid cookie?
                        const cookies = document.cookie.split(';')
                        const primeUserId = cookies.find(cookie => cookie.includes('primeUserId'))
                        if (primeUserId) {
                                console.log('cookie found')
                                logEvent(analytics, 'amazon_prime_cookie_login_' + siteToken)

                                // get userId from cookie
                                let userId = primeUserId.split('=')[1].split(';')[0]
                                // log event to api
                                logPrimeUserEvent(userId, siteToken, 'game_started')

                                return true;
                        }

                        console.log('no signature found')
                        logEvent(analytics, 'amazon_prime_missing_signature_' + siteToken)
                        // redirect to info page 
                        window.location.href = amazonRedirectUrl
                        return false;
                }

        } else {
                //console.log('not a prime game')
                // not a prime game, just return true to auth and continue ... 
                return true;
        }
                                        
}
