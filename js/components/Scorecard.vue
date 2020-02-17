<template>
    <div class="scorecard">
        Scorecard
    </div>
</template>

<script>
export default {
    name: 'Scorecard',

    props: ['rolls'],

    data() {
        return {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            topBonus: null,
            threeOfAKind: null,
            fourOfAKind: null,
            fullHouse: null,
            smallStraight: null,
            largeStraight: null,
            royalRoll: null,
        };
    },

    methods: {

    },
}
</script>