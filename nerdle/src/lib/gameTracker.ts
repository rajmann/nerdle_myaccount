export const getGamesPlayedToday = () => {
    // const gp = getQueryStringValue("gp");
    let gp = []

    // get lastPlayed object from local storage
    const lastPlayed = JSON.parse(localStorage.getItem("lastPlayed") || "{}");

    //console.log('lp, ', lastPlayed)

    // for each game in lastPlayed, check if date is today, format is:
    // {"gameName": "2020-12-01"}
    for (const gameName in lastPlayed) {
        const date = lastPlayed[gameName];
        const today = new Date().toISOString().substring(0, 10);
        if (date === today) {
            gp.push(gameName);
        }
    }

    //console.log(gp)
    
    return gp

    //first 8 chars are the date
    // const date = gp.substring(0, 10);
    // const today = new Date().toISOString().substring(0, 10);

    // if (date !== today) {
    //     return [];
    // }

    //return gp ? gp.split(",") : [];
}

const getQueryStringValue = (key: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key) || "";
}

export const setGamesPlayedToday = (gameName: string) => {
    // const gameMode = gameName === '' ? 'classic' :  gameName
    // const today = new Date().toISOString().substring(0, 10);
    // const gp = getGamesPlayedToday();
    // if (gp.length==0) {
    //     gp.push(today);
    // }
    // if (gp.indexOf(gameMode) === -1) {
    //     gp.push(gameMode);
    // }
   
    // return gp.join(",");
    let gp = getGamesPlayedToday()
    const today = new Date().toISOString().substring(0, 10);
    gp.unshift(today)
    return gp.join(",");
}



export const hasGameBeenPlayed = (gameName: string) => {

    const lastPlayed = JSON.parse(localStorage.getItem("lastPlayed") || "{}");
    const date = lastPlayed[gameName];

    // if exists then game has been payed at some point - even if not today
    if (date) {
        return true;
    }

    return false;

}

// get array of games played in last 7 days
export const getGamesPlayedInLast7Days = () => {
    let gp = []

    const lastPlayed = JSON.parse(localStorage.getItem("lastPlayed") || "{}");

    for (const gameName in lastPlayed) {
        const date = lastPlayed[gameName];
        const today = new Date().toISOString().substring(0, 10);
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10);
        if (date >= sevenDaysAgo && date <= today) {
            gp.push(gameName);
        }
    }

    console.log('last 7 days: ', gp)

    return gp
}

export const getGamesPlayedEver = () => {
    let gp = []

    const lastPlayed = JSON.parse(localStorage.getItem("lastPlayed") || "{}");

    for (const gameName in lastPlayed) {
        gp.push(gameName);
    }

    return gp
}