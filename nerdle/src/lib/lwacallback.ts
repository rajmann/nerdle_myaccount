export const lwaCallback = () => {

    if (window.location.pathname === '/lwa-callback') {

            // query string should look like this:
            // access_token=Atza%7CIwEBIK7JHFOIJcEeORy-Z2EgnIKOW5AwDhawpzeynrx8O2zs_ELsYTpUYBE9YU-S6QLdS5u8gpei5E743MdoNa21aiBI2SOhXmpIet7miDl8k-zncyr4bpCdVVqWlxbiKuv6vP77dSrBYf-95lc4G8AP0i-xeuXrU8fs35Oi6djWvmy1LeN7zBc4ortJquBWM6wboaXLA-JCseiVPDPHCRdLJU8aC4LZI4gTEB0D0RCyLGNHMRS_kSLjav9R0opEJC7_ucy_ebp5hHF5tVtspB40t-jKcGuaaZtMddfvr9j6s3dDHrczNpWkBTRA9WGOF5-jIImihWmc0FcfH5OZ_Lvi00u5zLz2hDc82qTzHEIopFdIot67ePOt6BIraSeMhCvSd3LshHhviAlbb4KzPBPHld9_
            // &token_type=bearer
            // &expires_in=3089&
            // scope=profile

        //get the access token from the url
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');

        // if we have an accessToken post it to our back end to get the user's profile
        if (accessToken) {
            fetch('http://127.0.0.1:9000/lwalogin', {
                method: 'POST',
                body: JSON.stringify({access_token: accessToken}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                // get the json
                res.json().then(json => {
                    console.log(json)
                })
            })
        }

    }

}