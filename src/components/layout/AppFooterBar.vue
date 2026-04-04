<template>
  <footer class="relative z-30 border-t border-[rgba(66,73,78,0.2)] bg-[var(--color-surface)] px-4 py-4 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
      <div class="text-[10px] uppercase tracking-[0.2em] text-slate-500">
        System Status: <span class="text-[var(--color-primary)]">Online</span> | Latency: 22ms | v1.4.2
      </div>

      <div class="flex flex-wrap justify-center gap-6 md:justify-end">
        <a
          href="#"
          class="text-[10px] uppercase tracking-[0.2em] text-slate-600 transition-colors hover:text-[var(--color-primary)]"
        >
          Global Stats
        </a>
        <a
          href="#"
          class="text-[10px] uppercase tracking-[0.2em] text-slate-600 transition-colors hover:text-[var(--color-primary)]"
        >
          Help Center
        </a>
        <a
          href="#"
          class="text-[10px] uppercase tracking-[0.2em] text-slate-600 transition-colors hover:text-[var(--color-primary)]"
        >
          Patch Notes
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>