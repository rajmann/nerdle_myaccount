export const doGoogleLogin = (credentialResponse: any, handleLogin: () => void) => {

    function parseJwt (token: any) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
       var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
       }).join(''));
     
       return JSON.parse(jsonPayload);
     };

     const token = parseJwt(credentialResponse.credential)
     console.log('token', token)

     const email = token.email || ''
     const name = token.name || ''
     const googleId = token.sub || ''

     const payload = {
        provider: 'google',
        googleId: googleId,
        fullname: name,
        email: email,
        source: 'nerdle'
    }

    if (googleId != '' && email != '') {
        console.log('ok to create account/login')

        const authUrl = 'https://api.leaderboardle.com/login'

        console.log('payload', payload)

        fetch(authUrl, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            })
            .then((res) => res.json())
            .then((json) => {
                console.log(json)

                if (json.token) {
                    console.log('login success ' + json.token)
                    console.log('message ' + json.message)
                    localStorage.setItem('lbl_token', json.token)
                    localStorage.setItem('userEmail', payload.email)

                    if (
                        json.message == 'User used a provider to sign in' ||
                        json.message == 'User used a provider to sign in with email'
                    ) {
                        console.log('created new account')
                        localStorage.setItem('newAccount', 'true')
                    }

                    // post message to app
                    if (
                        (window as any).webkit &&
                        (window as any).webkit.messageHandlers &&
                        (window as any).webkit.messageHandlers.lblLogin
                    ) {
                        ; (window as any).webkit.messageHandlers.lblLogin.postMessage({
                        message: json.token,
                        })
                    }
    
                    handleLogin()                

                } else {
                
                    if (json.message) {
                        alert(json.message)
                    }
            
                }
            })
        }

  }