<template>
    <div class="wrapper">
        <button class="restart" @click="start()">
            Restart Game
        </button>
        <DiceRoller :game-over="gameOver" :rolls="rolls" @rolled="rolled" />
        <Scorecard :dice="dice" :rolls="rolls" @scored="scored" @gameover="endGame" />
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
            rolls: null
        }
    },

    methods: {
        endGame() {
            this.gameOver = true;
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
        },

        start() {
            events.$emit('start');
            this.gameOver = false;
            this.rolls = 3;
        }
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