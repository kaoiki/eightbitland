<template>
  <div class="space-y-8 lg:space-y-10">
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
              class="bg-[var(--color-primary)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-0.5"
            >
              Save
            </button>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label class="space-y-2">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Username
              </span>
              <input
                v-model="profile.username"
                type="text"
                class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </label>

            <label class="space-y-2">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline-variant)]">
                Email
              </span>
              <input
                v-model="profile.email"
                type="email"
                class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-lowest)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
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
                class="bg-[var(--color-primary)] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-0.5"
              >
                Update Password
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
              Personalize your arcade experience
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
              <span class="text-xs font-bold uppercase">Today</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Password</span>
              <span class="text-xs font-bold uppercase">Updated 18d ago</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Sessions</span>
              <span class="text-xs font-bold uppercase">2 Active</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Protection</span>
              <span class="text-xs font-bold uppercase text-[var(--color-primary)]">Normal</span>
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
              class="w-full border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)] px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-[var(--color-surface-container-high)]"
            >
              Log Out All Devices
            </button>

            <button
              class="w-full border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-500/20"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const overviewStats = [
  { label: 'Account', value: 'Active' },
  { label: 'Security', value: 'Normal' },
  { label: 'Sessions', value: '02' },
  { label: 'Plan', value: 'Free' }
]

const profile = reactive({
  username: 'PlayerOne',
  email: 'player@example.com',
  bio: 'Arcade explorer. Chasing high scores across every stage.'
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

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