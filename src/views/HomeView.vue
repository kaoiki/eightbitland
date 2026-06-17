<template>
  <div class="space-y-12 lg:space-y-20">
    <!-- Hero -->
    <section class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] md:grid-cols-12">
      <div class="relative flex items-center justify-center bg-[var(--color-surface-container-lowest)] p-12 md:col-span-7 md:p-16">
        <div class="text-center">
          <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
            Retro Arcade, Reimagined
          </p>
          <h1 class="text-5xl font-black uppercase leading-none tracking-tighter text-[var(--color-primary)] sm:text-6xl md:text-7xl">
            EightBit<br />Land
          </h1>
        </div>
      </div>

      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 md:col-span-5 md:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Your Arcade Hub
        </p>
        <h3 class="mb-6 text-2xl font-bold uppercase leading-tight">
          Play. Compete. Rise.
        </h3>
        <p class="mb-8 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Jump into fast-paced retro games, climb the leaderboard, and track your progress — all in one place.
        </p>
        <router-link
          to="/arcade"
          class="block w-full bg-[var(--color-primary)] py-4 text-center font-black uppercase tracking-widest text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-0.5"
        >
          Enter Arcade
        </router-link>
      </div>
    </section>

    <!-- Live Features -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <router-link
        v-for="item in liveFeatures"
        :key="item.to"
        :to="item.to"
        class="group border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8 transition-colors hover:bg-[var(--color-surface-container-high)]"
      >
        <div class="mb-6 flex items-center gap-4">
          <span class="material-symbols-outlined scale-150 text-[var(--color-primary)]">{{ item.icon }}</span>
          <div>
            <div class="flex items-center gap-3">
              <h4 class="text-lg font-bold uppercase">{{ item.label }}</h4>
              <span class="rounded-sm border border-green-500/30 bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 leading-none">Live</span>
            </div>
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">{{ item.subtitle }}</p>
          </div>
        </div>
        <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]">{{ item.desc }}</p>
      </router-link>
    </div>

    <!-- Divider -->
    <div class="flex items-center gap-4">
      <div class="h-px flex-1 bg-[rgba(66,73,78,0.2)]"></div>
      <span class="shrink-0 text-[10px] uppercase tracking-[0.3em] text-[var(--color-outline-variant)]">
        MVP Roadmap · Phase 2
      </span>
      <div class="h-px flex-1 bg-[rgba(66,73,78,0.2)]"></div>
    </div>

    <!-- Coming Soon -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div
        v-for="item in soonFeatures"
        :key="item.to"
        class="border border-[rgba(66,73,78,0.12)] bg-[var(--color-surface-container-lowest)] p-8 opacity-75"
      >
        <div class="mb-6 flex items-center gap-4">
          <span class="material-symbols-outlined scale-150 text-[var(--color-outline-variant)]">{{ item.icon }}</span>
          <div>
            <div class="flex items-center gap-3">
              <h4 class="text-lg font-bold uppercase text-[var(--color-outline-variant)]">{{ item.label }}</h4>
              <span class="rounded-sm border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] leading-none">Soon</span>
            </div>
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--color-outline-variant)]/60">{{ item.subtitle }}</p>
          </div>
        </div>
        <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]/60">{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const liveFeatures = [
  {
    label: 'Arcade',
    subtitle: 'Play Games',
    icon: 'sports_esports',
    to: '/arcade',
    desc: 'Choose from multiple retro games and compete for the highest score.'
  },
  {
    label: 'Leaderboard',
    subtitle: 'Rankings',
    icon: 'leaderboard',
    to: '/leaderboard',
    desc: 'See how you stack up against other players across every game mode.'
  },
  {
    label: 'Settings',
    subtitle: 'Account',
    icon: 'settings',
    to: '/settings',
    desc: 'Manage your profile, password, and account preferences.'
  }
]

const soonFeatures = [
  {
    label: 'Achievement',
    subtitle: 'Badges & Rewards',
    icon: 'emoji_events',
    to: '/achievement',
    desc: 'Track every unlock, every streak, and every badge lit on your competitive path.'
  },
  {
    label: 'Battle',
    subtitle: 'Real-time PvP',
    icon: 'swords',
    to: '/battle',
    desc: 'Invite friends and compete in live head-to-head arcade clashes.'
  },
  {
    label: 'Activity',
    subtitle: 'Play History',
    icon: 'local_activity',
    to: '/activity',
    desc: 'Review your play history, daily streaks, and event participation.'
  },
  {
    label: 'Shop',
    subtitle: 'Cosmetics & Items',
    icon: 'store',
    to: '/shop',
    desc: 'Browse exclusive cosmetics, frame skins, and power-ups.'
  },
  {
    label: 'Market',
    subtitle: 'Player Trading',
    icon: 'storefront',
    to: '/market',
    desc: 'A peer-to-peer marketplace for trading items and collectibles.'
  }
]
</script>
