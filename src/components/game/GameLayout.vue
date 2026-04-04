<template>
  <div class="h-screen w-full bg-black text-green-400 flex justify-center px-4 overflow-hidden">
    <div class="w-full max-w-[420px] h-screen flex flex-col items-center justify-center">
      <GameHeader
        :game-meta="gameMeta"
        :game-count="gameCount"
        :game-options="gameOptions"
        :current-game-id="currentGameId"
        @switch-game="$emit('switch-game', $event)"
      />

      <div class="w-full aspect-4/5 border-4 border-green-500 flex flex-col">
        <div class="flex-1">
          <slot name="game" />
        </div>
      </div>

      <GameFooter
        :score="score"
        :best="best"
        :game-state="gameState"
        @start="$emit('start')"
        @reset="$emit('reset')"
      />
    </div>
  </div>
</template>

<script setup>
import GameHeader from './GameHeader.vue'
import GameFooter from './GameFooter.vue'

defineProps({
  score: {
    type: Number,
    default: 0
  },
  best: {
    type: Number,
    default: 0
  },
  gameState: {
    type: String,
    default: 'idle'
  },
  gameMeta: {
    type: Object,
    default: () => ({})
  },
  gameCount: {
    type: Number,
    default: 0
  },
  gameOptions: {
    type: Array,
    default: () => []
  },
  currentGameId: {
    type: String,
    default: ''
  }
})

defineEmits(['start', 'reset', 'switch-game'])
</script>