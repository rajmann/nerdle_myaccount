import {isMobile} from 'react-device-detect';

declare var flutterChannel: any;
declare var window: any;

const isInstalled = () => {
    // For iOS
    if ( window.navigator.standalone ) return true
  
    // For Android
    if (window.matchMedia('(display-mode: standalone)').matches) return true
  
    // If neither is true, it's not installed
    return false
}

export const isRunningInPWA = () => {
    return (isMobile && isInstalled()) || window.location.search.includes('?pwa') || window.navigator.userAgent.includes('Nerdle/1.0') || window.isMobileApp
//    return (isMobile && (localStorage.getItem('pwa') === 'true') && isInstalled()) || window.location.search.includes('?testpwa') || window.location.search.includes('?pwa')
}

export const isNewMobileApp = () => {
    return  window.navigator.userAgent.includes('Nerdle/1.0') || window.isMobileApp
    // return true if 'newMobileApp' is in localStorage and set to 'true'
    // return localStorage.getItem('newMobileApp') === 'true'
}

export const postToFlutter = (message: string) => {
    if (isNewMobileApp()) {
        //flutterChannel.postMessage(message)
        window.flutter_inappwebview.callHandler('flutterHandler', message)
    }
}

export const platform = () => {
    console.log('platform: ' + localStorage.getItem('platform'))
    return localStorage.getItem('platform') || 'web'
}
