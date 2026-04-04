<template>
  <GameLayout
    :score="score"
    :best="best"
    :game-state="gameState"
    :game-meta="currentGame.metadata || {}"
    :game-count="availableGameIds.length"
    :game-options="gameOptions"
    :current-game-id="currentGameId"
    @start="handleStart"
    @reset="handleReset"
    @switch-game="switchGame"
  >
    <template #game>
      <GameCanvas
        :key="currentGameId"
        :game-module="currentGame"
        @ready="handleReady"
        @score-change="handleScoreChange"
        @game-over="handleGameOver"
        @state-change="handleStateChange"
        @register-game="handleRegisterGame"
      />
    </template>
  </GameLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GameLayout from '../components/game/GameLayout.vue'
import GameCanvas from '../components/game/GameCanvas.vue'
import { gameRegistry } from '../games/runtime/gameRegistry'
import { loadExternalGame } from '../games/runtime/loadExternalGame'

const currentGameId = ref('retro-dodge')
const currentGame = computed(() => gameRegistry[currentGameId.value])

const availableGameIds = ref(Object.keys(gameRegistry))

const gameOptions = computed(() =>
  availableGameIds.value.map((id) => ({
    id,
    label: gameRegistry[id].metadata.name
  }))
)

const score = ref(0)
const best = ref(0)
const gameState = ref('idle')
const gameInstance = ref<any>(null)

function handleRegisterGame(game: any) {
  gameInstance.value = game
}

function handleReady() {
  gameState.value = 'ready'
}

function handleScoreChange(payload: { score: number; bestScore: number }) {
  score.value = payload.score
  best.value = payload.bestScore
}

function handleGameOver(payload: { score: number; bestScore: number }) {
  score.value = payload.score
  best.value = payload.bestScore
}

function handleStateChange(state: string) {
  gameState.value = state
}

function handleStart() {
  gameInstance.value?.start?.()
}

function handleReset() {
  gameInstance.value?.reset?.()
}

function switchGame(gameId: string) {
  if (!gameRegistry[gameId]) return

  gameInstance.value?.destroy?.()

  score.value = 0
  best.value = 0
  gameState.value = 'idle'
  gameInstance.value = null

  currentGameId.value = gameId
}

onMounted(async () => {
  const externalGame = await loadExternalGame('/games/testGame.js')

  if (!externalGame) return

  const gameId = externalGame.metadata.id

  if (gameRegistry[gameId]) return

  gameRegistry[gameId] = externalGame
  availableGameIds.value.push(gameId)
})
</script>