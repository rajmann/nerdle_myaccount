const straightRules = [
	{
		minPoints: 7,
		name: "7 days straight",
		smallImage: "https://nerdlegame.com/badges/straights/small/7.png",
		smallImageGray: "https://nerdlegame.com/badges/straights/small/7_gray.png",
		largeImage: "https://nerdlegame.com/badges/straights/large/[gameMode]/7.png",
		smallBrokenImage: "https://nerdlegame.com/badges/straights/small/7_x.png",
		next: 30,
	},
	// {
	// 	minPoints: 30,
	// 	name: "30 days straight",
	// 	smallImage: "https://nerdlegame.com/badges/straights/small/30.png",
	// 	smallImageGray: "https://nerdlegame.com/badges/straights/small/30_gray.png",
	// 	largeImage: "https://nerdlegame.com/badges/straights/large/[gameMode]/30.png",
	// 	smallBrokenImage: "https://nerdlegame.com/badges/straights/small/30_x.png",
	// 	next: 60,
	// },
	// {
	// 	minPoints: 60,
	// 	name: "60 days straight",
	// 	smallImage: "https://nerdlegame.com/badges/straights/small/60.png",
	// 	smallImageGray: "https://nerdlegame.com/badges/straights/small/60_gray.png",
	// 	largeImage: "https://nerdlegame.com/badges/straights/large/[gameMode]/60.png",
	// 	smallBrokenImage: "https://nerdlegame.com/badges/straights/small/60_x.png",
	// 	next: 100,
	// },
	// {
	// 	minPoints: 100,
	// 	name: "100 days straight",
	// 	smallImage: "https://nerdlegame.com/badges/straights/small/100.png",
	// 	smallImageGray: "https://nerdlegame.com/badges/straights/small/100_gray.png",
	// 	largeImage: "https://nerdlegame.com/badges/straights/large/[gameMode]/100.png",
	// 	smallBrokenImage: "https://nerdlegame.com/badges/straights/small/100_x.png",
	// 	next: 0,
	// },
];


export const getLocalStraights = () => {

    // read currentStraight from local storage.
    // if it doesn't exist, return 0
    let currentStraight = parseInt(localStorage.getItem('currentStraight') || '0')

	// // get lastPlayed from local storage
	const lastPlayed = JSON.parse(localStorage.getItem('lastPlayed') || '{}')
	const gameMode = localStorage.getItem('gameMode') || ''

	// // get the last played date for current gameMode 
	const lastPlayedDate = lastPlayed[gameMode == '' ? 'classic' : gameMode] || ''

	// get yesterday in that format
	const yesterday = new Date()
	yesterday.setDate(yesterday.getDate() - 1)
	const yesterdayStr = yesterday.toISOString().split('T')[0]

	// straightRules sort by minPoints descending
	straightRules.sort((a, b) => b.minPoints - a.minPoints)

	//if lastPlayedDate is yesterday or greater then return the first rule where currentStraight is greater than minPoints
	if (lastPlayedDate >= yesterdayStr) {
		// return the first rule where currentStraight is greater than minPoints
    	let theRule = straightRules.find(rule => currentStraight >= rule.minPoints)
		// replace [gameMode] in largeImage with gameMode
		if (theRule) {
			theRule.largeImage = theRule.largeImage.replace('[gameMode]', gameMode=='' ? 'classic' : gameMode)
		}
		return theRule
	} else {

		// if currentStraight is greater than 7, 30, 60, or 100, return broken rule
		const brokenRule = straightRules.find(rule => currentStraight >= rule.minPoints)

		if (brokenRule) {
			return {
				...brokenRule,
				smallImage: brokenRule.smallBrokenImage,
				broken: true
			}
		}

		return null
	}

}