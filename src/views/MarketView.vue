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
          Browse all available games, check descriptions, and jump straight into the action.
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

    <!-- Game Grid -->
    <section class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="game in games"
        :key="game.id"
        class="group border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-6 transition-colors hover:bg-[var(--color-surface-container-high)]"
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

        <p class="mb-4 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          {{ game.description }}
        </p>

        <div class="mb-4 flex items-center justify-between border-t border-[rgba(66,73,78,0.12)] pt-4">
          <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">Your Best Score</span>
          <span class="text-sm font-bold text-[var(--color-primary)]">{{ game.bestScore }}</span>
        </div>

        <router-link
          :to="'/arcade'"
          class="flex items-center justify-center gap-2 border border-[var(--color-primary)] py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]"
        >
          Play Now
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { gameRegistry } from '../games/runtime/gameRegistry'
import { loadExternalGame } from '../games/runtime/loadExternalGame'

interface GameItem {
  id: string
  name: string
  description: string
  source: string
  bestScore: string
  icon: string
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
  'lane-shot': 'crosshair',
  'stack-rift': 'layers',
  'dot-dodge': 'radio_button_unchecked',
}

function getBestScore(gameId: string): string {
  const key = scoreKeyMap[gameId]
  if (!key) return '—'
  try {
    const val = Number(localStorage.getItem(key) || 0)
    return val > 0 ? val.toLocaleString() : '—'
  } catch {
    return '—'
  }
}

function getIcon(gameId: string): string {
  return iconMap[gameId] || 'sports_esports'
}

const games = ref<GameItem[]>([])
const platforms = ref(0)
const externals = ref(0)
const myBestCount = ref(0)

onMounted(async () => {
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
    })
    platCount++
    if (scoreKeyMap[id] && Number(localStorage.getItem(scoreKeyMap[id]) || 0) > 0) scoredCount++
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
        })
        extCount++
        if (scoreKeyMap[gid] && Number(localStorage.getItem(scoreKeyMap[gid]) || 0) > 0) scoredCount++
      }
    }
  } catch {}

  games.value = all
  platforms.value = platCount
  externals.value = extCount
  myBestCount.value = scoredCount
})
</script>
