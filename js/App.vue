<template>
    <div class="wrapper">
        <button class="restart" @click="start()">
            Restart Game
        </button>
        <DiceRoller :rolls="rolls" @rolled="rolled" />
        <Scorecard :dice="dice" :rolls="rolls" @scored="scored" @gameover="endGame" />
    </div>
</template>

<script>
import DiceRoller from './components/DiceRoller';
import Scorecard from './components/Scorecard';

export default {
    name: 'App',

    data() {
        return {
            dice: [],
            rolls: null
        }
    },

    methods: {
        endGame() {
            alert(`Game over.`);
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
            this.rolls = 3;
        },

        start() {
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