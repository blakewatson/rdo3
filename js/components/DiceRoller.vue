<template>
    <div class="dice-roller" v-if="rolls !== null">
        <input type="text" style="margin-bottom: 1em" v-if="devMode" v-model="devDice">

        <ul class="dice-list">
            <li v-for="(d, i) in dice" class="die-item">
                <label class="die-wrap" :class="{ reroll: reroll[i] }" @mouseup="toggleReroll(i)">
                    <input type="checkbox" class="die-input" :checked="reroll[i]">
                    <span class="die-face">{{ d | die }}</span>
                </label>
            </li>
        </ul>

        <button class="button roll-button" :disabled="rolls === 0" @click="roll()">Roll</button>
    </div>
</template>

<script>
export default {
    name: 'DiceRoller',
    props: ['rolls'],

    data() {
        return {
            devMode: true,
            devDice: '',
            dice: [null, null, null, null, null],
            reroll: [false, false, false, false, false]
        };
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
                return Math.floor(Math.random() * 6) + 1;
            });
            
            this.deselectAll();

            this.emitRoll();
        },

        rollAll() {
            this.dice = this.dice.map((d, i) => {
                return Math.floor(Math.random() * 6) + 1;
            });

            this.emitRoll();
        },

        toggleReroll(index) {
            this.$set(this.reroll, index, !this.reroll[index]);
        }
    },

    filters: {
        die(val) {
            return val === null ? '—' : val;
        }
    }
}
</script>