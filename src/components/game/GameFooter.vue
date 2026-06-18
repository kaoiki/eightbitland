<template>
  <div class="w-full mt-4 flex items-center justify-between gap-2">
    <div class="text-sm flex items-center gap-3">
      <span>Score: {{ score }}</span>
      <span>Best: {{ best }}</span>
    </div>

    <div class="flex items-center gap-1.5">
      <button
        class="flex h-7 w-7 items-center justify-center border border-green-500/30 text-sm text-green-500/50 transition hover:border-green-400 hover:text-green-300"
        :class="{ 'border-green-400 text-green-300': liked }"
        @click="toggleLike"
        title="Like"
      >
        <span class="material-symbols-outlined text-sm">thumb_up</span>
      </button>

      <button
        class="flex h-7 w-7 items-center justify-center border border-green-500/30 text-sm text-green-500/50 transition hover:border-green-400 hover:text-green-300"
        :class="{ 'border-green-400 text-green-300': disliked }"
        @click="toggleDislike"
        title="Dislike"
      >
        <span class="material-symbols-outlined text-sm">thumb_down</span>
      </button>

      <div class="mx-1 h-5 w-px bg-green-500/20"></div>

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
import { ref } from 'vue'

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

const liked = ref(false)
const disliked = ref(false)

function toggleLike() {
  liked.value = !liked.value
}

function toggleDislike() {
  disliked.value = !disliked.value
}
</script>