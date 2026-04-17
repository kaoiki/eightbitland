<template>
  <div class="space-y-8 lg:space-y-10">
    <!-- Header -->
    <section
      class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12"
    >
      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Player Archive
        </p>
        <h1
          class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl"
        >
          Achievements
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Track every unlock, every streak, and every badge lit on your competitive path.
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

    <!-- Filter -->
    <section class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-4 sm:p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

        <div class="flex items-center gap-3">
          <div class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
            Completion
          </div>
          <div class="min-w-[140px] flex-1">
            <UProgress :model-value="completionRate" />
          </div>
          <div class="text-xs font-black uppercase text-[var(--color-primary)]">
            {{ completionRate }}%
          </div>
        </div>
      </div>
    </section>

    <!-- Featured -->
    <section class="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <div class="space-y-8 xl:col-span-8">
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Highlight
              </p>
              <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
                Latest rare unlock
              </p>
            </div>

            <UBadge color="primary" variant="soft" class="uppercase tracking-[0.2em]">
              Rare
            </UBadge>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-[120px_1fr]">
            <div
              class="flex h-[120px] w-[120px] items-center justify-center border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)]"
            >
              <span class="material-symbols-outlined text-6xl text-[var(--color-primary)]">
                military_tech
              </span>
            </div>

            <div class="space-y-4">
              <h2 class="text-2xl font-black uppercase text-[var(--color-primary)]">
                PERFECT COMBO
              </h2>
              <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]">
                Chain 120 perfect hits in a single session without dropping rhythm.
              </p>

              <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div
                  v-for="meta in featuredMeta"
                  :key="meta.label"
                  class="border border-[rgba(66,73,78,0.14)] bg-[var(--color-surface-container-lowest)] p-4"
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
          </div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            v-for="item in filteredAchievements"
            :key="item.id"
            :class="[
              'group border p-6 transition',
              item.unlocked
                ? 'border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)]'
                : 'border-[rgba(66,73,78,0.14)] bg-[var(--color-surface-container-lowest)] opacity-75'
            ]"
          >
            <div class="mb-6 flex items-start justify-between gap-4">
              <div
                :class="[
                  'flex h-14 w-14 items-center justify-center border',
                  item.unlocked
                    ? 'border-[var(--color-primary)] bg-[rgba(255,255,255,0.02)]'
                    : 'border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)]'
                ]"
              >
                <span
                  :class="[
                    'material-symbols-outlined text-3xl',
                    item.unlocked
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-outline-variant)]'
                  ]"
                >
                  {{ item.icon }}
                </span>
              </div>

              <UBadge
                :color="item.unlocked ? 'primary' : 'neutral'"
                :variant="item.unlocked ? 'soft' : 'outline'"
                class="uppercase tracking-[0.2em]"
              >
                {{ item.unlocked ? 'Unlocked' : 'Locked' }}
              </UBadge>
            </div>

            <h3 class="text-lg font-black uppercase">
              {{ item.title }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
              {{ item.description }}
            </p>

            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                  Progress
                </span>
                <span class="text-xs font-black uppercase">
                  {{ item.progress }}%
                </span>
              </div>
              <UProgress :model-value="item.progress" />

              <div class="flex items-center justify-between pt-2">
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                  Reward
                </span>
                <span class="text-xs font-black uppercase text-[var(--color-primary)]">
                  {{ item.reward }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side -->
      <div class="space-y-8 xl:col-span-4">
        <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
          <h3 class="mb-8 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Streak Status
          </h3>

          <ul class="space-y-6">
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Daily Win</span>
              <span class="text-xs font-bold text-[var(--color-primary)]">7 DAYS</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Boss Clears</span>
              <span class="text-xs font-bold">14</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Perfect Runs</span>
              <span class="text-xs font-bold">03</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Next Unlock</span>
              <span class="text-xs font-bold">12%</span>
            </li>
          </ul>
        </div>

        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h3 class="mb-8 text-xs font-black uppercase tracking-[0.3em]">
            Milestone Path
          </h3>

          <div class="space-y-4">
            <div
              v-for="milestone in milestones"
              :key="milestone.label"
              class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-low)] p-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-black uppercase">
                    {{ milestone.label }}
                  </p>
                  <p class="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                    {{ milestone.description }}
                  </p>
                </div>

                <span
                  class="material-symbols-outlined text-xl"
                  :class="milestone.done ? 'text-[var(--color-primary)]' : 'text-[var(--color-outline-variant)]'"
                >
                  {{ milestone.done ? 'check_circle' : 'radio_button_unchecked' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type TabType = 'All' | 'Unlocked' | 'Locked' | 'Rare'

const activeTab = ref<TabType>('All')

const tabs: TabType[] = ['All', 'Unlocked', 'Locked', 'Rare']

const achievements = ref([
  {
    id: 'ACH-001',
    title: 'First Blood',
    description: 'Win your first match in any platform arena.',
    icon: 'sports_esports',
    unlocked: true,
    progress: 100,
    reward: '+100 Coins',
    rare: false
  },
  {
    id: 'ACH-002',
    title: 'Turbo Hands',
    description: 'Reach top 10% speed in a reaction-based game.',
    icon: 'bolt',
    unlocked: true,
    progress: 100,
    reward: '+1 Frame Skin',
    rare: true
  },
  {
    id: 'ACH-003',
    title: 'Untouchable',
    description: 'Clear a full round without taking damage.',
    icon: 'shield',
    unlocked: false,
    progress: 72,
    reward: '+250 Coins',
    rare: true
  },
  {
    id: 'ACH-004',
    title: 'Night Grind',
    description: 'Play 20 matches after midnight.',
    icon: 'dark_mode',
    unlocked: false,
    progress: 35,
    reward: '+80 Coins',
    rare: false
  },
  {
    id: 'ACH-005',
    title: 'Arena Habit',
    description: 'Log in and play for 7 consecutive days.',
    icon: 'calendar_month',
    unlocked: true,
    progress: 100,
    reward: '+120 Coins',
    rare: false
  },
  {
    id: 'ACH-006',
    title: 'Combo Hunter',
    description: 'Trigger a 50-hit combo in one run.',
    icon: 'flare',
    unlocked: false,
    progress: 88,
    reward: '+Title Badge',
    rare: true
  }
])

const filteredAchievements = computed(() => {
  if (activeTab.value === 'Unlocked') {
    return achievements.value.filter(item => item.unlocked)
  }
  if (activeTab.value === 'Locked') {
    return achievements.value.filter(item => !item.unlocked)
  }
  if (activeTab.value === 'Rare') {
    return achievements.value.filter(item => item.rare)
  }
  return achievements.value
})

const completionRate = computed(() => {
  const total = achievements.value.length
  const unlocked = achievements.value.filter(item => item.unlocked).length
  return Math.round((unlocked / total) * 100)
})

const overviewStats = computed(() => {
  const unlocked = achievements.value.filter(item => item.unlocked).length
  const locked = achievements.value.length - unlocked
  const rare = achievements.value.filter(item => item.rare).length

  return [
    { label: 'Unlocked', value: String(unlocked).padStart(2, '0') },
    { label: 'Locked', value: String(locked).padStart(2, '0') },
    { label: 'Rare', value: String(rare).padStart(2, '0') },
    { label: 'Rate', value: `${completionRate.value}%` }
  ]
})

const featuredMeta = [
  { label: 'Unlocked On', value: 'APR 06' },
  { label: 'Difficulty', value: 'S-TIER' },
  { label: 'Reward', value: '+500' },
  { label: 'Mode', value: 'RANKED' }
]

const milestones = [
  { label: 'Bronze Archive', description: 'Unlock 5 achievements', done: true },
  { label: 'Silver Archive', description: 'Unlock 10 achievements', done: false },
  { label: 'Gold Archive', description: 'Unlock all rare badges', done: false }
]
</script>