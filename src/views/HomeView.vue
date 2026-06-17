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

    <!-- Feature Links -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <router-link
        to="/arcade"
        class="group border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8 transition-colors hover:bg-[var(--color-surface-container-high)]"
      >
        <div class="mb-6 flex items-center gap-4">
          <span class="material-symbols-outlined scale-150 text-[var(--color-primary)]">sports_esports</span>
          <div>
            <h4 class="text-lg font-bold uppercase">Arcade</h4>
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">Play Games</p>
          </div>
        </div>
        <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Choose from multiple retro games and compete for the highest score.
        </p>
      </router-link>

      <router-link
        to="/leaderboard"
        class="group border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8 transition-colors hover:bg-[var(--color-surface-container-high)]"
      >
        <div class="mb-6 flex items-center gap-4">
          <span class="material-symbols-outlined scale-150 text-[var(--color-primary)]">leaderboard</span>
          <div>
            <h4 class="text-lg font-bold uppercase">Leaderboard</h4>
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">Rankings</p>
          </div>
        </div>
        <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]">
          See how you stack up against other players across every game mode.
        </p>
      </router-link>

      <router-link
        to="/settings"
        class="group border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8 transition-colors hover:bg-[var(--color-surface-container-high)]"
      >
        <div class="mb-6 flex items-center gap-4">
          <span class="material-symbols-outlined scale-150 text-[var(--color-primary)]">settings</span>
          <div>
            <h4 class="text-lg font-bold uppercase">Settings</h4>
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">Account</p>
          </div>
        </div>
        <p class="text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Manage your profile, password, and account preferences.
        </p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
