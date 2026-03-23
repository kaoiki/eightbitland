<template>
  <div class="mb-4 flex w-full items-center justify-between">
    <h1 class="text-xl font-bold tracking-widest">
      <UDropdownMenu
        :items="dropdownItems"
        :content="{
          align: 'start',
          sideOffset: 8
        }"
        :ui="{
          content: 'z-[120] min-w-[260px] rounded-xl border border-green-400/40 bg-black/92 p-1 shadow-[0_0_24px_rgba(74,222,128,0.22)] backdrop-blur-md',
          viewport: 'p-0',
          group: 'p-0',
          item: 'rounded-lg px-3 py-2 text-green-300 transition-colors duration-150 data-[highlighted]:bg-green-400/15 data-[highlighted]:text-green-100 data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
          itemLabel: 'text-sm tracking-wide',
          itemLeadingIcon: 'text-green-400',
          itemTrailingIcon: 'text-green-400',
          separator: 'my-1 h-px bg-green-400/20'
        }"
      >
        <button
          type="button"
          class="flex min-w-[260px] items-center justify-between gap-3 border border-green-400 px-4 py-2 text-green-300 transition-all duration-150 hover:bg-green-400/10 hover:text-green-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
          :disabled="gameCount <= 1"
        >
          <span class="flex items-center gap-2">
            <UIcon name="i-mdi-controller" class="h-5 w-5 text-green-400" />
            <span class="text-xl font-bold tracking-widest">
              {{ gameMeta?.name || 'Retro Arcade' }}
            </span>
          </span>

          <UIcon
            name="i-heroicons-chevron-down-20-solid"
            class="h-4 w-4 text-green-400"
          />
        </button>
      </UDropdownMenu>
    </h1>

    <!-- 预留菜单 -->
    <button
      class="border border-green-400 px-2 py-1 text-sm text-green-300 transition-colors hover:bg-green-400/10 hover:text-green-200"
    >
      ≡
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  gameMeta: {
    type: Object,
    default: () => ({})
  },
  gameCount: {
    type: Number,
    default: 0
  },
  gameOptions: {
    type: Array,
    default: () => []
  },
  currentGameId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['switch-game'])

const dropdownItems = computed(() =>
  props.gameOptions.map((game) => ({
    label: game.label,
    disabled: game.id === props.currentGameId,
    onSelect: () => {
      console.log('[GameHeader] select game =', game.id)
      emit('switch-game', game.id)
    }
  }))
)
</script>