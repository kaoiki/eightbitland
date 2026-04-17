<template>
  <div class="space-y-8 lg:space-y-10">
    <!-- Header -->
    <section
      class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12"
    >
      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Event Board
        </p>
        <h1
          class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl"
        >
          Activity
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Browse live tournaments, flash events, and squad challenges. Tap any item to inspect the full detail.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-px bg-[rgba(66,73,78,0.2)] lg:col-span-4">
        <div
          v-for="item in overviewStats"
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

    <!-- Tabs -->
    <section class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-4 sm:p-5">
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="tab in tabs"
          :key="tab"
          :variant="activeTab === tab ? 'solid' : 'outline'"
          color="primary"
          size="sm"
          class="uppercase tracking-[0.2em]"
          @click="activeTab = tab"
        >
          {{ tab }}
        </UButton>
      </div>
    </section>

    <!-- Content -->
    <section class="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <div class="space-y-6 xl:col-span-8">
        <div
          v-for="item in filteredActivities"
          :key="item.id"
          class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-6 transition hover:bg-[var(--color-surface-container-high)]"
        >
          <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div class="flex-1">
              <div class="mb-4 flex flex-wrap items-center gap-3">
                <UBadge
                  :color="badgeColor(item.status)"
                  variant="soft"
                  class="uppercase tracking-[0.2em]"
                >
                  {{ item.status }}
                </UBadge>

                <UBadge color="neutral" variant="outline" class="uppercase tracking-[0.2em]">
                  {{ item.type }}
                </UBadge>
              </div>

              <h2 class="text-xl font-black uppercase text-[var(--color-primary)]">
                {{ item.title }}
              </h2>

              <p class="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                {{ item.content }}
              </p>

              <div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div
                  v-for="meta in item.meta"
                  :key="meta.label"
                  class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-4"
                >
                  <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                    {{ meta.label }}
                  </p>
                  <p class="mt-2 text-sm font-black uppercase">
                    {{ meta.value }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex gap-3 md:flex-col">
              <UButton
                color="primary"
                class="uppercase tracking-[0.2em]"
                @click="openDetail(item)"
              >
                View Detail
              </UButton>

              <UButton
                variant="outline"
                color="primary"
                class="uppercase tracking-[0.2em]"
              >
                Join
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Side -->
      <div class="space-y-8 xl:col-span-4">
        <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
          <h3 class="mb-8 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Live Pulse
          </h3>

          <ul class="space-y-6">
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Open Events</span>
              <span class="text-xs font-bold text-[var(--color-primary)]">{{ liveCount }}</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Total Players</span>
              <span class="text-xs font-bold">{{ totalParticipants }}</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Nearest Start</span>
              <span class="text-xs font-bold">09 MIN</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Reward Pool</span>
              <span class="text-xs font-bold">12,800</span>
            </li>
          </ul>
        </div>

        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h3 class="mb-8 text-xs font-black uppercase tracking-[0.3em]">
            Quick Feed
          </h3>

          <div class="space-y-4">
            <div
              v-for="feed in feedList"
              :key="feed.id"
              class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-low)] p-4"
            >
              <p class="text-xs font-black uppercase">
                {{ feed.title }}
              </p>
              <p class="mt-2 text-[11px] leading-5 text-[var(--color-on-surface-variant)]">
                {{ feed.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detail Modal -->
    <div
      v-if="detailOpen"
      class="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
      @click.self="closeDetail"
    >
      <div
        class="w-full max-w-2xl border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface)] shadow-2xl"
      >
        <div class="border-b border-[rgba(66,73,78,0.2)] p-6 sm:p-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-[var(--color-secondary)]">
                Activity Detail
              </p>
              <h3 class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">
                {{ selectedActivity?.title || 'Untitled Event' }}
              </h3>
            </div>

            <UButton
              color="primary"
              variant="ghost"
              icon="i-lucide-x"
              @click="closeDetail"
            />
          </div>
        </div>

        <div class="space-y-6 p-6 sm:p-8">
          <div class="flex flex-wrap gap-2">
            <UBadge color="primary" variant="soft" class="uppercase tracking-[0.2em]">
              {{ selectedActivity?.status || 'Live' }}
            </UBadge>
            <UBadge color="neutral" variant="outline" class="uppercase tracking-[0.2em]">
              {{ selectedActivity?.type || 'Event' }}
            </UBadge>
          </div>

          <div class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-5">
            <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
              Content
            </p>
            <p class="mt-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
              {{ detailContent }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-5">
              <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Participants
              </p>
              <p class="mt-2 text-lg font-black uppercase text-[var(--color-primary)]">
                {{ selectedActivity?.participants ?? 24 }}
              </p>
            </div>

            <div class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-5">
              <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Start
              </p>
              <p class="mt-2 text-lg font-black uppercase">
                {{ selectedActivity?.startAt || '20:30' }}
              </p>
            </div>

            <div class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-5">
              <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Reward
              </p>
              <p class="mt-2 text-lg font-black uppercase">
                {{ selectedActivity?.reward || '800 Coins' }}
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <UButton
                color="primary"
                class="uppercase tracking-[0.2em]"
            >
                Join
            </UButton>
            <UButton color="primary" class="uppercase tracking-[0.2em]" variant="outline" @click="closeDetail">
              Close
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type TabType = 'All' | 'Live' | 'Upcoming' | 'Ended'

type ActivityItem = {
  id: string
  title: string
  content: string
  participants: number
  status: 'Live' | 'Upcoming' | 'Ended'
  type: 'Tournament' | 'Challenge' | 'Event'
  startAt: string
  reward: string
  meta: { label: string; value: string }[]
}

const tabs: TabType[] = ['All', 'Live', 'Upcoming', 'Ended']
const activeTab = ref<TabType>('All')

const activities = ref<ActivityItem[]>([
  {
    id: 'ACT-001',
    title: 'Night Rush Cup',
    content:
      'A fast-entry elimination cup for reflex games. Top players clear three rounds and split the coin pool.',
    participants: 124,
    status: 'Live',
    type: 'Tournament',
    startAt: 'NOW',
    reward: '3,000 Coins',
    meta: [
      { label: 'Mode', value: '1V1' },
      { label: 'Rounds', value: '03' },
      { label: 'Entry', value: 'Free' },
      { label: 'Pool', value: '3000' }
    ]
  },
  {
    id: 'ACT-002',
    title: 'Combo Frenzy Weekend',
    content:
      'Land the highest combo before the timer ends. The top 20 players receive exclusive reward crates.',
    participants: 342,
    status: 'Upcoming',
    type: 'Challenge',
    startAt: '21:30',
    reward: 'Crate x20',
    meta: [
      { label: 'Mode', value: 'Solo' },
      { label: 'Window', value: '2H' },
      { label: 'Entry', value: '50' },
      { label: 'Pool', value: 'Crates' }
    ]
  },
  {
    id: 'ACT-003',
    title: 'Arcade Team Raid',
    content:
      'Squad up and clear rotating stages together. Participation score contributes to faction ranking.',
    participants: 89,
    status: 'Live',
    type: 'Event',
    startAt: 'NOW',
    reward: 'Faction XP',
    meta: [
      { label: 'Mode', value: 'Squad' },
      { label: 'Map', value: 'Rift' },
      { label: 'Entry', value: 'Free' },
      { label: 'Pool', value: 'XP' }
    ]
  },
  {
    id: 'ACT-004',
    title: 'Retro Dodge Sprint',
    content:
      'Sprint through neon lanes, dodge every impact, and race for the cleanest finish before the timer closes.',
    participants: 58,
    status: 'Ended',
    type: 'Challenge',
    startAt: 'DONE',
    reward: 'Claim Closed',
    meta: [
      { label: 'Mode', value: 'Solo' },
      { label: 'Window', value: '30M' },
      { label: 'Entry', value: 'Free' },
      { label: 'Pool', value: 'Closed' }
    ]
  }
])

const filteredActivities = computed(() => {
  if (activeTab.value === 'All') return activities.value
  return activities.value.filter(item => item.status === activeTab.value)
})

const liveCount = computed(() => activities.value.filter(item => item.status === 'Live').length)
const totalParticipants = computed(() => activities.value.reduce((sum, item) => sum + item.participants, 0))

const overviewStats = computed(() => [
  { label: 'Live', value: String(liveCount.value).padStart(2, '0') },
  { label: 'Upcoming', value: String(activities.value.filter(i => i.status === 'Upcoming').length).padStart(2, '0') },
  { label: 'Ended', value: String(activities.value.filter(i => i.status === 'Ended').length).padStart(2, '0') },
  { label: 'Players', value: String(totalParticipants.value) }
])

const feedList = [
  { id: 'FD-1', title: 'Squad Raid Opened', text: 'Team queue is now accepting new players.' },
  { id: 'FD-2', title: 'Cup Round Started', text: 'Round 1 of Night Rush Cup is already live.' },
  { id: 'FD-3', title: 'Reward Claimed', text: 'Weekend ladder rewards were sent to inbox.' }
]

const detailOpen = ref(false)
const selectedActivity = ref<ActivityItem | null>(null)

const detailContent = computed(() => {
  return (
    selectedActivity.value?.content ||
    'A high-speed community event is live. Join the queue, complete the challenge, and compete for coins, ranking points, and limited event rewards.'
  )
})

function openDetail(item: ActivityItem) {
  selectedActivity.value = item
  detailOpen.value = true
}

function closeDetail() {
  detailOpen.value = false
}

function badgeColor(status: ActivityItem['status']) {
  if (status === 'Live') return 'success'
  if (status === 'Upcoming') return 'warning'
  return 'neutral'
}
</script>