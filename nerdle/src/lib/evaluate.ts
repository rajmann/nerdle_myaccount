var BigEval = require('bigeval')

export const evaluate = (expression: string) => {
    var Obj = new BigEval();
    
    //replace ² with ^2
    expression = expression.replace(/²/g, '^2')

    //replace ³ with ^3
    expression = expression.replace(/³/g, '^3')

    // //replace a digit followed by a ( with a * e.g. 3( becomes 3*(
    // expression = expression.replace(/([0-9])(\()/g, '$1*$2')
    
    // replace a distinct number (integer or floating point) followed immediately by π e.g. 23π or 31.4π with everything in brackets and an asterlsk e.g. (23*π) or (31.4*π)
    expression = expression.replace(/([0-9.]+)(π)/g, '($1*$2)')

    // //replace a digit followed by π with a * e.g. 3π becomes 3*π
    // expression = expression.replace(/([0-9])(π)/g, '$1*$2')

    //replace π with 'PI'
    //expression = expression.replace(/π/g, 'PI')
    expression = expression.replace(/π/g, '3.142')

    // replace ^ with **
    const newExpression = expression.replace(/\^/g, '**')

    return Obj.exec(newExpression)
}

const morph = (expression: string): string => {
    // replace each n in expression with n*n/n+1
    // -> decimals included 
    const newExpression = expression.replace(/[0-9.]+/g, (match) => {
    //const newExpression = expression.replace(/[0-9]+/g, (match) => {
        return '(' + match + '+' + match + '*' + match + '/' + (parseInt(match)+1).toString() + ')'
    })
    return newExpression
}

export const doesCommute = (expression1: string, solution: string, gameMode: string =""): boolean => {

    var s1 = expression1.split('').sort().join('');
    var s2 = solution.split('').sort().join('');

    // get value on right side of = in solution
    //const true_answer = parseFloat(solution.split('=')[1])
    const s_true_answer = solution.split('=')[1]
    
    // get calc on left side of = in solution
    const true_calc = solution.split('=')[0]
    // get value on right side of = in expression1
    const answer = parseFloat(evaluate(expression1.split('=')[1]))
    // get calc on left side of = in expression1
    const calc = expression1.split('=')[0]

    // this should be fine for all games but for now let's only do it for maxi mode
    if (gameMode === 'maxi') {
        // get all the number parts (e.g. in 24+4-12*3=0 we get 24, 4, 12, 3, 0)
        const numbers = solution.match(/[0-9]+/g)
        const numbers1 = expression1.match(/[0-9]+/g) 

        // make sure that all numbers in solution are in expression1
        if (numbers && numbers1) {
            for (let i=0; i<numbers.length; i++) {
                if (numbers1.indexOf(numbers[i]) === -1) {
                    console.log('maxi issue ... ');
                    return false
                }
            }
        }
    }

    return (
        (s1 === s2) &&
       // (answer === true_answer) && 
        ((Math.abs(evaluate(calc)-Math.abs(evaluate(s_true_answer)))<0.0001)) &&
        ((Math.abs(evaluate(morph(calc))-evaluate(morph(true_calc))))<0.00001))

}

// here we test if the user has misunderstood BODMAS .. this will only
// work for classic puzzles e.g. if someone thinks 1+2*3=9 it will return true
// and we use this to be able to prompt the user why they got the wrong answer
export const isBODMASWrong = (expression1: string): {result: boolean, lhs: string, realAnswer: string} => {
    
    // don't do anything if there is no = sign
    if (expression1.indexOf('=') === -1) {
        return {result: false, lhs: '', realAnswer: ''}
    }

    // don't do anything if there are operators on right of equals sign
    if (expression1.split('=')[1].match(/[+\-*/]/g)) {
        return {result: false, lhs: '', realAnswer: ''}
    }

    // don't do anything if expression1 is larger than 8 characters
    if (expression1.length > 8) {
        return {result: false, lhs: '', realAnswer: ''}
    }

    // put brackets around the first pair of numbers e.g. for input 1+2*3=7 output (1+2)*3=7
    const newExpression = expression1.replace(/([0-9]+)([+\-*/])([0-9]+)/g, '($1$2$3)')

    // now see if that computes ... 
    const answer = parseFloat(evaluate(newExpression.split('=')[1]))
    const calc = newExpression.split('=')[0]
    const originalLhs = expression1.split('=')[0]
    return {result: evaluate(calc)===answer, lhs: originalLhs, realAnswer: evaluate(originalLhs) } 

}

