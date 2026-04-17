<template>
  <!-- ↓ 202604081632 全局全屏 Loading 遮罩 -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
  >
    <!-- 旋转加载图标（Nuxt UI 标准） -->
    <UIcon
      name="i-lucide-loader-circle"
      class="text-primary w-10 h-10 animate-spin"
    />
  </div>
  <!-- ↑ -->
  <!-- 202604161145 想要使用toast 页面必须被UApp包裹 -->
  <UApp :toaster="toaster">
    <RouterView />
  </UApp>
  <!-- ↑ -->
</template>


<script setup lang="ts">
// ↓ 202604081632 全局全屏 Loading 遮罩
import { useRequestLoading } from './utils/request'
const { isLoading } = useRequestLoading()
// ↑

// 202604161145 配置toast出现的位置
const toaster = { position: 'top-right' }

</script>
