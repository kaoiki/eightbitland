<template>
  <div class="space-y-8 lg:space-y-10">
    <!-- Header -->
    <section class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12">
      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Game Market
        </p>
        <h1 class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl">
          Arcade Market
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Explore platform-built arcade games and community-submitted experiments inside the same ecosystem.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-px bg-[rgba(66,73,78,0.2)] lg:col-span-4">
        <div
          v-for="item in marketStats"
          :key="item.label"
          class="bg-[var(--color-surface-container-lowest)] p-6"
        >
          <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
            {{ item.label }}
          </p>
          <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">
            {{ item.value }}
          </p>
        </div>
      </div>
    </section>

    <!-- Category Switch -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-3 lg:col-span-9">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="[
              'px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition',
              activeTab === tab
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
            ]"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-4 lg:col-span-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
            Library Status
          </span>
          <span class="text-xs font-bold uppercase text-[var(--color-primary)]">
            6 Games Live
          </span>
        </div>
      </div>
    </section>

    <!-- Main -->
    <section class="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <!-- Left Content -->
      <div class="space-y-8 xl:col-span-8">
        <!-- Platform Games -->
        <section v-if="activeTab === 'All' || activeTab === 'Platform'">
          <div class="mb-4 flex items-end justify-between">
            <div>
              <h2 class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Platform Games
              </h2>
              <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
                Built and maintained by the platform
              </p>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
              Core Collection
            </span>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="game in platformGames"
              :key="game.name"
              class="group overflow-hidden border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] transition hover:-translate-y-1 hover:bg-[var(--color-surface-container-high)]"
            >
              <div class="relative h-40 overflow-hidden border-b border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)]">
                <div class="absolute inset-0 opacity-30">
                  <div class="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,rgba(255,255,255,0.03)_70%,transparent)]" />
                </div>
                <div class="flex h-full items-end justify-between p-5">
                  <div>
                    <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
                      Platform
                    </p>
                    <h3 class="mt-2 text-xl font-black uppercase text-[var(--color-primary)]">
                      {{ game.name }}
                    </h3>
                  </div>
                  <span class="bg-[var(--color-primary)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--color-on-primary)]">
                    {{ game.genre }}
                  </span>
                </div>
              </div>

              <div class="space-y-4 p-5">
                <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]">
                  {{ game.description }}
                </p>

                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in game.tags"
                    :key="tag"
                    class="bg-[var(--color-surface-container-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-secondary)]"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="flex items-center justify-between border-t border-[rgba(66,73,78,0.12)] pt-4">
                  <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                    {{ game.status }}
                  </span>
                  <button
                    class="bg-[var(--color-primary)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110"
                  >
                    Launch
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- External Games -->
        <section v-if="activeTab === 'All' || activeTab === 'External'">
          <div class="mb-4 flex items-end justify-between">
            <div>
              <h2 class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                External Games
              </h2>
              <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
                Community-submitted games from outside creators
              </p>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
              User Submission
            </span>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="game in externalGames"
              :key="game.name"
              class="group overflow-hidden border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] transition hover:-translate-y-1 hover:bg-[var(--color-surface-container-high)]"
            >
              <div class="relative h-40 overflow-hidden border-b border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)]">
                <div class="absolute inset-0 opacity-30">
                  <div class="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,rgba(255,255,255,0.03)_70%,transparent)]" />
                </div>
                <div class="flex h-full items-end justify-between p-5">
                  <div>
                    <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
                      External
                    </p>
                    <h3 class="mt-2 text-xl font-black uppercase text-[var(--color-primary)]">
                      {{ game.name }}
                    </h3>
                  </div>
                  <span class="bg-[var(--color-surface-container-lowest)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[var(--color-secondary)]">
                    {{ game.genre }}
                  </span>
                </div>
              </div>

              <div class="space-y-4 p-5">
                <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]">
                  {{ game.description }}
                </p>

                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in game.tags"
                    :key="tag"
                    class="bg-[var(--color-surface-container-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-secondary)]"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="flex items-center justify-between border-t border-[rgba(66,73,78,0.12)] pt-4">
                  <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                    {{ game.status }}
                  </span>
                  <button
                    class="bg-[var(--color-primary)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110"
                  >
                    Play
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-8 xl:col-span-4">
        <!-- Featured -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Featured
          </h2>

          <div class="space-y-4">
            <div
              v-for="item in featuredGames"
              :key="item.name"
              class="bg-[var(--color-surface-container-low)] p-4"
            >
              <div class="flex items-center justify-between">
                <p class="text-sm font-bold uppercase">
                  {{ item.name }}
                </p>
                <span class="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--color-secondary)]">
                  {{ item.type }}
                </span>
              </div>
              <p class="mt-2 text-xs leading-5 text-[var(--color-on-surface-variant)]">
                {{ item.note }}
              </p>
            </div>
          </div>
        </div>

        <!-- Submission Status -->
        <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
          <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Submission Status
          </h2>

          <ul class="space-y-5">
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Platform Games</span>
              <span class="text-xs font-bold uppercase">3</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">External Games</span>
              <span class="text-xs font-bold uppercase">3</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Review State</span>
              <span class="text-xs font-bold uppercase text-[var(--color-primary)]">Stable</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Library Mode</span>
              <span class="text-xs font-bold uppercase">Open</span>
            </li>
          </ul>
        </div>

        <!-- Notice -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h2 class="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Notice
          </h2>
          <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]">
            Platform games are first-party titles. External games are community creations reviewed before listing.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabs = ['All', 'Platform', 'External']
const activeTab = ref('All')

const marketStats = [
  { label: 'Total Games', value: '06' },
  { label: 'Platform', value: '03' },
  { label: 'External', value: '03' },
  { label: 'Status', value: 'Live' }
]

const platformGames = [
  {
    name: 'Retro Dodge',
    genre: 'Arcade',
    description: 'A fast retro survival game where players dodge incoming hazards and stay alive as long as possible.',
    tags: ['Platform', 'Survival', 'Retro'],
    status: 'Core Title'
  },
  {
    name: 'ClickRush',
    genre: 'Reaction',
    description: 'A pure reflex challenge focused on speed, timing, and rapid clicking under increasing pressure.',
    tags: ['Platform', 'Speed', 'Reflex'],
    status: 'Core Title'
  },
  {
    name: 'Lane Shot',
    genre: 'Precision',
    description: 'A lane-based action game that rewards clean timing, sharp aim, and rhythmic movement.',
    tags: ['Platform', 'Timing', 'Arcade'],
    status: 'Core Title'
  }
]

const externalGames = [
  {
    name: 'OddTap',
    genre: 'Puzzle',
    description: 'A community-made pattern game built around identifying odd elements and reacting before time runs out.',
    tags: ['External', 'Puzzle', 'User Made'],
    status: 'Reviewed'
  },
  {
    name: 'Number Order',
    genre: 'Logic',
    description: 'A clean logic challenge where players arrange numbers in the correct order under limited time.',
    tags: ['External', 'Logic', 'User Made'],
    status: 'Reviewed'
  },
  {
    name: 'Dot Dodge',
    genre: 'Arcade',
    description: 'A minimalist dodge game created by a community developer, focused on simple visuals and sharp difficulty.',
    tags: ['External', 'Minimal', 'User Made'],
    status: 'Reviewed'
  }
]

const featuredGames = [
  {
    name: 'Retro Dodge',
    type: 'Platform',
    note: 'One of the main built-in arcade experiences and a good entry point for new players.'
  },
  {
    name: 'OddTap',
    type: 'External',
    note: 'A lightweight user-submitted title with strong puzzle rhythm and quick replay value.'
  },
  {
    name: 'Lane Shot',
    type: 'Platform',
    note: 'Designed for consistent session play, with a cleaner precision-based loop.'
  }
]
</script>