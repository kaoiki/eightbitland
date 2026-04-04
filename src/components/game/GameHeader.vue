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
          <span class="flex min-w-0 items-center gap-2">
            <UIcon name="i-mdi-controller" class="h-5 w-5 shrink-0 text-green-400" />

            <span class="flex min-w-0 items-center gap-2">
              <span class="truncate text-xl font-bold tracking-widest">
                {{ gameMeta?.name || 'Retro Arcade' }}
              </span>

              <span
                v-if="gameMeta?.source"
                class="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide ring-1"
                :class="sourceBadgeClass"
              >
                <UIcon :name="sourceIcon" class="h-3 w-3" />
                <span>{{ sourceLabel }}</span>
              </span>
            </span>
          </span>

          <UIcon
            name="i-heroicons-chevron-down-20-solid"
            class="h-4 w-4 text-green-400"
          />
        </button>
      </UDropdownMenu>
    </h1>

    <!-- 返回菜单 -->
    <button
      @click="router.push('/')"
      class="flex h-[42px] w-[42px] items-center justify-center border border-green-400 text-green-300 transition-all duration-150 hover:bg-green-400/10 hover:text-green-200 active:scale-90"
    >
      <span class="text-xl font-bold leading-none">←</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

function getSourceMeta(source) {
  if (source === 'external') {
    return {
      label: 'External',
      icon: 'i-mdi-puzzle-outline',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 ring-cyan-400/30'
    }
  }

  return {
    label: 'Platform',
    icon: 'i-mdi-controller-classic',
    badgeClass: 'bg-lime-500/15 text-lime-300 ring-lime-400/30'
  }
}

const sourceMeta = computed(() => getSourceMeta(props.gameMeta?.source))
const sourceLabel = computed(() => sourceMeta.value.label)
const sourceIcon = computed(() => sourceMeta.value.icon)
const sourceBadgeClass = computed(() => sourceMeta.value.badgeClass)

const dropdownItems = computed(() =>
  props.gameOptions.map((game) => {
    const meta = getSourceMeta(game.source)

    return {
      label: `${meta.label} · ${game.label}`,
      icon: meta.icon,
      disabled: game.id === props.currentGameId,
      onSelect: () => {
        if (game.id === props.currentGameId) return
        console.log('[GameHeader] select game =', game.id)
        emit('switch-game', game.id)
      }
    }
  })
)
</script>