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

import { request } from '../utils/request' //202604171435  引入request
import { useToast } from '@nuxt/ui/composables' //202604171435 引入toast
import Swal from 'sweetalert2' // 未登录弹窗引导
import { useRouter } from 'vue-router'

const toast = useToast() //202604171435 调用toast
const router = useRouter()

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

// 统一写入本地最高分缓存
function saveBestScoreLocally(id, val) {
  const keyMap = {
    'retro-dodge': 'retro_dodge_best_score',
    'click-rush': 'click_rush_best_score',
    'color-blitz': 'color_blitz_best_score',
    'lane-shot': 'lane_shot_best_score',
    'stack-rift': 'stack_rift_best_score',
    'odd-tap': 'odd_tap_best_score',
    'number-order': 'number_order_best_score',
    'dot-dodge': 'dot_dodge_best_score',
  }
  const key = keyMap[id]
  if (key) localStorage.setItem(key, String(val))
}

// 202604171435 游戏结束 -> 提交分数
async function handleGameOver(payload) {
  score.value = payload.score
  best.value = payload.bestScore

  // 只有创造历史最高分时才需要处理
  if (score.value !== best.value) return

  // 先写入本地缓存（无论是否登录都保留记录）
  saveBestScoreLocally(currentGameId.value, score.value)

  // 未登录：弹窗引导，不走网络
  const isLoggedIn = localStorage.getItem('8bit_loginStatus') === 'true'
  if (!isLoggedIn) {
    Swal.fire({
      title: 'Leaderboard Unavailable',
      text: 'Login required to enter the leaderboard. Your score is saved locally.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c2cf47',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Login',
      cancelButtonText: 'Register',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login')
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        router.push('/register')
      }
    })
    return
  }

  // 已登录：提交后台
  try {
    const param = {
      game_id: currentGameId.value,
      score: score.value
    }
    const res = await request.post('game-scores', param)
    console.log(res)

    toast.add({
      title: 'Submit Success',
      description: 'Game score has been submitted.',
      icon: 'i-lucide-circle-check',
      color: 'success',
      progress: false
    })
  } catch (err) {
    console.log(err)
    toast.add({
      title: 'Submission Failed',
      description: err.message,
      icon: 'i-lucide-circle-alert',
      color: 'warning',
      progress: false
    })
  }
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