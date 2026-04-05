<template>
  <div class="space-y-8 lg:space-y-10">
    <!-- Header -->
    <section class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12">
      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Rankings
        </p>
        <h1 class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl">
          Leaderboard
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Track the strongest players, highest scores, and current streaks across the arcade.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-px bg-[rgba(66,73,78,0.2)] lg:col-span-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-[var(--color-surface-container-lowest)] p-6"
        >
          <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
            {{ stat.label }}
          </p>
          <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">
            {{ stat.value }}
          </p>
        </div>
      </div>
    </section>

    <!-- Filters / Mode Switch -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-3 lg:col-span-9">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="mode in modes"
            :key="mode"
            :class="[
              'px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition',
              activeMode === mode
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
            ]"
            @click="activeMode = mode"
          >
            {{ mode }}
          </button>
        </div>
      </div>

      <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-4 lg:col-span-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
            Season
          </span>
          <span class="text-xs font-bold uppercase text-[var(--color-primary)]">
            S1 // LIVE
          </span>
        </div>
      </div>
    </section>

    <!-- Main -->
    <section class="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <!-- Ranking Table -->
      <div class="xl:col-span-8">
        <div class="overflow-hidden border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)]">
          <div class="grid grid-cols-12 border-b border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)] px-4 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-outline-variant)] sm:px-6">
            <div class="col-span-2 sm:col-span-1">Rank</div>
            <div class="col-span-6 sm:col-span-5">Player</div>
            <div class="hidden sm:block sm:col-span-3">Main Game</div>
            <div class="col-span-4 sm:col-span-2 text-right">Score</div>
            <div class="hidden sm:block sm:col-span-1 text-right">Win</div>
          </div>

          <div
            v-for="player in rankingList"
            :key="player.rank"
            :class="[
              'grid grid-cols-12 items-center border-b border-[rgba(66,73,78,0.12)] px-4 py-4 transition-colors sm:px-6',
              player.rank <= 3
                ? 'bg-[var(--color-surface-container-high)]'
                : 'bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)]'
            ]"
          >
            <div class="col-span-2 sm:col-span-1">
              <span
                :class="[
                  'inline-flex min-w-[2.5rem] items-center justify-center px-2 py-1 text-xs font-black uppercase',
                  player.rank === 1
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : player.rank === 2
                    ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-secondary)]'
                    : player.rank === 3
                    ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-tertiary)]'
                    : 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface-variant)]'
                ]"
              >
                #{{ String(player.rank).padStart(2, '0') }}
              </span>
            </div>

            <div class="col-span-6 flex items-center gap-3 sm:col-span-5">
              <img
                :src="player.avatar"
                :alt="player.name"
                class="h-10 w-10 border border-[rgba(66,73,78,0.2)] object-cover grayscale"
              />
              <div class="min-w-0">
                <p class="truncate text-sm font-bold uppercase">
                  {{ player.name }}
                </p>
                <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                  {{ player.title }}
                </p>
              </div>
            </div>

            <div class="hidden sm:block sm:col-span-3">
              <p class="truncate text-xs uppercase text-[var(--color-on-surface-variant)]">
                {{ player.game }}
              </p>
            </div>

            <div class="col-span-4 text-right sm:col-span-2">
              <p class="text-sm font-black uppercase text-[var(--color-primary)]">
                {{ player.score }}
              </p>
            </div>

            <div class="hidden sm:block sm:col-span-1 text-right">
              <p class="text-xs font-bold uppercase">
                {{ player.winRate }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-8 xl:col-span-4">
        <!-- Top 3 -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Top 3 Pilots
          </h2>

          <div class="space-y-4">
            <div
              v-for="player in topThree"
              :key="player.rank"
              class="flex items-center gap-4 bg-[var(--color-surface-container-low)] p-4"
            >
              <div class="flex h-10 w-10 items-center justify-center bg-[var(--color-surface-container-lowest)] text-sm font-black text-[var(--color-primary)]">
                {{ player.rank }}
              </div>

              <img
                :src="player.avatar"
                :alt="player.name"
                class="h-10 w-10 border border-[rgba(66,73,78,0.2)] object-cover grayscale"
              />

              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold uppercase">
                  {{ player.name }}
                </p>
                <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                  {{ player.score }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- System Panel -->
        <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
          <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Board Status
          </h2>

          <ul class="space-y-5">
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Refresh</span>
              <span class="text-xs font-bold uppercase">Every 5 min</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Active Board</span>
              <span class="text-xs font-bold uppercase text-[var(--color-primary)]">Global</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Records</span>
              <span class="text-xs font-bold uppercase">12,480</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Integrity</span>
              <span class="text-xs font-bold uppercase text-[var(--color-primary)]">Verified</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const activeMode = ref('Global')

const modes = ['Global', 'Weekly', 'Friends']

const stats = [
  { label: 'Players Ranked', value: '12.4K' },
  { label: 'Highest Score', value: '999.9K' },
  { label: 'Active Streak', value: '128' },
  { label: 'Updated', value: 'LIVE' }
]

const allPlayers = [
  {
    rank: 1,
    name: 'Vortex',
    title: 'Grid Dominator',
    game: 'Tetris',
    score: '999,900',
    winRate: '98%',
    avatar: 'https://i.pravatar.cc/100?img=12'
  },
  {
    rank: 2,
    name: 'Pixel_Punk',
    title: 'Wall Breaker',
    game: 'Brick Breaker',
    score: '932,440',
    winRate: '95%',
    avatar: 'https://i.pravatar.cc/100?img=14'
  },
  {
    rank: 3,
    name: 'Neon',
    title: 'Signal Runner',
    game: 'Reflex',
    score: '901,210',
    winRate: '94%',
    avatar: 'https://i.pravatar.cc/100?img=33'
  },
  {
    rank: 4,
    name: 'ByteKid',
    title: 'Combo Hunter',
    game: 'Memory',
    score: '870,800',
    winRate: '91%',
    avatar: 'https://i.pravatar.cc/100?img=20'
  },
  {
    rank: 5,
    name: 'ZeroLag',
    title: 'Arcade Ghost',
    game: 'Tetris',
    score: '845,110',
    winRate: '90%',
    avatar: 'https://i.pravatar.cc/100?img=18'
  },
  {
    rank: 6,
    name: 'NovaHex',
    title: 'Pulse Striker',
    game: 'Brick Breaker',
    score: '801,540',
    winRate: '88%',
    avatar: 'https://i.pravatar.cc/100?img=45'
  },
  {
    rank: 7,
    name: 'RetroFox',
    title: 'Light Jumper',
    game: 'Reflex',
    score: '780,200',
    winRate: '86%',
    avatar: 'https://i.pravatar.cc/100?img=50'
  },
  {
    rank: 8,
    name: 'MonoCat',
    title: 'Pattern Mind',
    game: 'Memory',
    score: '752,980',
    winRate: '84%',
    avatar: 'https://i.pravatar.cc/100?img=60'
  }
]

const rankingList = computed(() => allPlayers)
const topThree = computed(() => allPlayers.slice(0, 3))
</script>