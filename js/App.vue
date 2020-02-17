<template>
    <div class="wrapper">
        <button class="restart" @click="start()">
            Restart Game
        </button>
        <DiceRoller :rolls="rolls" @roll="rolls--" />
    </div>
</template>

<script>
import DiceRoller from './components/DiceRoller';

export default {
    name: 'App',

    data() {
        return {
            rolls: null
        }
    },

    methods: {
        start() {
            this.rolls = 3;
        }
    },

    mounted() {
        this.start();
    },

    components: {
        DiceRoller
    }
};
</script>