const fs = require('fs');
const path = require('path');

const puzzlesDir = './puzzles';

function checkMissingFiles() {
    console.log('=== CHECKING FOR MISSING FILES ===');
    
    // Get all JSON files in puzzles directory
    const files = fs.readdirSync(puzzlesDir)
        .filter(file => file.endsWith('.json'))
        .map(file => parseInt(file.replace('.json', '')))
        .filter(num => !isNaN(num))
        .sort((a, b) => a - b);
    
    if (files.length === 0) {
        console.log('No puzzle files found!');
        return [];
    }
    
    const minDay = Math.min(...files);
    const maxDay = Math.max(...files);
    const missing = [];
    
    console.log(`Found files from day ${minDay} to day ${maxDay}`);
    
    // Check for missing files in sequence
    for (let day = minDay; day <= maxDay; day++) {
        if (!files.includes(day)) {
            missing.push(day);
        }
    }
    
    if (missing.length > 0) {
        console.log('Missing files:', missing.map(day => `${day}.json`).join(', '));
    } else {
        console.log('✅ No missing files found');
    }
    
    return missing;
}

function canMakeWord(letters, word) {
    const letterCount = {};
    
    // Count available letters
    for (const letter of letters.toUpperCase()) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
    
    // Check if word can be made
    const wordCount = {};
    for (const letter of word.toUpperCase()) {
        wordCount[letter] = (wordCount[letter] || 0) + 1;
    }
    
    for (const [letter, needed] of Object.entries(wordCount)) {
        if (!letterCount[letter] || letterCount[letter] < needed) {
            return false;
        }
    }
    
    return true;
}

function checkPuzzleContent() {
    console.log('\n=== CHECKING PUZZLE CONTENT ===');
    
    const files = fs.readdirSync(puzzlesDir)
        .filter(file => file.endsWith('.json'))
        .sort((a, b) => {
            const aNum = parseInt(a.replace('.json', ''));
            const bNum = parseInt(b.replace('.json', ''));
            return aNum - bNum;
        });
    
    const invalidPuzzles = [];
    
    for (const file of files) {
        const filePath = path.join(puzzlesDir, file);
        const dayNumber = file.replace('.json', '');
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const puzzleData = JSON.parse(content);
            
            // Validate structure - should be groups of 4 items
            if (puzzleData.length % 4 !== 0) {
                invalidPuzzles.push({
                    day: dayNumber,
                    error: `Invalid structure: ${puzzleData.length} items (should be multiple of 4)`
                });
                continue;
            }
            
            const rounds = puzzleData.length / 4;
            
            for (let round = 0; round < rounds; round++) {
                const startIndex = round * 4;
                const letters = puzzleData[startIndex];     // Available letters
                const scores = puzzleData[startIndex + 1];  // Letter scores
                const solution = puzzleData[startIndex + 2]; // ChatGPT solution
                const solutionScore = puzzleData[startIndex + 3]; // Solution score
                
                // Check if solution can be made from available letters
                if (!canMakeWord(letters, solution)) {
                    invalidPuzzles.push({
                        day: dayNumber,
                        round: round + 1,
                        error: `Solution "${solution}" cannot be made from letters "${letters}"`
                    });
                }
                
                // Check if scores string matches letters length
                if (letters.length !== scores.length) {
                    invalidPuzzles.push({
                        day: dayNumber,
                        round: round + 1,
                        error: `Letters "${letters}" (${letters.length}) and scores "${scores}" (${scores.length}) length mismatch`
                    });
                }
                
                // Check if solution score is a number
                if (typeof solutionScore !== 'number') {
                    invalidPuzzles.push({
                        day: dayNumber,
                        round: round + 1,
                        error: `Solution score "${solutionScore}" is not a number`
                    });
                }
            }
            
        } catch (error) {
            invalidPuzzles.push({
                day: dayNumber,
                error: `Failed to parse JSON: ${error.message}`
            });
        }
    }
    
    if (invalidPuzzles.length > 0) {
        console.log('❌ Invalid puzzles found:');
        invalidPuzzles.forEach(puzzle => {
            if (puzzle.round) {
                console.log(`  Day ${puzzle.day}, Round ${puzzle.round}: ${puzzle.error}`);
            } else {
                console.log(`  Day ${puzzle.day}: ${puzzle.error}`);
            }
        });
    } else {
        console.log('✅ All puzzles are valid');
    }
    
    return invalidPuzzles;
}

// Run both checks
console.log('WordGPT Puzzle Checker\n');

const missingFiles = checkMissingFiles();
const invalidPuzzles = checkPuzzleContent();

console.log('\n=== SUMMARY ===');
console.log(`Missing files: ${missingFiles.length}`);
console.log(`Invalid puzzles: ${invalidPuzzles.length}`);

if (missingFiles.length === 0 && invalidPuzzles.length === 0) {
    console.log('🎉 All checks passed!');
} else {
    console.log('⚠️  Issues found - see details above');
}