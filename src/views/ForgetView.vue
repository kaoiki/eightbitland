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
      <!-- 202404170935  将原来的@submit.prevent="goLogin" 改为 @submit.prevent="resetPassword"-->
      <form class="space-y-4" @submit.prevent="resetPassword">
        <div>
          <label class="mb-2 block text-sm uppercase tracking-widest text-[var(--color-secondary)]">
            Email
          </label> 
          <!-- ↓ 202604081408 删除原来的基础写法更换为下面代码-->
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
          <!-- ↑ -->
        </div>

        <!-- ↓ 202404170935 加一个重置验证码 -->
        <div>
          <label class="mb-2 block text-sm uppercase tracking-widest text-[var(--color-secondary)]">
            CODE
          </label>
          <UInput
            v-model="code"
            type="text"
            placeholder="your verification code"
            size="xl"
            variant="none"
            class="w-full"
            :ui="inputUi"
          >
            <template #trailing>
              <UButton
                class="w-full bg-[var(--color-primary)] py-2 font-bold uppercase tracking-widest text-[var(--color-on-primary)] rounded-none hover:text-[var(--color-on-primary)] active:text-[var(--color-on-primary)]"
                icon="i-lucide-send" 
                variant="link"
                @click="getCode"
              >
                GET CODE
              </UButton>
            </template>
          </UInput>
        </div>
        <!-- 202404170935 加一个输入新密码 -->
        <div>
          <label class="mb-2 block text-sm uppercase tracking-widest text-[var(--color-secondary)]">
            New Password
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
        <!-- ↑ -->

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@nuxt/ui/composables' // 202404170935 关键：引入Nuxt UI的useToast
import { request } from '../utils/request' // 202404170935 引入request

const router = useRouter()

const toast = useToast() // 202404170935 调用useToast

// 202404170935 template中更新的dom所绑定的数据变量
const email = ref('')
const code = ref('') 
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
// ↑ 

function goLogin() {
  router.push('/login')
}

function goHome() {
  router.push('/')
}

// 202404170935 获取验证码
async function getCode() {
  // 判断邮箱是否输入
  if(!email.value.trim()){
    toast.add({
      title: 'Verification failed',
      description: 'Please enter your email.',
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
    return false
  }
  // 判断邮箱格式是否正确
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidEmail = re.test(String(email.value).toLowerCase())
  if(!isValidEmail){
    toast.add({
      title: 'Verification failed',
      description: 'Please check if your email format is correct.',
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
    return false
  }
  // 请求接口获取验证码
  try {
    let param = {
      "email": email.value
    }
    const res = await request.post('password-send-code',param)
    console.log(res)
    toast.add({
      title: 'Verification success',
      description: 'The verification code has been sent.',
      icon: 'i-lucide-circle-check',
      color:'success',
      progress: false
    })
  } catch (err) {
    console.log(err)
    toast.add({
      title: 'Verification failed',
      description: err.message,
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
  }
}

// 202404170935 重置密码
async function resetPassword() {
  // 判断邮箱是否输入
  if(!email.value.trim()){
    toast.add({
      title: 'Verification failed',
      description: 'Please enter your email.',
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
    return false
  }
  // 判断邮箱格式是否正确
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidEmail = re.test(String(email.value).toLowerCase())
  if(!isValidEmail){
    toast.add({
      title: 'Verification failed',
      description: 'Please check if your email format is correct.',
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
    return false
  }
  // 判断验证码是否输入
  if(!code.value.trim()){
    toast.add({
      title: 'Verification failed',
      description: 'Please obtain the email verification code first and enter it.',
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
    return false
  }
  // 判断密码是否为空
  if(!password.value.trim()){
    toast.add({
      title: 'Verification failed',
      description: 'Please enter your password, which must be at least 6 characters long.',
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
    return false
  }

  // 判断密码长度够不够6位
  if(password.value.length < 6){
    toast.add({
      title: 'Verification failed',
      description: 'Your password is shorter than 6 characters. Please reset it.',
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
    return false
  }

  // 满足上述条件请求接口，注册账号
  try {
    let param = {
      "email": email.value,
      "new_password": password.value,
      "code": code.value
    }
    const res = await request.post('password-reset',param)
    router.push('/login')
    console.log(res)  
  }catch(err) {
    toast.add({
      title: 'Verification failed',
      description: err.message,
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
  }
}
</script>