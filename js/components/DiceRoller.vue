<template>
    <div class="dice-roller" :class="{ rolling: isRolling, 'rolling-all': isRollingAll }" v-if="rolls !== null">
        <input type="text" style="margin-bottom: 1em" v-if="devMode" v-model="devDice">

        <ul class="dice-list">
            <li v-for="(d, i) in dice" class="die-item" :class="{ disabled: gameOver }">
                <label class="die-wrap" :class="{ reroll: reroll[i] }" @mouseup="toggleReroll(i)">
                    <input type="checkbox" class="die-input" :checked="reroll[i]" :disabled="gameOver">
                    <DieFace :number="d" />
                </label>
            </li>
        </ul>

        <div class="dice-controls">
            <button class="button roll-button" :disabled="shouldDisableRollBtn" @click="roll()">Roll</button>
            <div class="select-all-wrap">
                <button class="button select-all-button" :disabled="shouldDisableSelectAllBtn" @click="selectAll()">Select All</button>
            </div>
        </div>
        <p class="rolls-left">
            <span v-if="gameOver">Game Over</span>
            <span v-else>Rolls left: {{ rolls }}</span>
        </p>
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
            dice: [6, 6, 6, 6, 6],
            isRolling: false,
            isRollingAll: false,
            reroll: [false, false, false, false, false],
            rollingTime: 300
        };
    },

    computed: {
        shouldDisableRollBtn() {
            return this.rolls === 0 || this.gameOver || this.reroll.every(r => !r);
        },

        shouldDisableSelectAllBtn() {
            return this.rolls === 0 || this.gameOver;
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

        handleKeyEvents() {
            window.addEventListener('keyup', event => {
                let key = event.key;

                if (key.toLowerCase() === 'r' && !this.shouldDisableRollBtn) {
                    this.roll();
                }

                if (key.toLowerCase() === 'a' && !this.shouldDisableSelectAllBtn) {
                    this.selectAll();
                }

                if (key.match(/[1-5]/gi)) {
                    key = parseInt(key);
                    key--;
                    this.toggleReroll(key);
                }
            });
        },

        async roll() {
            if (this.reroll.every(r => !r)) return;

            this.isRolling = true;

            await new Promise(resolve => setTimeout(() => resolve(), this.rollingTime));

            this.dice = this.dice.map((d, i) => {
                if (!this.reroll[i]) return d;
                return rand();
            });

            this.isRolling = false;
            
            this.deselectAll();

            this.emitRoll();
        },

        async rollAll() {
            this.isRollingAll = true;

            await new Promise(resolve => setTimeout(() => resolve(), this.rollingTime));

            this.dice = this.dice.map((d, i) => {
                return rand();
            });

            this.isRollingAll = false;

            this.emitRoll();
        },

        selectAll() {
            this.reroll = this.reroll.map(() => true);
        },

        toggleReroll(index) {
            if (this.rolls === 0 || this.gameOver) {
                return;
            }
            this.$set(this.reroll, index, !this.reroll[index]);
        }
    },
    
    created() {
        this.handleKeyEvents();
        events.$on('reset-reroll-selections', () => this.deselectAll());
    },

    components: {
        DieFace
    }
}
</script>