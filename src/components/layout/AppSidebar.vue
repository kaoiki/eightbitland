<template>
  <aside
    :class="[
      'z-50 h-full w-64 flex-col border-r bg-[var(--color-surface)] border-[rgba(66,73,78,0.2)]',
      isMobile
        ? [
            'fixed left-0 top-0 transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          ]
        : 'fixed left-0 top-0'
    ]"
  >
    <div class="p-8">
      <div class="mb-8 text-2xl font-black uppercase tracking-widest text-[var(--color-primary)]">
        WarioPulse
      </div>

      <!-- Logged In -->
      <div
        v-if="isLoggedIn"
        class="mb-8 bg-[var(--color-surface-container-low)] p-4"
      >
        <div class="mb-4 flex items-center gap-4">
          <img
            alt="Pixel Avatar"
            class="h-12 w-12 grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX6MVqZ_MVVLEnSf1QXRTqUhC4px9h-rxnnxy4YR2I-feP8kjZYjaNvDKO__q3fvhlYd23vFzaPARlstKpzC6r30dJCLfKTGFYh1Scx-LjqXBp3viYnsU3m4BjuwwhJyIz0rv1c1NkoXxBDO1z_cErJiF01R7GFCVo0kTyUd2Gm5XQhSAOB4sKqEATPSoWGusjFrsMsZBNT-DdrATBB6q-7IwDg7BiBCyKjf14HxPmv_BadzXkZajkzez_GMpPPDDdVDP-8t7Cipc"
          />
          <div>
            <p class="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
              Player One
            </p>
            <p class="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Level 42
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="handleLogout"
          class="w-full border border-[rgba(66,73,78,0.3)] bg-[var(--color-surface)] px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-300 transition hover:text-[var(--color-primary)]"
        >
          Logout
        </button>
      </div>

      <!-- Logged Out -->
      <div
        v-else
        class="mb-8 bg-[var(--color-surface-container-low)] p-4"
      >
        <p class="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">
          Access Portal
        </p>

        <div class="flex flex-col gap-3">
          <RouterLink
            to="/login"
            @click="handleNavClick"
            class="border border-[rgba(66,73,78,0.3)] bg-[var(--color-surface)] px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-300 transition hover:text-[var(--color-primary)]"
          >
            Login
          </RouterLink>

          <RouterLink
            to="/register"
            @click="handleNavClick"
            class="bg-[var(--color-primary)] px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-[var(--color-on-primary)] transition hover:brightness-110"
          >
            Register
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="no-scrollbar flex-1 overflow-y-auto px-4">
      <nav class="space-y-1">
        <!-- Top group -->
        <RouterLink
          v-for="item in primaryItems"
          :key="item.label"
          :to="item.to"
          @click="handleNavClick"
          class="flex w-full items-center gap-4 p-4 text-sm uppercase tracking-widest transition-colors"
          :class="
            isActive(item.to)
              ? 'border-l-4 border-[var(--color-primary)] bg-[var(--color-surface-container-highest)] text-[var(--color-primary)]'
              : 'text-slate-400 hover:bg-[var(--color-surface-container-low)] hover:text-white'
          "
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>

        <!-- Divider -->
        <div class="mx-4 my-4 h-px bg-[rgba(66,73,78,0.2)]"></div>

        <!-- Bottom group -->
        <RouterLink
          v-for="item in secondaryItems"
          :key="item.label"
          :to="item.to"
          @click="handleNavClick"
          class="flex w-full items-center gap-4 p-4 text-sm uppercase tracking-widest transition-colors"
          :class="
            isActive(item.to)
              ? 'border-l-4 border-[var(--color-primary)] bg-[var(--color-surface-container-highest)] text-[var(--color-primary)]'
              : 'text-slate-400 hover:bg-[var(--color-surface-container-low)] hover:text-white'
          "
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>

    <div class="p-8">
      <div class="border border-[rgba(66,73,78,0.3)] bg-[var(--color-surface-container-low)] px-4 py-2 text-center text-xs font-bold uppercase tracking-tight">
        {{ energyText }}
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  isMobile: boolean
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const router = useRouter()

// ========================
// 菜单
// ========================
const primaryItems = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'Leaderboard', icon: 'leaderboard', to: '/leaderboard' }
]

const secondaryItems = [
  { label: 'Arcade', icon: 'sports_esports', to: '/arcade' },
  { label: 'Battle', icon: 'swords', to: '/battle' },
  { label: 'Market', icon: 'storefront', to: '/market' },
  { label: 'Settings', icon: 'settings', to: '/settings' }
]

// ========================
// 登录状态（关键优化点）
// ========================
const loginStatus = ref(false)

// 初始化读取 localStorage
onMounted(() => {
  if (typeof window !== 'undefined') {
    loginStatus.value =
      window.localStorage.getItem('8bit_loginStatus') === 'true'
  }
})

// 给模板用
const isLoggedIn = computed(() => loginStatus.value)

// 底部 energy
const energyText = computed(() => {
  return isLoggedIn.value ? 'Energy: 99' : 'Login Required'
})

// ========================
// 行为
// ========================
function handleNavClick() {
  if (props.isMobile) {
    emit('close')
  }
}

// ⭐ 关键：logout 不再需要刷新页面
function handleLogout() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('8bit_loginStatus')
  }

  // 直接修改响应式状态
  loginStatus.value = false

  if (props.isMobile) {
    emit('close')
  }

  router.replace('/')
}

// 当前菜单高亮
function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>