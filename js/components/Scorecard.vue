<template>
    <div class="scorecard">
        <div class="scorecard-tables">
            <table class="top-table">
                <tbody>
                    <tr v-for="(val, key) in top" :key="key">
                        <td class="score-name-cell">{{ labels[key] }}</td>
                        <td class="score-cell">
                            <button class="score-button" v-text="getScoreButtonLabel(key)"></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <table class="bottom-table">
                <tbody>
                    <tr v-for="(val, key) in bottom" :key="key">
                        <td class="score-name-cell">{{ labels[key] }}</td>
                        <td class="score-cell">
                            <button class="score-button" v-text="getScoreButtonLabel(key)"></button>
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
                royalRoll: null
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
                royalRoll: 'Royal Roll'
            },

            scoreOfDice: {}
        };
    },

    watch: {
        rolls(val) {
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
        }
    },
}
</script>