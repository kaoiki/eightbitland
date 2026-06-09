<template>
  <div>
    <!-- Not Login -->
    <div v-if="!isLogin" class="flex min-h-[70vh] items-center justify-center">
      <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] px-10 py-12 text-center">
        <p class="text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Control Panel
        </p>
        <h1 class="mt-4 text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl">
          Access Denied
        </h1>
        <p class="mt-4 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Please login first to access settings.
        </p>

        <button
          class="mt-8 bg-[var(--color-primary)] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-0.5"
          @click="goLogin"
        >
          Go Login
        </button>
      </div>
    </div>

    <!-- Login -->
    <div v-else class="space-y-8 lg:space-y-10">
      <!-- Header -->
      <section class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12">
        <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
          <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
            Control Panel
          </p>
          <h1 class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl">
            Settings
          </h1>
          <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
            Manage your account, password, preferences, and security from one place.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-px bg-[rgba(66,73,78,0.2)] lg:col-span-4">
          <div
            v-for="item in overviewStats"
            :key="item.label"
            class="bg-[var(--color-surface-container-lowest)] p-6"
          >
            <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
              {{ item.label }}
            </p>
            <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">
              {{ item.value }}
            </p>
          </div>
        </div>
      </section>

      <!-- Main -->
      <section class="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <!-- Left -->
        <div class="space-y-8 xl:col-span-8">
          <!-- Profile -->
          <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
            <div class="mb-8 flex items-center justify-between">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                  Profile
                </p>
                <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
                  Public account information
                </p>
              </div>
              <button
                class="bg-[var(--color-primary)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-0.5 disabled:opacity-50"
                :disabled="profileSaving"
                @click="saveProfile"
              >
                {{ profileSaving ? 'Saving...' : 'Save' }}
              </button>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label class="space-y-2">
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                  Nickname
                </span>
                <input
                  v-model="profile.nickname"
                  type="text"
                  class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>

              <label class="space-y-2">
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                  Email
                </span>
                <div class="flex items-center gap-2">
                  <input
                    :value="profile.email"
                    type="email"
                    readonly
                    class="w-full cursor-not-allowed border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm text-[var(--color-on-surface-variant)] outline-none opacity-60"
                  />
                  <span class="material-symbols-outlined text-sm text-green-500">verified</span>
                </div>
              </label>

              <label class="space-y-2 md:col-span-2">
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                  Bio
                </span>
                <textarea
                  v-model="profile.bio"
                  rows="4"
                  class="w-full resize-none border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>
            </div>
          </div>

          <!-- Change Password -->
          <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
            <div class="mb-8">
              <p class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Change Password
              </p>
              <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
                Update your credentials regularly for better security
              </p>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <label class="space-y-2">
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                  Current Password
                </span>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>

              <label class="space-y-2">
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                  New Password
                </span>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>

              <label class="space-y-2">
                <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                  Confirm Password
                </span>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>

              <div class="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(66,73,78,0.2)] pt-6">
                <p class="text-xs text-[var(--color-on-surface-variant)]">
                  Password must be at least 8 characters.
                </p>
                <button
                  class="bg-[var(--color-primary)] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-0.5 disabled:opacity-50"
                  :disabled="passwordUpdating"
                  @click="updatePassword"
                >
                  {{ passwordUpdating ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Linked Accounts -->
          <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
            <div class="mb-8">
              <p class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Linked Accounts
              </p>
              <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
                Connect your social accounts for easy login
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-[rgba(66,73,78,0.12)] pb-4">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-lg text-[var(--color-outline)]">login</span>
                  <div>
                    <p class="text-sm font-bold uppercase">Google</p>
                    <p class="mt-0.5 text-xs text-[var(--color-on-surface-variant)]">Sign in with Google</p>
                  </div>
                </div>
                <button
                  class="border border-[rgba(66,73,78,0.3)] bg-[var(--color-surface-container-low)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-300 transition hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-primary)]"
                  @click="showComingSoonModal = true"
                >
                  Bind
                </button>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
            <div class="mb-8">
              <p class="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Preferences
              </p>
              <p class="mt-2 text-xs uppercase text-[var(--color-outline-variant)]">
                Personalize your arcade experience — Experimental
              </p>
            </div>

            <div class="space-y-5">
              <div
                v-for="item in preferences"
                :key="item.key"
                class="flex items-center justify-between border-b border-[rgba(66,73,78,0.12)] pb-5"
              >
                <div>
                  <p class="text-sm font-bold uppercase">
                    {{ item.label }}
                  </p>
                  <p class="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                    {{ item.description }}
                  </p>
                </div>

                <button
                  type="button"
                  :class="[
                    'relative h-7 w-14 transition',
                    item.enabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-container-lowest)]'
                  ]"
                  @click="item.enabled = !item.enabled"
                >
                  <span
                    :class="[
                      'absolute top-1 h-5 w-5 transition',
                      item.enabled
                        ? 'left-8 bg-[var(--color-on-primary)]'
                        : 'left-1 bg-[var(--color-outline-variant)]'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right -->
        <div class="space-y-8 xl:col-span-4">
          <!-- Account Card -->
          <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
            <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Account Status
            </h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between bg-[var(--color-surface-container-low)] p-4">
                <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Plan</span>
                <span class="text-xs font-bold uppercase">Free</span>
              </div>
              <div class="flex items-center justify-between bg-[var(--color-surface-container-low)] p-4">
                <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Member Since</span>
                <span class="text-xs font-bold uppercase">2026</span>
              </div>
              <div class="flex items-center justify-between bg-[var(--color-surface-container-low)] p-4">
                <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">2FA</span>
                <span class="text-xs font-bold uppercase text-[var(--color-primary)]">Disabled</span>
              </div>
            </div>
          </div>

          <!-- Security -->
          <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
            <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Security
            </h2>

            <ul class="space-y-5">
              <li class="flex items-end justify-between">
                <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Last Login</span>
                <span class="text-xs font-bold uppercase">Recorded</span>
              </li>
              <li class="flex items-end justify-between">
                <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Password</span>
                <span class="text-xs font-bold uppercase">Enabled</span>
              </li>
              <li class="flex items-end justify-between">
                <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Active Session</span>
                <span class="text-xs font-bold uppercase">Current</span>
              </li>
              <li class="flex items-end justify-between">
                <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Protection</span>
                <span class="text-xs font-bold uppercase text-[var(--color-primary)]">Standard</span>
              </li>
            </ul>
          </div>

          <!-- Danger Zone -->
          <div class="border border-red-500/30 bg-[var(--color-surface-container)] p-8">
            <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-red-400">
              Danger Zone
            </h2>

            <div class="space-y-4">
              <button
                class="w-full border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-500/20"
                @click="showDeleteModal = true"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Google Bind Coming Soon 弹窗 -->
  <UModal
    v-model:open="showComingSoonModal"
    :ui="{
      overlay: 'bg-black/70 backdrop-blur-sm z-[10000]',
      content: 'z-[10001] border-2 border-green-500 bg-black shadow-[0_0_30px_rgba(74,222,128,0.15)] rounded-none',
      header: 'border-b border-green-500/20 pb-3',
      title: 'text-lg font-bold tracking-widest text-green-400 uppercase',
      body: 'text-sm text-green-300/70 leading-relaxed py-4 text-center',
      footer: 'border-t border-green-500/20 pt-4 flex justify-center',
      close: 'text-green-500/50 hover:text-green-300'
    }"
  >
    <template #title>
      <div class="flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-green-400">construction</span>
        Coming Soon
      </div>
    </template>

    <template #body>
      <p>Google login integration is not available yet.</p>
      <p class="mt-1 text-green-400/60">Stay tuned for future updates.</p>
    </template>

    <template #footer="{ close }">
      <UButton
        color="primary"
        variant="solid"
        class="bg-green-500 text-black font-bold tracking-widest uppercase rounded-none px-8 hover:bg-green-400"
        @click="close()"
      >
        Got it
      </UButton>
    </template>
  </UModal>

  <!-- Delete Account 确认弹窗 -->
  <UModal
    v-model:open="showDeleteModal"
    :ui="{
      overlay: 'bg-black/70 backdrop-blur-sm z-[10000]',
      content: 'z-[10001] border-2 border-red-500 bg-black shadow-[0_0_30px_rgba(239,68,68,0.15)] rounded-none',
      header: 'border-b border-red-500/20 pb-3',
      title: 'text-lg font-bold tracking-widest text-red-400 uppercase',
      body: 'text-sm text-red-300/70 leading-relaxed py-4',
      footer: 'border-t border-red-500/20 pt-4 flex justify-end gap-3',
      close: 'text-red-500/50 hover:text-red-300'
    }"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-red-400">warning</span>
        Delete Account
      </div>
    </template>

    <template #body>
      <p>This action is irreversible. Your account will be deactivated and all data will be kept but inaccessible.</p>
      <div class="mt-4">
        <label class="space-y-2">
          <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
            Enter your password to confirm
          </span>
          <input
            v-model="deletePassword"
            type="password"
            placeholder="••••••••"
            class="w-full border border-red-500/30 bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-red-500"
          />
        </label>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        color="neutral"
        variant="outline"
        class="border-slate-500 text-slate-400 font-bold tracking-widest uppercase rounded-none px-6 hover:bg-slate-500/10"
        :disabled="deleting"
        @click="close(); deletePassword = ''"
      >
        Cancel
      </UButton>
      <UButton
        color="primary"
        variant="solid"
        class="bg-red-500 text-black font-bold tracking-widest uppercase rounded-none px-6 hover:bg-red-400 disabled:opacity-50"
        :disabled="deleting"
        @click="confirmDelete"
      >
        {{ deleting ? 'Deleting...' : 'Confirm Delete' }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '../utils/request'
import { useToast } from '@nuxt/ui/composables'

const router = useRouter()
const toast = useToast()

const isLogin = computed(() => {
  return localStorage.getItem('8bit_loginStatus') === 'true'
})

function goLogin() {
  router.push('/login')
}

const overviewStats = [
  { label: 'Account', value: 'Active' },
  { label: 'Security', value: 'Normal' },
  { label: 'Sessions', value: '01' },
  { label: 'Plan', value: 'Free' }
]

// ========================
// Profile
// ========================
const profile = reactive({
  nickname: '',
  email: '',
  bio: ''
})

const profileSaving = ref(false)

onMounted(async () => {
  // 从本地先读一份
  const raw = localStorage.getItem('8bit_login_info')
  if (raw) {
    try {
      const info = JSON.parse(raw)
      profile.nickname = info.nickname || ''
      profile.email = info.email || ''
      profile.bio = info.bio || ''
    } catch {}
  }

  // 再从 API 拉最新资料
  try {
    const res = await request.get('profile-get')
    if (res?.data) {
      profile.nickname = res.data.nickname || profile.nickname
      profile.bio = res.data.bio || profile.bio
    }
  } catch {
    // API 失败时保留本地数据，用户仍然可以手动保存
  }
})

async function saveProfile() {
  if (!profile.nickname.trim()) {
    toast.add({ title: 'Validation', description: 'Nickname cannot be empty.', icon: 'i-lucide-circle-alert', color: 'warning', progress: false })
    return
  }

  profileSaving.value = true
  try {
    const res = await request.put('profile-update', {
      nickname: profile.nickname.trim(),
      bio: profile.bio.trim()
    })

    // 同步本地缓存
    const raw = localStorage.getItem('8bit_login_info')
    if (raw) {
      try {
        const info = JSON.parse(raw)
        info.nickname = res.data.nickname || profile.nickname
        localStorage.setItem('8bit_login_info', JSON.stringify(info))
      } catch {}
    }

    toast.add({ title: 'Profile Updated', description: 'Your profile has been saved.', icon: 'i-lucide-circle-check', color: 'success', progress: false })
  } catch (err: any) {
    toast.add({ title: 'Update Failed', description: err?.msg || err?.message || 'Network error', icon: 'i-lucide-circle-alert', color: 'warning', progress: false })
  } finally {
    profileSaving.value = false
  }
}

// ========================
// Change Password
// ========================
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordUpdating = ref(false)

async function updatePassword() {
  // 表单验证
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    toast.add({ title: 'Validation', description: 'All password fields are required.', icon: 'i-lucide-circle-alert', color: 'warning', progress: false })
    return
  }
  if (passwordForm.newPassword.length < 8) {
    toast.add({ title: 'Validation', description: 'New password must be at least 8 characters.', icon: 'i-lucide-circle-alert', color: 'warning', progress: false })
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.add({ title: 'Validation', description: 'New password and confirm do not match.', icon: 'i-lucide-circle-alert', color: 'warning', progress: false })
    return
  }

  passwordUpdating.value = true
  try {
    await request.put('password-change', {
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword
    })

    // 清空表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    toast.add({ title: 'Password Updated', description: 'Your password has been changed successfully.', icon: 'i-lucide-circle-check', color: 'success', progress: false })
  } catch (err: any) {
    toast.add({ title: 'Update Failed', description: err?.msg || err?.message || 'Network error', icon: 'i-lucide-circle-alert', color: 'warning', progress: false })
  } finally {
    passwordUpdating.value = false
  }
}

// ========================
// Delete Account
// ========================
const showComingSoonModal = ref(false)
const showDeleteModal = ref(false)
const deletePassword = ref('')
const deleting = ref(false)

async function confirmDelete() {
  if (!deletePassword.value) {
    toast.add({ title: 'Validation', description: 'Please enter your password to confirm.', icon: 'i-lucide-circle-alert', color: 'warning', progress: false })
    return
  }

  deleting.value = true
  try {
    await request.delete('account-delete', { password: deletePassword.value })

    // 清除本地数据
    localStorage.removeItem('8bit_token')
    localStorage.removeItem('8bit_login_info')
    localStorage.removeItem('8bit_loginStatus')

    showDeleteModal.value = false
    toast.add({ title: 'Account Deactivated', description: 'Your account has been deactivated.', icon: 'i-lucide-circle-check', color: 'success', progress: false })

    setTimeout(() => router.push('/'), 1500)
  } catch (err: any) {
    toast.add({ title: 'Delete Failed', description: err?.msg || err?.message || 'Network error', icon: 'i-lucide-circle-alert', color: 'warning', progress: false })
  } finally {
    deleting.value = false
  }
}

// ========================
// Preferences
// ========================
const preferences = ref([
  {
    key: 'email-notify',
    label: 'Email Notifications',
    description: 'Receive updates about rankings, login alerts, and announcements.',
    enabled: true
  },
  {
    key: 'sound-effects',
    label: 'Interface Sound',
    description: 'Enable system sound effects inside the dashboard.',
    enabled: false
  },
  {
    key: 'public-profile',
    label: 'Public Profile',
    description: 'Allow other players to view your profile and ranking card.',
    enabled: true
  }
])
</script>