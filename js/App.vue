<template>
    <div class="wrapper">
        <button class="restart" @click="start()">
            Restart Game
        </button>
        <DiceRoller :rolls="rolls" @roll="rolls--" />
        <Scorecard :rolls="rolls" @scored="scored" @end="endGame" />
    </div>
</template>

<script>
import DiceRoller from './components/DiceRoller';
import Scorecard from './components/Scorecard';

export default {
    name: 'App',

    data() {
        return {
            rolls: null
        }
    },

    methods: {
        endGame() {},

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