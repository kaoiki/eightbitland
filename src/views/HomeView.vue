<template>
  <div class="space-y-8 lg:space-y-16">
    <!-- Hero Section -->
    <section class="monolith-shadow grid grid-cols-1 gap-0 overflow-hidden bg-[var(--color-surface-container-low)] md:grid-cols-12">
      <div class="relative h-80 bg-[var(--color-surface-container-lowest)] md:col-span-7 md:h-96">
        <img
          alt="Pixel Breaker"
          class="h-full w-full object-cover opacity-40 mix-blend-luminosity"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZJ4PnrbjC9t-lKiDEGw2UJSi60ZxzCJEzlViAtNwsNZTZkjyvGHJD_oKkenZZbhuIPBsrc__YLAzbYTrQmdradTeDBzeQ_-aUh-51tRceJiL3vtQT_4ysQhgbm5mEgSX9a-lp7C98lLTeiMbtxo7DHt0sG-HzDsoGZsAGU-cPS9n4PlVNsP57nh8gKSwVyvJQX_ksLfbb-Qqfvg-AX0Bm7x8MqryUTovyGdHCxU3L5Fe-kocpP0BK2enjpsbyuKTL1_5pcjNqYfE"
        />

        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <h2 class="text-4xl font-black leading-none tracking-tighter uppercase text-[var(--color-primary)] sm:text-5xl md:text-7xl">
              PIXEL<br />
              BREAKER
            </h2>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 md:col-span-5 md:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Game of the Moment
        </p>
        <h3 class="mb-6 text-2xl font-bold uppercase">
          Break the cycle. Conquer the grid.
        </h3>
        <button
          class="w-full bg-[var(--color-primary)] py-4 font-black uppercase tracking-widest text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-0.5"
        >
          PLAY
        </button>
      </div>
    </section>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <!-- Left Game Cards -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-3">
        <div
          v-for="game in games"
          :key="game.id"
          class="group border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8 transition-colors hover:bg-[var(--color-surface-container-high)]"
        >
          <div class="mb-8 flex items-start justify-between">
            <span class="material-symbols-outlined scale-150 text-[var(--color-primary)]">
              {{ game.icon }}
            </span>
            <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">
              ID: {{ game.id }}
            </span>
          </div>

          <h4 class="mb-2 text-xl font-bold uppercase">
            {{ game.title }}
          </h4>

          <div class="space-y-4">
            <div class="flex justify-between border-b border-[rgba(66,73,78,0.2)] pb-2">
              <span class="text-xs uppercase text-[var(--color-on-surface-variant)]">High Score</span>
              <span class="text-xs font-bold text-[var(--color-primary)]">
                {{ game.score }}
              </span>
            </div>

            <button class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline">
              Enter Stage
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar Area -->
      <div class="space-y-8">
        <!-- System Monitor -->
        <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
          <h5 class="mb-8 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            System Monitor
          </h5>

          <ul class="space-y-6">
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Status</span>
              <span class="text-xs font-bold text-[var(--color-primary)]">ONLINE</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Uptime</span>
              <span class="text-xs font-bold">42:08:12</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Signal</span>
              <span class="text-xs font-bold">STABLE</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Players</span>
              <span class="text-xs font-bold">1,429</span>
            </li>
          </ul>
        </div>

        <!-- Rankings -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h5 class="mb-8 text-xs font-black uppercase tracking-[0.3em]">
            Top Rankings
          </h5>

          <div class="space-y-4">
            <div
              v-for="player in players"
              :key="player.rank"
              :class="[
                'flex items-center gap-4 p-3',
                player.rank === '01'
                  ? 'bg-[var(--color-surface-container-highest)]'
                  : 'bg-[var(--color-surface-container-low)]'
              ]"
            >
              <img
                :alt="player.name"
                class="h-8 w-8 grayscale"
                :src="player.avatar"
              />
              <div class="flex-1">
                <p
                  :class="[
                    'text-xs font-bold uppercase',
                    player.rank === '01' ? 'text-[var(--color-primary)]' : ''
                  ]"
                >
                  {{ player.name }}
                </p>
                <p class="text-[8px] text-[var(--color-secondary)]">
                  RANK {{ player.rank }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- spacer for smaller screens visual breathing -->
    <div class="h-2 lg:hidden"></div>
  </div>
</template>

<script setup lang="ts">
const games = [
  { id: '001', title: 'Tetris', score: '849,200', icon: 'grid_view' },
  { id: '002', title: 'Brick Breaker', score: '124,000', icon: 'rectangle' },
  { id: '003', title: 'Reflex', score: '0.18ms', icon: 'bolt' },
  { id: '004', title: 'Memory', score: 'LEVEL 99', icon: 'neurology' }
]

const players = [
  {
    rank: '01',
    name: 'Vortex',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcuXPU9oOX7VZVr1-gmOdbnTLupoB6xcf2k29aA3jzKMVnIPtZ6-VFFHabdvJgruDv8dTS_a-vSOOfI2APpAPDzBGTjbn8GznJ2ra9XetrPFS040oaWz8iBecqLq9O2qnzcmDEN9FuMoLzGO0eN-qTKQZrEPYz6IyhIbC1oaf2MiNM9vtm7L4e0Btmub9XHW2nmd6t20m8AJ36W1xp8IP8ipT6_6ucEP64Y4aigDQ0Gn7XNk6VJ9OAZb8EaPkgreQK3HwKq2c5Bo0'
  },
  {
    rank: '02',
    name: 'Pixel_Punk',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6017OK4zUF0u0uIEjd6Agb6KTpudQZXNcj2nDvg9roGiobV3hmF5Zw77LfcfYr7S9VivrzEc_-YRSaPQ5MmNvTaytzob_Mlypa_zIHPc35VMNZM4Babsdmvy28BulAfW_Ao7qK1KD9TYQVLeShPX7CqzsExBBImeyaT18V4fvXLB3GZwmWiTQDgNsB9UEfJf8BP_78KP1bMOyKZip9nLGsYofzq8dHP3gSq-yM5B3p4oo7keyOTt01imxiZJRyth0MxHNu697LP4'
  },
  {
    rank: '03',
    name: 'Neon',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkt0e26OfdlP0EZyPhoNtKnn9Glt6uSmDLoyMVT7pmGXUzUF2XwjaHEdAjkHuPyYS5fZZI-irR9m2wwJ8h_lw4rTdP3kYjYDXulyp6eJ4R6GFMi4qhmhNjiVEaqPKFSkoR6Vm6s1RjfwiJTHGrd5EmTPafG_-5BlpcamCZOwQPAqx7gt9RH3qGSjpTSxk_R3zTKgF31rS-cnkAaBZ7QuYHHVraha9nq3BOuAbRoAhshHkHObF-uBJzS39YAnJO4-ZhbYMoHzx7MYs'
  }
]
</script>