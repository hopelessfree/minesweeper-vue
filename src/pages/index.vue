<script setup lang="ts" >
import MineBlock from '~/components/MineBlock.vue'
import { isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'

const game = new GamePlay(12, 12)

const {
  state,
  reset,
  onClick,
  onRightClick,
} = game

</script>

<template>
  <div>
    Minesweeper

    <button @click="toggleDev()">
      {{ isDev }}
    </button>

    <div p5>
      <div
        v-for="(row, y) in state"
        :key="y"
        flex="~"
        items-center justify-center
      >
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="onClick(block)"
          @contextmenu.prevent="onRightClick(block)"
        />
      </div>
    </div>

    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev ? 'DEV' : 'NORMAL' }}
      </button>
      <button btn @click="reset()">
        REST
      </button>
    </div>
  </div>
</template>
