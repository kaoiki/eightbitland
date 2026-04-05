<template>
  <div class="space-y-8 lg:space-y-10">
    <!-- Header -->
    <section class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12">
      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Battle Mode
        </p>
        <h1 class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl">
          ClickRush Battle
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Invite friends, open a room, or jump into a live competitive session built for short, fast arcade clashes.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-px bg-[rgba(66,73,78,0.2)] lg:col-span-4">
        <div
          v-for="item in battleStats"
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

    <!-- Mode Tabs -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-3 lg:col-span-9">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="mode in battleModes"
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
            Match State
          </span>
          <span class="text-xs font-bold uppercase text-[var(--color-primary)]">
            Live Queue
          </span>
        </div>
      </div>
    </section>

    <!-- Main -->
    <section class="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <!-- Left -->
      <div class="space-y-8 xl:col-span-8">
        <!-- Create Room -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h2 class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Create Battle Room
              </h2>
              <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
                Open a room and invite another player into a direct match
              </p>
            </div>

            <span class="bg-[var(--color-surface-container-low)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-secondary)]">
              {{ activeMode }}
            </span>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label class="space-y-2">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Room Name
              </span>
              <input
                v-model="roomForm.roomName"
                type="text"
                placeholder="ClickRush Duel Room"
                class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </label>

            <label class="space-y-2">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Invite Code
              </span>
              <input
                v-model="roomForm.inviteCode"
                type="text"
                placeholder="AUTO / CUSTOM"
                class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </label>

            <label class="space-y-2">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Match Type
              </span>
              <select
                v-model="roomForm.matchType"
                class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
              >
                <option>1v1 Duel</option>
                <option>Score Race</option>
                <option>Reaction Sprint</option>
              </select>
            </label>

            <label class="space-y-2">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Round Length
              </span>
              <select
                v-model="roomForm.roundLength"
                class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
              >
                <option>30 Seconds</option>
                <option>60 Seconds</option>
                <option>90 Seconds</option>
              </select>
            </label>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              class="bg-[var(--color-primary)] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-0.5"
            >
              Create Room
            </button>

            <button
              class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-[var(--color-surface-container-high)]"
            >
              Copy Invite
            </button>

            <button
              class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-[var(--color-surface-container-high)]"
            >
              Quick Match
            </button>
          </div>
        </div>

        <!-- Open Rooms -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)]">
          <div class="grid grid-cols-12 border-b border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)] px-4 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-outline-variant)] sm:px-6">
            <div class="col-span-5 sm:col-span-4">Room</div>
            <div class="hidden sm:block sm:col-span-2">Mode</div>
            <div class="col-span-3 sm:col-span-2">Host</div>
            <div class="col-span-2 sm:col-span-2 text-right">Status</div>
            <div class="col-span-2 text-right">Action</div>
          </div>

          <div
            v-for="room in openRooms"
            :key="room.id"
            class="grid grid-cols-12 items-center border-b border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container)] px-4 py-4 transition-colors hover:bg-[var(--color-surface-container-high)] sm:px-6"
          >
            <div class="col-span-5 sm:col-span-4">
              <p class="truncate text-sm font-bold uppercase">
                {{ room.name }}
              </p>
              <p class="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                {{ room.code }}
              </p>
            </div>

            <div class="hidden sm:block sm:col-span-2">
              <p class="text-xs uppercase text-[var(--color-on-surface-variant)]">
                {{ room.mode }}
              </p>
            </div>

            <div class="col-span-3 sm:col-span-2">
              <p class="truncate text-xs font-bold uppercase">
                {{ room.host }}
              </p>
            </div>

            <div class="col-span-2 sm:col-span-2 text-right">
              <span
                :class="[
                  'inline-block px-2 py-1 text-[10px] font-black uppercase tracking-[0.15em]',
                  room.status === 'Waiting'
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'bg-[var(--color-surface-container-lowest)] text-[var(--color-secondary)]'
                ]"
              >
                {{ room.status }}
              </span>
            </div>

            <div class="col-span-2 text-right">
              <button
                class="bg-[var(--color-primary)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <!-- Battle Feed -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <div class="mb-6">
            <h2 class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Live Battle Feed
            </h2>
            <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
              Recent battle events across active rooms
            </p>
          </div>

          <div class="space-y-4">
            <div
              v-for="feed in battleFeed"
              :key="feed.id"
              class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-low)] p-4"
            >
              <div class="flex items-center justify-between gap-4">
                <p class="text-sm font-bold uppercase">
                  {{ feed.title }}
                </p>
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                  {{ feed.time }}
                </span>
              </div>
              <p class="mt-2 text-xs leading-5 text-[var(--color-on-surface-variant)]">
                {{ feed.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="space-y-8 xl:col-span-4">
        <!-- Quick Panel -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Quick Actions
          </h2>

          <div class="space-y-4">
            <button
              class="w-full bg-[var(--color-primary)] px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110"
            >
              Start Quick Match
            </button>
            <button
              class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)] px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-[var(--color-surface-container-high)]"
            >
              Invite Friend
            </button>
            <button
              class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)] px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-[var(--color-surface-container-high)]"
            >
              View History
            </button>
          </div>
        </div>

        <!-- Status -->
        <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
          <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Arena Status
          </h2>

          <ul class="space-y-5">
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Online Players</span>
              <span class="text-xs font-bold uppercase">128</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Open Rooms</span>
              <span class="text-xs font-bold uppercase">14</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Battle Type</span>
              <span class="text-xs font-bold uppercase text-[var(--color-primary)]">1v1</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Queue Health</span>
              <span class="text-xs font-bold uppercase">Stable</span>
            </li>
          </ul>
        </div>

        <!-- Featured Match -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h2 class="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Featured Match
          </h2>

          <div class="space-y-4 bg-[var(--color-surface-container-low)] p-5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Mode
              </span>
              <span class="text-xs font-bold uppercase">
                ClickRush Duel
              </span>
            </div>

            <div class="grid grid-cols-3 items-center gap-3 text-center">
              <div>
                <p class="text-sm font-black uppercase text-[var(--color-primary)]">Nova</p>
                <p class="mt-1 text-[10px] uppercase tracking-[0.15em] text-[var(--color-outline-variant)]">
                  Challenger
                </p>
              </div>

              <div class="text-xs font-black uppercase text-[var(--color-secondary)]">
                VS
              </div>

              <div>
                <p class="text-sm font-black uppercase text-[var(--color-primary)]">Pixel</p>
                <p class="mt-1 text-[10px] uppercase tracking-[0.15em] text-[var(--color-outline-variant)]">
                  Defender
                </p>
              </div>
            </div>

            <button
              class="w-full bg-[var(--color-primary)] px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110"
            >
              Spectate
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const battleModes = ['1v1', 'Ranked', 'Custom']
const activeMode = ref('1v1')

const battleStats = [
  { label: 'Open Rooms', value: '14' },
  { label: 'Online', value: '128' },
  { label: 'Mode', value: 'Duel' },
  { label: 'Status', value: 'Live' }
]

const roomForm = reactive({
  roomName: '',
  inviteCode: '',
  matchType: '1v1 Duel',
  roundLength: '60 Seconds'
})

const openRooms = [
  {
    id: 1,
    name: 'Rush Room Alpha',
    code: 'CR-AX12',
    mode: '1v1 Duel',
    host: 'Vortex',
    status: 'Waiting'
  },
  {
    id: 2,
    name: 'Reaction Lab',
    code: 'CR-BQ48',
    mode: 'Score Race',
    host: 'Neon',
    status: 'Waiting'
  },
  {
    id: 3,
    name: 'Fast Tap Arena',
    code: 'CR-DM77',
    mode: 'Reaction Sprint',
    host: 'ZeroLag',
    status: 'Live'
  },
  {
    id: 4,
    name: 'Click Clash',
    code: 'CR-KP91',
    mode: '1v1 Duel',
    host: 'RetroFox',
    status: 'Waiting'
  }
]

const battleFeed = [
  {
    id: 1,
    title: 'Nova defeated ByteKid',
    description: 'A sharp finish in the last seconds pushed Nova ahead by a narrow score margin.',
    time: '2m ago'
  },
  {
    id: 2,
    title: 'New room opened: Click Clash',
    description: 'A custom duel room is now open for direct invitation battles.',
    time: '5m ago'
  },
  {
    id: 3,
    title: 'Pixel reached a 7-win streak',
    description: 'An active ranked streak is drawing attention across the current live rooms.',
    time: '9m ago'
  }
]
</script>