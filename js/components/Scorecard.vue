<template>
    <div class="scorecard">
        <div class="scorecard-tables">
            <table class="top-table">
                <tbody>
                    <tr v-for="(val, key) in top" :key="key">
                        <td class="score-name-cell">{{ labels[key] }}</td>
                        <td class="score-cell">
                            <button
                                class="score-button"
                                v-if="scorecard[key] === null"
                                v-text="getScoreButtonLabel(key)"
                                @click="scoreTurn('top', key)"
                            ></button>
                            <span class="score-label" v-else>{{ scorecard[key] }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="score-name-cell">Bonus</td>
                        <td class="score-cell bonus-cell"><span class="score-label">{{ topBonusDisplay }}</span></td>
                    </tr>
                </tbody>
            </table>
            
            <table class="bottom-table">
                <tbody>
                    <tr v-for="(val, key) in bottom" :key="key">
                        <td class="score-name-cell">{{ labels[key] }}</td>
                        <td class="score-cell">
                            <button
                                class="score-button"
                                v-if="shouldShowBottomScoreButton(key, val)"
                                v-text="getScoreButtonLabel(key)"
                                @click="scoreTurn('bottom', key)"
                            ></button>
                            <span class="score-label" v-else>{{ scorecard[key] }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import scoringFunctions from '../utils/scoring-functions';

export default {
    name: 'Scorecard',

    props: ['rolls', 'dice'],

    data() {
        return {
            top: {
                ones: null,
                twos: null,
                threes: null,
                fours: null,
                fives: null,
                sixes: null
            },

            bottom: {
                threeOfAKind: null,
                fourOfAKind: null,
                fullHouse: null,
                smallStraight: null,
                largeStraight: null,
                royalRoll: null,
                chance: null
            },
            
            topBonus: null,
            
            labels: {
                ones: 'Ones',
                twos: 'Twos',
                threes: 'Threes',
                fours: 'Fours',
                fives: 'Fives',
                sixes: 'Sixes',
                topBonus: 'Bonus',
                threeOfAKind: 'Three of a Kind',
                fourOfAKind: 'Four of a Kind',
                fullHouse: 'Full House',
                smallStraight: 'Small Straight',
                largeStraight: 'Large Straight',
                royalRoll: 'Royal Roll',
                chance: 'Chance'
            },

            scoreOfDice: {},

            isSelectingJoker: false
        };
    },

    watch: {
        dice(val) {
            this.scoreDice();
        }
    },

    computed: {
        scorecard() {
            return { ...this.top, ...this.bottom };
        },

        scorecardKeys() {
            return Object.keys(this.scorecard);
        },

        topBonusDisplay() {
            if (this.topBonus !== null) {
                return this.topBonus;
            }

            const topTotal = Object.values(this.top).reduce((acc, val) => acc + val, 0);
            return `${63 - topTotal} to go`;
        }
    },

    methods: {
        calculateScore(key) {
            if (key in scoringFunctions) {
                if (key === 'royalRoll') {
                    return scoringFunctions.royalRoll(this.dice, this.bottom.royalRoll);
                }
                return scoringFunctions[key](this.dice);
            }
            return 0;
        },

        calculateTopBonus() {
            if (this.topBonus !== null) {
                return;
            }

            // if top, check for completion of top and apply bonus if needed
            const completedTop = Object.values(this.top).every(val => val !== null);
            const topTotal = Object.values(this.top).reduce((acc, val) => acc + val, 0);

            if (topTotal >= 63) {
                this.topBonus = 35;
                return;
            }

            if (completedTop) {
                this.topBonus = topTotal >= 63 ? 35 : 0;
            }
        },

        checkForGameOver() {
            const scorecardIncomplete = Object.values(this.scorecard).some(val => val === null);

            if (!scorecardIncomplete) {
                this.$emit('gameover');
            }
        },

        getScoreButtonLabel(key) {
            if (!key in this.scoreOfDice) return 0;
            return this.scoreOfDice[key];
        },

        handleRoyalRoll() {
            if (this.bottom.royalRoll === null) {
                this.bottom.royalRoll = this.scoreOfDice.royalRoll;
                this.$emit('scored');
                return;
            }

            if (this.bottom.royalRoll !== 0) {
                this.bottom.royalRoll += 100;
            }

            // Joker rules

            const keyOfTopNumRolled = Object.keys(this.top)[this.dice[0] - 1];

            if (this.top[keyOfTopNumRolled] === null) {
                this.top[keyOfTopNumRolled] = this.scoreOfDice[keyOfTopNumRolled];
                this.$emit('scored');
                return;
            }

            // if the appropriate top section isn't available, the following scores apply
            this.isSelectingJoker = true;

            // Top section
            Object.entries(this.top).forEach(([key, val]) => {
                if (key === keyOfTopNumRolled) {
                    return;
                }
                this.scoreOfDice[key] = scoringFunctions[key](this.dice);
            });

            // Bottom section
            this.scoreOfDice.threeOfAKind = scoringFunctions.sumAll(this.dice);
            this.scoreOfDice.fourOfAKind = scoringFunctions.sumAll(this.dice);
            this.scoreOfDice.fullHouse = 25;
            this.scoreOfDice.smallStraight = 30;
            this.scoreOfDice.largeStraight = 40;
            this.scoreOfDice.chance = scoringFunctions.sumAll(this.dice);
        },

        scoreDice() {
            this.scoreOfDice = this.scorecardKeys.reduce((scores, key) => {
                const score = this.calculateScore(key);
                scores[key] = score;
                return scores;
            }, { ...this.scorecard });
        },

        scoreTurn(section, key) {
            if (key === 'royalRoll') {
                this.handleRoyalRoll();
                this.calculateTopBonus();
                this.checkForGameOver();
                return;
            }

            this.isSelectingJoker = false;

            this[section][key] = this.scoreOfDice[key];

            this.calculateTopBonus();
            
            this.$emit('scored');
            this.checkForGameOver();
        },

        shouldShowBottomScoreButton(key, val) {
            if (key === 'royalRoll' && val !== null && val !== 0) {
                return this.isSelectingJoker ? false : this.scoreOfDice[key] > 0;
            }
            return val === null;
        }
    },
}
</script>