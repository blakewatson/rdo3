<template>
    <div class="wrapper">
        <div class="sidebar">
            <button class="restart" @click="start()">
                Restart Game
            </button>
            <p class="high-score">Personal Best: <strong>{{ highScore | scoreDisplay }}</strong></p>
        </div>
        <DiceRoller :game-over="gameOver" :rolls="rolls" @rolled="rolled" />
        <Scorecard :dice="dice" :game-over="gameOver" :rolls="rolls" @scored="scored" @gameover="endGame" />
    </div>
</template>

<script>
import events from './event-bus';
import DiceRoller from './components/DiceRoller';
import Scorecard from './components/Scorecard';

export default {
    name: 'App',

    data() {
        return {
            dice: [],
            gameOver: false,
            highScore: 0,
            rolls: null
        }
    },

    methods: {
        endGame(grandTotal) {
            this.gameOver = true;
            this.recordHighScore(grandTotal)
        },

        recordHighScore(grandTotal) {
            if (grandTotal > this.highScore) {
                this.highScore = grandTotal;
                localStorage.setItem('rdo3-high-score', grandTotal);
            }
        },

        rolled(dice, devMode = false) {
            this.dice = dice;

            if (devMode) {
                this.rolls = 0;
                return;
            }

            this.rolls--;
        },

        scored() {
            if (this.gameOver) {
                return;
            }
            this.rolls = 3;
            events.$emit('reset-reroll-selections');
        },

        start() {
            events.$emit('start');
            this.gameOver = false;
            this.rolls = 3;
        }
    },

    filters: {
        scoreDisplay(val) {
            return val ? val : '—';
        }
    },

    created() {
        const storage = localStorage.getItem('rdo3-high-score');
        this.highScore = storage ? parseInt(storage) : 0;
    },

    mounted() {
        this.start();
    },

    components: {
        DiceRoller,
        Scorecard
    }
};
</script>