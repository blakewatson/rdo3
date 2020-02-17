<template>
    <div class="wrapper">
        <button class="restart" @click="start()">
            Restart Game
        </button>
        <DiceRoller :rolls="rolls" @rolled="rolled" />
        <Scorecard :dice="dice" :rolls="rolls" @scored="scored" @end="endGame" />
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
        endGame() {},

        rolled(dice) {
            this.dice = dice;
            this.rolls--;
        },

        scored() {},

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