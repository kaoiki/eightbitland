<template>
  <GameLayout
    :score="score"
    :best="best"
    :game-state="gameState"
    :game-meta="currentGame?.metadata || {}"
    :game-count="availableGameIds.length"
    :game-options="gameOptions"
    :current-game-id="currentGameId"
    @start="handleStart"
    @reset="handleReset"
    @switch-game="switchGame"
  >
    <template #game>
      <GameCanvas
        v-if="currentGame"
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

<script setup>
import { computed, onMounted, ref } from 'vue'
import GameLayout from '../components/game/GameLayout.vue'
import GameCanvas from '../components/game/GameCanvas.vue'
import { gameRegistry } from '../games/runtime/gameRegistry'
import { loadExternalGame } from '../games/runtime/loadExternalGame'

const currentGameId = ref('retro-dodge')
const currentGame = computed(() => gameRegistry[currentGameId.value] || null)

const availableGameIds = ref(Object.keys(gameRegistry))

const gameOptions = computed(() =>
  availableGameIds.value
    .filter((id) => gameRegistry[id] && gameRegistry[id].metadata)
    .map((id) => ({
      id,
      label: gameRegistry[id].metadata.name,
      source: gameRegistry[id].metadata.source || 'platform',
      icon: gameRegistry[id].metadata.source === 'external' ? '🧩' : '🎮',
      badge: gameRegistry[id].metadata.source === 'external' ? 'External' : 'Platform'
    }))
)

const score = ref(0)
const best = ref(0)
const gameState = ref('idle')
const gameInstance = ref(null)

function handleRegisterGame(game) {
  gameInstance.value = game
}

function handleReady() {
  gameState.value = 'ready'
}

function handleScoreChange(payload) {
  score.value = payload.score
  best.value = payload.bestScore
}

function handleGameOver(payload) {
  score.value = payload.score
  best.value = payload.bestScore
}

function handleStateChange(state) {
  gameState.value = state
}

function handleStart() {
  gameInstance.value?.start?.()
}

function handleReset() {
  gameInstance.value?.reset?.()
}

function switchGame(gameId) {
  if (!gameRegistry[gameId]) return

  gameInstance.value?.destroy?.()

  score.value = 0
  best.value = 0
  gameState.value = 'idle'
  gameInstance.value = null

  currentGameId.value = gameId
}

onMounted(async () => {
  try {
    // 1) 先统一处理内置游戏
    for (const id of Object.keys(gameRegistry)) {
      const game = gameRegistry[id]

      if (!game?.metadata) continue

      gameRegistry[id] = {
        ...game,
        metadata: {
          ...game.metadata,
          source: game.metadata?.source || 'platform'
        }
      }
    }

    // 2) 再加载外部游戏
    const response = await fetch('/games/games.json', {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch games.json: ${response.status}`)
    }

    const gameList = await response.json()

    for (const item of gameList) {
      if (!item?.path) continue
      if (item.enabled === false) continue

      const externalGame = await loadExternalGame(item.path)

      if (!externalGame || !externalGame.metadata?.id) continue

      const gameId = externalGame.metadata.id

      if (gameRegistry[gameId]) continue

      gameRegistry[gameId] = {
        ...externalGame,
        metadata: {
          ...externalGame.metadata,
          source: externalGame.metadata?.source || 'external'
        }
      }
    }

    availableGameIds.value = Object.keys(gameRegistry)
  } catch (error) {
    console.error('[ExternalGame] failed to load games.json:', error)
  }
})
</script>