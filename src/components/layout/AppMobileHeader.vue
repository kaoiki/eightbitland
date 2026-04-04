<template>
  <header class="flex items-center justify-between border-b border-[rgba(66,73,78,0.2)] bg-[var(--color-surface)] px-4 py-4 lg:hidden">
    <div class="text-lg font-black uppercase tracking-widest text-[var(--color-primary)]">
      WarioPulse
    </div>

    <button
      type="button"
      class="inline-flex h-11 w-11 items-center justify-center border border-[rgba(66,73,78,0.3)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] transition hover:bg-[var(--color-surface-container-high)]"
      @click="$emit('toggle-menu')"
      aria-label="Toggle navigation"
    >
      <span class="material-symbols-outlined text-[22px]">
        {{ menuOpen ? 'close' : 'menu' }}
      </span>
    </button>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  menuOpen: boolean
}>()

defineEmits<{
  (e: 'toggle-menu'): void
}>()
</script>