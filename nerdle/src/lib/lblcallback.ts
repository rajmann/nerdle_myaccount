import { saveStatsToCloud, store7DaysToCloud } from './cloudStats'
import { Md5 } from 'ts-md5';
import { getSHA256Hash, createHash } from './sha256hash.js'

declare var window: any;

export const lblCallback = () => {

  // if we have an email in local storage, md5 hash it
  const email = localStorage.getItem('userEmail')
  if (email) {    
    (async () => {
      // window.eh2 = await createHash(email)
      const hash = await getSHA256Hash(email)
      window.eh2 = hash
      const hash2 = await createHash(email)
      window.ehttd = hash2
    })();
  }

  if (window.location.pathname === '/callback') {
    //get authCode get parameter from url
    const urlParams = new URLSearchParams(window.location.search)
    const authCode = urlParams.get('authCode')
    //const exchangeTokenUrl = 'https://d04gbd7pwd.execute-api.ap-southeast-1.amazonaws.com/dev/oauth/getToken'
    const exchangeTokenUrl = 'https://api.leaderboardle.com/oauth/getToken'
    //const exchangeTokenUrl = 'http://localhost:3000/prod/oauth/getToken'

    const host = window.location.host
    const protocol = window.location.protocol
    const payload = {
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: `${protocol}//${host}/callback`,
      //"redirect_uri":"https://nerdlegame.com/callback",
      client_id: '6583775bfec0fd774fb8fc93992281f0',
      client_secret: 'cRfUjXn2r5u8x/A?D(G+KbPdSgVkYp3s',
    }

    //api is text/plain
    fetch(exchangeTokenUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.status === 200) {
        // error - find out what it was and report back to user
        res.json().then((json) => {
          if (json.token) {
       
            localStorage.setItem('lbl_token', json.token)
            localStorage.setItem('userEmail', json.email || '')

            // since gameStats get updated earlier, we should now update cloud stats from local storage ...  
            const localStats = localStorage.getItem('statsState')
            if (localStats) {
              saveStatsToCloud( localStats , localStorage.getItem('gameMode') || '')
            }

            store7DaysToCloud()
            
            postLBlToken(json.token)
            
          }
        })
      } else {
        // some error occurred ..
        alert('an error occurred - please try logging in again')
      }
    })
  }
}

export const doLblOauth = () => {
   // lbl oauth redirect ...
   const lbl_url = 'https://leaderboardle.com/oauth/authorize/'
   const client_id = '6583775bfec0fd774fb8fc93992281f0'
   //get host name with port
   const host = window.location.host
   const protocol = window.location.protocol
   const redirect_uri = encodeURIComponent(
     protocol + '//' + host + '/callback'
   )
   //const redirect_uri = encodeURIComponent("http://localhost:3000/callback")

   const url = lbl_url + client_id + '/' + redirect_uri
   window.location.href = url
}

export const postLBlToken = (token: string) => {

  if (token=='') {
    return;
  }

  // post message to app
  if (
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.lblLogin
  ) {
    ;(window as any).webkit.messageHandlers.lblLogin.postMessage({
      message: token,
    })
  }

  // remove path from url and reload
  const data = {
    lblToken: token,
    target: window.location.protocol + '//' + window.location.host
  }
  // base 64 data
  const b64 = btoa(JSON.stringify(data))
  // console.log(
  //   window.location.hostname.includes('localhost')
  //     ? 'http://localhost:3000/storeLbl.html?v=2&set=' + b64
  //     : 'https://nerdlegame.com/storeLbl.html?set=' + b64
  // )
  const subdomain = window.location.hostname.split('.')[0]
  if (subdomain != 'localhost' && subdomain != 'dev' && subdomain != 'nerdlegame') {
    window.location.href = window.location.hostname.includes('localhost')
      ? 'http://localhost:3000/storeLbl.html?v=2&set=' + b64
      : (window.location.hostname.includes('dev.') ? 'https://dev.' : 'https://') + 'nerdlegame.com/storeLbl.html?set=' + b64
  } else {
      window.history.replaceState({}, document.title, "/")
      window.location.reload()
  }

}


