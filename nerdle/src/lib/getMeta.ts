export const getMeta = () => {

    // get the subdomain
    const subdomain = window.location.hostname.split('.')[0];

    var title = "Nerdle - daily number puzzles, brain-teasers & math games"
    var description = "Daily number games from the nerdleverse, home of fun math games, brain-teasers and puzzles. Like a word puzzle but with numbers."

    switch (subdomain) {
        case 'mini':
            title = 'Mini nerdle - an easy online math game';
            description = "Mini nerdle is a simple, online math game with a new puzzle to solve each day. Guess the six-digit nerdle in six tries or less.";
            break;
        case 'micro':
            title = 'Micro nerdle - easy online math and numbering game';
            description = 'For fans of word puzzles but with numbers, micro nerdle is the easiest math game in the nerdleverse with a five-digit number puzzle to solve in six tries or less.';
            break;
        case 'maxi':
            title = 'Maxi nerdle - an intermediate mathematical challenge';
            description = 'Maxi nerdle is a new math game that challenges you to guess a 10-digit number calculation. For math enthusiasts looking for a daily math riddle.';
            break;
        case 'speed':
            title = 'Speed nerdle - the classic math game but against the clock';
            description = 'Speed nerdle is the classic nerdle math game but played against the clock. Work out the calculation as quickly as you can to complete the challenge.';
            break;
        case 'instant':
            title = 'Instant nerdle - solve the math puzzle in one try';
            description = "Instant nerdle is the hardest math game in the nerdleverse. Challenge yourself to work out the math calculation in just one guess to master the instant nerdle!";
            break;
        default:
            break;
    }

    return { title, description };

}