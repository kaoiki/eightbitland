<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <div class="max-w-xl text-center">
      <div class="mb-8 flex justify-center">
        <div class="flex h-24 w-24 items-center justify-center border-2 border-[rgba(66,73,78,0.3)] bg-[var(--color-surface-container-low)]">
          <span class="material-symbols-outlined text-5xl text-[var(--color-primary)]">local_activity</span>
        </div>
      </div>

      <h1 class="mb-4 text-3xl font-black uppercase tracking-tight text-[var(--color-primary)] sm:text-4xl">
        Activity
      </h1>

      <p class="mb-6 text-sm leading-6 text-[var(--color-on-surface-variant)]">
        Track your play history, daily streaks, event participation, and all your recent achievements across every game mode.
        A full activity feed is in development.
      </p>

      <div class="inline-flex items-center gap-2 border border-[var(--color-primary)] bg-[var(--color-primary)]/5 px-6 py-3">
        <span class="material-symbols-outlined text-sm text-[var(--color-primary)]">construction</span>
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">
          Coming Soon
        </span>
      </div>

      <div class="mt-12 border-t border-[rgba(66,73,78,0.12)] pt-8">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[var(--color-outline-variant)]">
          MVP Roadmap · Phase 2
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
