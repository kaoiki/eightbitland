<template>
  <div class="h-screen overflow-hidden bg-[var(--color-surface)] text-[var(--color-on-surface)]">
    <div class="flex h-full">
      <AppSidebar
        class="hidden lg:flex"
        :is-mobile="false"
        :is-open="true"
        @close="closeMobileMenu"
      />

      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 bg-black/60 lg:hidden"
        @click="closeMobileMenu"
      />

      <AppSidebar
        class="lg:hidden"
        :is-mobile="true"
        :is-open="mobileMenuOpen"
        @close="closeMobileMenu"
      />

      <div class="flex min-w-0 flex-1 flex-col lg:ml-64">
        <AppMobileHeader
          :menu-open="mobileMenuOpen"
          @toggle-menu="toggleMobileMenu"
        />

        <main class="pixel-grid no-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div class="px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
            <div class="mx-auto max-w-6xl">
              <RouterView />
            </div>
          </div>
        </main>

        <AppFooterBar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppMobileHeader from '../components/layout/AppMobileHeader.vue'
import AppFooterBar from '../components/layout/AppFooterBar.vue'

const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>