<template>
  <div ref="gameRoot" class="w-full h-full bg-black touch-none"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
//outside game loader
import { createPlatformGame } from '../../games/runtime/gameLoader'



const gameRoot = ref(null)
let game = null

function mountGame() {
  if (!gameRoot.value || !props.gameModule) return

  game?.destroy?.()
  game = null

  game = createPlatformGame(
    props.gameModule,
    {
      mountEl: gameRoot.value,
      onReady: () => {
        emit('ready')
      },
      onScoreChange: (payload) => {
        emit('score-change', payload)
      },
      onGameOver: (payload) => {
        emit('game-over', payload)
      },
      onStateChange: (state) => {
        emit('state-change', state)
      }
    }
  )

  emit('register-game', game)
}

const props = defineProps({
  gameModule: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'ready',
  'score-change',
  'game-over',
  'state-change',
  'register-game'
])

onMounted(() => {
  mountGame()
})

onBeforeUnmount(() => {
  game?.destroy()
})
</script>