/* -- Helper functions -- */

// Sums the entire hand
function sumAll(dice) {
    return dice.reduce((total, val) => total + val, 0);
}

// Sums all the occurrences of number, `num`.
function sumAllOfGivenNumber(dice, num) {
    return dice.reduce((acc, val) => {
        return val === num ? acc + val : acc;
    }, 0);
}

// Returns true if any number is found n number of times. Otherwise false.
function nOfAKind(dice, n) {
    return dice.some(die => {
        return n <= dice.reduce((acc, val) => val === die ? acc + 1 : acc, 0);
    });
}

// Returns an object with the keys 1-6, the value of each being the number of times
// that number occurred in the hand.
function getOccurrences(dice) {
    const map = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
    };

    return dice.reduce((acc, val) => {
        acc[val]++;
        return acc;
    }, map);
}


/* -- Scoring functions -- */

function ones(dice) {
    return sumAllOfGivenNumber(dice, 1);
}

function twos(dice) {
    return sumAllOfGivenNumber(dice, 2);
}

function threes(dice) {
    return sumAllOfGivenNumber(dice, 3);
}

function fours(dice) {
    return sumAllOfGivenNumber(dice, 4);
}

function fives(dice) {
    return sumAllOfGivenNumber(dice, 5);
}

function sixes(dice) {
    return sumAllOfGivenNumber(dice, 6);
}

function threeOfAKind(dice) {
    if(nOfAKind(dice, 3)) return sumAll(dice);
    return 0;
}

function fourOfAKind(dice) {
    if(nOfAKind(dice, 4)) return sumAll(dice);
    return 0;
}

function fullHouse(dice) {
    if (!nOfAKind(dice, 3)) return 0;
    const occurrences = getOccurrences(dice);
    const hasFullHouse = Object.entries(occurrences).some(([key, val]) => val === 2);
    return hasFullHouse ? 25 : 0;
}

function smallStraight(dice) {
    dice.sort();
    // remove duplicates
    dice = dice.reduce((acc, val) => {
        if (!acc.includes(val)) {
            acc.push(val);
        }
        return acc;
    }, []);
    dice = dice.join('');
    const hasSmallStraight = ['1234', '2345', '3456'].some(combo => dice.includes(combo));
    return hasSmallStraight ? 30 : 0;
}

function largeStraight(dice) {
    dice.sort();
    dice = dice.join('');
    const hasLargeStraight = ['12345', '23456'].some(combo => dice.includes(combo));
    return hasLargeStraight ? 40 : 0;
}

function royalRoll(dice, score) {
    if (!nOfAKind(dice, 5)) {
        return 0;
    }

    return !score ? 50 : score + 100;
}

function chance(dice) {
    return sumAll(dice);
}

export default {
    ones,
    twos,
    threes,
    fours,
    fives,
    sixes,
    threeOfAKind,
    fourOfAKind,
    fullHouse,
    smallStraight,
    largeStraight,
    royalRoll,
    chance
};