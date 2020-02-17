function sumAll(dice) {
    return dice.reduce((total, val) => total + val, 0);
}

function sumAllOfGivenNumber(dice, num) {
    return dice.reduce((acc, val) => {
        return val === num ? acc + val : acc;
    }, 0);
}

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

function nOfAKind(dice, n) {
    return dice.some(die => {
        return n <= dice.reduce((acc, val) => val === die ? acc + 1 : acc, 0);
    });
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
    
}

export default {
    ones,
    twos,
    threes,
    fours,
    fives,
    sixes,
    threeOfAKind,
    fourOfAKind
};