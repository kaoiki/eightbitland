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
        Forget Password
      </h1>

      <p class="mb-6 text-sm text-slate-400">
        Enter your email and we will send you a password reset link.
      </p>

      <form class="space-y-4" @submit.prevent="goLogin">
        <div>
          <label class="mb-2 block text-sm uppercase tracking-widest text-[var(--color-secondary)]">
            Email
          </label>
          <input
            type="email"
            class="w-full border border-[rgba(66,73,78,0.3)] bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-primary)]"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-[var(--color-primary)] py-3 font-bold uppercase tracking-widest text-[var(--color-on-primary)]"
        >
          Send Reset Link
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-slate-400">
        Back to
        <button
          type="button"
          class="ml-1 font-bold text-[var(--color-primary)] hover:underline"
          @click="goLogin"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goLogin() {
  router.push('/login')
}

function goHome() {
  router.push('/')
}
</script>