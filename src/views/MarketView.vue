<template>
  <div class="space-y-8 lg:space-y-10">
    <!-- Header -->
    <section class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12">
      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Game Catalog
        </p>
        <h1 class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl">
          Market
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Explore the full game library, check descriptions, ratings, and jump straight into the action. Players can also upload their own game scripts.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-px bg-[rgba(66,73,78,0.2)] lg:col-span-4">
        <div class="bg-[var(--color-surface-container-lowest)] p-6">
          <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">Platform</p>
          <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">{{ platforms }}</p>
        </div>
        <div class="bg-[var(--color-surface-container-lowest)] p-6">
          <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">External</p>
          <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">{{ externals }}</p>
        </div>
        <div class="bg-[var(--color-surface-container-lowest)] p-6">
          <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">Total</p>
          <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">{{ games.length }}</p>
        </div>
        <div class="bg-[var(--color-surface-container-lowest)] p-6">
          <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">Your Best</p>
          <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">{{ myBestCount }}</p>
        </div>
      </div>
    </section>

    <!-- Upload -->
    <div class="flex justify-end">
      <button
        class="flex items-center gap-2 border border-[var(--color-primary)] bg-[var(--color-surface-container)] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]"
        @click="handleUploadClick"
      >
        <span class="material-symbols-outlined text-sm">upload</span>
        Upload Your Game
      </button>
    </div>

    <!-- Game Grid -->
    <section class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="game in games"
        :key="game.id"
        class="group flex flex-col border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-6 transition-colors hover:bg-[var(--color-surface-container-high)]"
      >
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold uppercase">{{ game.name }}</h3>
            <span
              class="mt-1 inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em]"
              :class="game.source === 'external'
                ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30'
                : 'bg-lime-500/15 text-lime-300 ring-1 ring-lime-400/30'"
            >
              {{ game.source === 'external' ? 'External' : 'Platform' }}
            </span>
          </div>
          <span class="material-symbols-outlined text-3xl text-[var(--color-primary)]">{{ game.icon }}</span>
        </div>

        <div class="min-h-[40px]">
          <p class="text-sm leading-5 text-[var(--color-on-surface-variant)] line-clamp-2">
            {{ game.description }}
          </p>
        </div>

        <div class="mt-3 mb-3 flex items-center gap-3 text-xs">
          <span class="flex items-center gap-px text-[11px] text-[var(--color-primary)]/60">
            <span class="material-symbols-outlined" style="font-size: 11px;">thumb_up</span>
            {{ game.likeCount }}
          </span>
          <span class="flex items-center gap-px text-[11px] text-[var(--color-primary)]/60">
            <span class="material-symbols-outlined" style="font-size: 11px;">thumb_down</span>
            {{ game.dislikeCount }}
          </span>
        </div>

        <div class="flex items-center justify-between border-t border-[rgba(66,73,78,0.12)] pt-4">
          <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">Your Best Score</span>
          <span class="text-sm font-bold text-[var(--color-primary)]">{{ game.bestScore }}</span>
        </div>

        <router-link
          :to="{ path: '/arcade', query: { game: game.id } }"
          class="mt-4 flex items-center justify-center gap-2 border border-[var(--color-primary)] py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]"
        >
          Play Now
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </router-link>
      </div>
    </section>
  </div>

  <!-- 未登录引导 -->
  <UModal
    v-model:open="showLoginPrompt"
    :ui="{
      overlay: 'bg-black/70 backdrop-blur-sm z-[10000]',
      content: 'z-[10001] border-2 border-green-500 bg-black shadow-[0_0_30px_rgba(74,222,128,0.15)] rounded-none',
      header: 'border-b border-green-500/20 pb-3',
      title: 'text-lg font-bold tracking-widest text-green-400 uppercase',
      body: 'text-sm text-green-300/70 leading-relaxed py-4',
      footer: 'border-t border-green-500/20 pt-4 flex justify-end gap-3',
      close: 'text-green-500/50 hover:text-green-300'
    }"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-green-400">login</span>
        Login Required
      </div>
    </template>

    <template #body>
      <p>You need to log in or register to upload your own game.</p>
    </template>

    <template #footer="{ close }">
      <UButton
        color="primary"
        variant="solid"
        class="bg-green-500 text-black font-bold tracking-widest uppercase rounded-none px-6 hover:bg-green-400"
        @click="close(); router.push('/login')"
      >
        Login
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        class="border-green-500 text-green-400 font-bold tracking-widest uppercase rounded-none px-6 hover:bg-green-500/10"
        @click="close(); router.push('/register')"
      >
        Register
      </UButton>
    </template>
  </UModal>

  <!-- Upload Coming Soon -->
  <UModal
    v-model:open="showUploadModal"
    :ui="{
      overlay: 'bg-black/70 backdrop-blur-sm z-[10000]',
      content: 'z-[10001] border-2 border-green-500 bg-black shadow-[0_0_30px_rgba(74,222,128,0.15)] rounded-none',
      header: 'border-b border-green-500/20 pb-3',
      title: 'text-lg font-bold tracking-widest text-green-400 uppercase',
      body: 'text-sm text-green-300/70 leading-relaxed py-4 text-center',
      footer: 'border-t border-green-500/20 pt-4 flex justify-center',
      close: 'text-green-500/50 hover:text-green-300'
    }"
  >
    <template #title>
      <div class="flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-green-400">construction</span>
        Coming Soon
      </div>
    </template>

    <template #body>
      <p>Game upload is not available yet.</p>
      <p class="mt-1 text-green-400/60">You will be able to submit your own game scripts here.</p>
    </template>

    <template #footer="{ close }">
      <UButton
        color="primary"
        variant="solid"
        class="bg-green-500 text-black font-bold tracking-widest uppercase rounded-none px-8 hover:bg-green-400"
        @click="close()"
      >
        Got it
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gameRegistry } from '../games/runtime/gameRegistry'
import { loadExternalGame } from '../games/runtime/loadExternalGame'
import { request } from '../utils/request'
import { useRouter } from 'vue-router'

interface GameItem {
  id: string
  name: string
  description: string
  source: string
  bestScore: string
  icon: string
  likeCount: number
  dislikeCount: number
}

const scoreKeyMap: Record<string, string> = {
  'retro-dodge': 'retro_dodge_best_score',
  'click-rush': 'click_rush_best_score',
  'color-blitz': 'color_blitz_best_score',
  'lane-shot': 'lane_shot_best_score',
  'stack-rift': 'stack_rift_best_score',
  'odd-tap': 'odd_tap_best_score',
  'number-order': 'number_order_best_score',
  'dot-dodge': 'dot_dodge_best_score',
}

const iconMap: Record<string, string> = {
  'retro-dodge': 'grid_view',
  'click-rush': 'touch_app',
  'color-blitz': 'palette',
  'lane-shot': 'my_location',
  'stack-rift': 'layers',
  'dot-dodge': 'radio_button_unchecked',
}

function getBestScore(gameId: string): string {
  const isLoggedIn = localStorage.getItem('8bit_loginStatus') === 'true'
  if (!isLoggedIn) return '0'

  const key = scoreKeyMap[gameId]
  if (!key) return '0'
  try {
    const val = Number(localStorage.getItem(key) || 0)
    return val > 0 ? val.toLocaleString() : '0'
  } catch {
    return '0'
  }
}

function getIcon(gameId: string): string {
  return iconMap[gameId] || 'sports_esports'
}

const games = ref<GameItem[]>([])
const platforms = ref(0)
const externals = ref(0)
const myBestCount = ref(0)
const router = useRouter()
const showUploadModal = ref(false)
const showLoginPrompt = ref(false)

function handleUploadClick() {
  const isLoggedIn = localStorage.getItem('8bit_loginStatus') === 'true'
  if (!isLoggedIn) {
    showLoginPrompt.value = true
  } else {
    showUploadModal.value = true
  }
}

onMounted(async () => {
  const isLoggedIn = localStorage.getItem('8bit_loginStatus') === 'true'
  const all: GameItem[] = []
  let platCount = 0
  let extCount = 0
  let scoredCount = 0

  // 1) 内置游戏
  for (const [id, entry] of Object.entries(gameRegistry)) {
    if (!entry || !entry.metadata) continue
    const meta = entry.metadata as any
    all.push({
      id,
      name: meta.name || id,
      description: meta.description || '',
      source: 'platform',
      bestScore: getBestScore(id),
      icon: getIcon(id),
      likeCount: 0,
      dislikeCount: 0,
    })
    platCount++
    if (isLoggedIn && scoreKeyMap[id] && Number(localStorage.getItem(scoreKeyMap[id]) || 0) > 0) scoredCount++
  }

  // 2) 外部游戏
  try {
    const response = await fetch('/games/games.json', { cache: 'no-store' })
    if (response.ok) {
      const gameList = await response.json()
      for (const item of gameList) {
        if (!item?.path || item.enabled === false) continue
        const external = await loadExternalGame(item.path)
        if (!external || !external.metadata?.id) continue
        const meta = external.metadata as any
        const gid = meta.id
        // 避免重复
        if (all.some(g => g.id === gid)) continue
        all.push({
          id: gid,
          name: meta.name || gid,
          description: meta.description || '',
          source: 'external',
          bestScore: getBestScore(gid),
          icon: getIcon(gid),
          likeCount: 0,
          dislikeCount: 0,
        })
        extCount++
        if (isLoggedIn && scoreKeyMap[gid] && Number(localStorage.getItem(scoreKeyMap[gid]) || 0) > 0) scoredCount++
      }
    }
  } catch {}

  games.value = all
  platforms.value = platCount
  externals.value = extCount
  myBestCount.value = scoredCount

  // 3) 获取 like/dislike 统计
  try {
    const res = await request.get('game-feedback-stats')
    const stats = res?.data || {}
    for (const game of games.value) {
      const s = stats[game.id]
      if (s) {
        game.likeCount = s.like ?? 0
        game.dislikeCount = s.dislike ?? 0
      }
    }
  } catch {
    // 失败时保留 0
  }
})
</script>
