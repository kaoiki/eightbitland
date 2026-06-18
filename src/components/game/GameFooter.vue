<template>
  <div class="w-full mt-4 flex items-center justify-between gap-2">
    <div class="text-sm flex items-center gap-3">
      <span>Score: {{ score }}</span>
      <span>Best: {{ best }}</span>
    </div>

    <div class="flex gap-1.5 sm:gap-2">
      <button
        class="border border-green-400 px-2 sm:px-3 py-1 text-sm hover:bg-green-400 hover:text-black disabled:opacity-50"
        :disabled="sending"
        @click="submitFeedback('like')"
      >
        Like
      </button>

      <button
        class="border border-green-400 px-2 sm:px-3 py-1 text-sm hover:bg-green-400 hover:text-black disabled:opacity-50"
        :disabled="sending"
        @click="submitFeedback('dislike')"
      >
        Dislike
      </button>

      <div class="mx-0.5 self-stretch w-px bg-green-500/20"></div>

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
import { request } from '../../utils/request'
import { useToast } from '@nuxt/ui/composables'

const props = defineProps({
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
  },
  gameId: {
    type: String,
    default: ''
  }
})

defineEmits(['start', 'reset'])

const toast = useToast()
const sending = ref(false)

async function submitFeedback(type) {
  if (!props.gameId || sending.value) return

  sending.value = true
  try {
    await request.post('game-feedback', {
      game_id: props.gameId,
      type: type
    })
    toast.add({
      title: type === 'like' ? 'Thanks!' : 'Noted!',
      description: type === 'like' ? 'Glad you enjoy this game.' : "We'll take a look.",
      icon: type === 'like' ? 'i-lucide-smile' : 'i-lucide-frown',
      color: 'success',
      progress: false
    })
  } catch {
    // 静默失败
  } finally {
    sending.value = false
  }
}
</script>