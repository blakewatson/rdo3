<template>
    <div class="scorecard">
        <div class="scorecard-tables">
            <table class="top-table">
                <tbody>
                    <tr v-for="(val, key) in top" :key="key">
                        <td class="score-name-cell">{{ labels[key] }}</td>
                        <td class="score-cell">
                            <!-- TODO: special rules for top bonus -->
                            <button
                                class="score-button"
                                v-if="scorecard[key] === null"
                                v-text="getScoreButtonLabel(key)"
                                @click="scoreTurn('top', key)"
                            ></button>
                            <span class="score-label" v-else>{{ scorecard[key] }}</span>
                        </td>
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
                sixes: null,
                topBonus: null
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

            scoreOfDice: {}
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

        getScoreButtonLabel(key) {
            if (!key in this.scoreOfDice) return 0;
            return this.scoreOfDice[key];
        },

        scoreDice() {
            this.scoreOfDice = this.scorecardKeys.reduce((scores, key) => {
                const score = this.calculateScore(key);
                scores[key] = score;
                return scores;
            }, { ...this.scorecard });
        },

        scoreTurn(section, key) {
            this[section][key] = this.scoreOfDice[key];
            this.$emit('scored');
        },

        shouldShowBottomScoreButton(key, val) {
            if (key === 'royalRoll' && val !== null && val !== 0) {
                return this.scoreOfDice[key] > 0;
            }
            return val === null;
        }
    },
}
</script>