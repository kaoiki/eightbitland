<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-md border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
      <div class="mb-6 flex items-center justify-between">
        <button
          type="button"
          class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 transition hover:text-[var(--color-primary)]"
          @click="goHome"
        >
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          Home
        </button>
      </div>

      <h1 class="mb-6 text-2xl font-bold uppercase text-[var(--color-primary)]">
        Login
      </h1>

      <form class="space-y-4" @submit.prevent="goHome">
        <div>
          <label class="mb-2 block text-sm uppercase tracking-widest text-[var(--color-secondary)]">
            Email
          </label>

          <UInput
            v-model="email"
            type="email"
            placeholder="you@example.com"
            size="xl"
            variant="none"
            class="w-full"
            :ui="inputUi"
          >
            <template v-if="email.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear email"
                class="text-slate-500 hover:text-white"
                @click="email = ''"
              />
            </template>
          </UInput>
        </div>

        <div>
          <label class="mb-2 block text-sm uppercase tracking-widest text-[var(--color-secondary)]">
            Password
          </label>

          <UInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            size="xl"
            variant="none"
            class="w-full"
            :ui="inputUi"
          >
            <template #trailing>
              <div class="flex items-center gap-1">
                <UButton
                  v-if="password.length"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-circle-x"
                  aria-label="Clear password"
                  class="text-slate-500 hover:text-white"
                  @click="password = ''"
                />
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  class="text-slate-500 hover:text-white"
                  @click="showPassword = !showPassword"
                />
              </div>
            </template>
          </UInput>
        </div>

        <button
          type="submit"
          class="flex h-12 w-full items-center justify-center bg-[var(--color-primary)] font-bold uppercase tracking-widest text-[var(--color-on-primary)] transition hover:brightness-110 active:translate-y-px"
        >
          Sign In
        </button>
      </form>

      <div class="mt-4 text-right">
        <button
          type="button"
          class="text-sm font-bold text-[var(--color-primary)] hover:underline"
          @click="goForget"
        >
          Forget password?
        </button>
      </div>

      <div class="mt-6 text-center text-sm text-slate-400">
        No account?
        <button
          type="button"
          class="ml-1 font-bold text-[var(--color-primary)] hover:underline"
          @click="goRegister"
        >
          Create one
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const inputUi = {
  root: 'w-full',
  base: [
    'h-12 w-full',
    'bg-black',
    'text-white',
    'placeholder:text-slate-500',
    'rounded-none',
    'border-0',
    'shadow-none',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-[var(--color-primary)]',
    'px-4'
  ].join(' '),
  trailing: 'pe-2'
}

function goRegister() {
  router.push('/register')
}

function goForget() {
  router.push('/forget')
}

function goHome() {
  router.push('/')
}
</script>