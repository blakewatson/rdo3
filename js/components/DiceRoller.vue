<template>
    <div class="dice-roller" v-if="rolls !== null">
        <input type="text" style="margin-bottom: 1em" v-if="devMode" v-model="devDice">

        <ul class="dice-list">
            <li v-for="(d, i) in dice" class="die-item" :class="{ disabled: gameOver }">
                <label class="die-wrap" :class="{ reroll: reroll[i] }" @mouseup="toggleReroll(i)">
                    <input type="checkbox" class="die-input" :checked="reroll[i]" :disabled="gameOver">
                    <!-- <span class="die-face">{{ d | die }}</span> -->
                    <DieFace :number="d" />
                </label>
            </li>
        </ul>

        <button class="button roll-button" :disabled="shouldDisableRollBtn" @click="roll()">Roll</button>
    </div>
</template>

<script>
import events from '../event-bus';
import rand from '../utils/random-numbers';
import DieFace from './DieFace';

export default {
    name: 'DiceRoller',

    props: ['gameOver', 'rolls'],

    data() {
        return {
            devMode: false,
            devDice: '',
            dice: [null, null, null, null, null],
            reroll: [false, false, false, false, false]
        };
    },

    computed: {
        shouldDisableRollBtn() {
            return this.rolls === 0 || this.gameOver || this.reroll.every(r => !r);
        }
    },

    watch: {
        devDice(val) {
            this.dice = val.split('').map(d => parseInt(d));

            if(this.dice.length === 5) {
                this.$emit('rolled', this.dice, true);
            }
        },

        rolls(newVal, oldVal) {
            if (oldVal === null && newVal !== null) {
                this.rollAll();
                return;
            }

            if (newVal === 3) {
                this.rollAll();
                return;
            }
        }
    },

    methods: {
        deselectAll() {
            this.reroll = this.reroll.map(() => false);
        },

        emitRoll() {
            this.$emit('rolled', this.dice);
        },

        roll() {
            if (this.reroll.every(r => !r)) return;

            this.dice = this.dice.map((d, i) => {
                if (!this.reroll[i]) return d;
                return rand();
            });
            
            this.deselectAll();

            this.emitRoll();
        },

        rollAll() {
            this.dice = this.dice.map((d, i) => {
                return rand();
            });

            this.emitRoll();
        },

        toggleReroll(index) {
            if (this.gameOver) {
                return;
            }
            this.$set(this.reroll, index, !this.reroll[index]);
        }
    },
    
    created() {
        events.$on('reset-reroll-selections', () => this.deselectAll());
    },

    components: {
        DieFace
    }
}
</script>