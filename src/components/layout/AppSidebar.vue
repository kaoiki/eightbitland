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
          <!-- 202404161851 给img的src赋值 -->
          <img
            alt="Pixel Avatar"
            class="h-12 w-12 grayscale"
            :src="avatar"
          />
          <div>
            <p class="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
              <!-- 202404161851 给用户名赋值 -->
              {{nickname}}
            </p>
            <p class="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <!-- 202404161851 默认level为0 -->
              Level 0
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
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="rounded-sm border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]"
          >
            {{ item.badge }}
          </span>
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
  { label: 'Leaderboard', icon: 'leaderboard', to: '/leaderboard' },
  { label: 'Achievement', icon: 'emoji_events', to: '/achievement' },//202604091703 配置菜单
]

const secondaryItems = [
  { label: 'Arcade', icon: 'sports_esports', to: '/arcade' },
  { label: 'Battle', icon: 'swords', to: '/battle', badge: 'Soon' },
  { label: 'Activity', icon: 'local_activity', to: '/activity', badge: 'Soon' },
  { label: 'Shop', icon: 'store', to: '/shop', badge: 'Soon' },
  { label: 'Market', icon: 'storefront', to: '/market', badge: 'Soon' },
  { label: 'Settings', icon: 'settings', to: '/settings' }
]

// ========================
// 登录状态（关键优化点）
// ========================
const loginStatus = ref(false)


const avatar = ref('') // 202404161851 用户头像
const nickname = ref('') // 202404161851 用户昵称

// 初始化读取 localStorage
onMounted(() => {
  if (typeof window !== 'undefined') {
    loginStatus.value = window.localStorage.getItem('8bit_loginStatus') === 'true'

    const infoRaw = localStorage.getItem('8bit_login_info')
    if (infoRaw) {
      try {
        const info = JSON.parse(infoRaw)
        avatar.value = info.avatar || ''
        nickname.value = info.nickname || ''
      } catch {
        // JSON 解析失败，保持默认空值
      }
    }
  }
})

// 给模板用
const isLoggedIn = computed(() => loginStatus.value)

// 底部 energy
const energyText = computed(() => {
  // 202404161851 将Energy 99 改为 Energy 0
  return isLoggedIn.value ? 'Energy: 0' : 'Login Required'
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
    window.localStorage.removeItem('8bit_login_info') //202404161851 清除登录时存储的信息
    window.localStorage.removeItem('8bit_token') //202404161851 清除token
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