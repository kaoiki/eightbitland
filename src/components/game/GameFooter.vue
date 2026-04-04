<template>
  <div class="w-full mt-4 flex items-center justify-between gap-3">
    <div class="text-sm flex items-center gap-3">
      <span>Score: {{ score }}</span>
      <span>Best: {{ best }}</span>
    </div>

    <div class="flex gap-2">
      <button
        class="border border-green-400 px-3 py-1 text-sm hover:bg-green-400 hover:text-black"
        @click="$emit('start')"
      >
        Start
      </button>

      <button
        class="border border-green-400 px-3 py-1 text-sm hover:bg-green-400 hover:text-black"
        @click="$emit('reset')"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  score: {
    type: Number,
    default: 0
  },
  best: {
    type: Number,
    default: 0
  },
  gameState: {
    type: String,
    default: 'idle'
  }
})

defineEmits(['start', 'reset'])
</script>