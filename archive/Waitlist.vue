<template>
  <UApp :toaster="{ position: 'top-right' }">
    <main class="relative min-h-screen overflow-hidden bg-[#070b14] text-white">
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.12),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.12),transparent_30%)]"></div>
        <div class="scanlines absolute inset-0 opacity-20"></div>
        <div class="grid-mask absolute inset-0 opacity-30"></div>
        <div class="absolute -left-20 top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div class="absolute right-0 top-16 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl"></div>
        <div class="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-amber-300/10 blur-3xl"></div>
      </div>

      <section class="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header class="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div class="flex items-center gap-3">
            <div class="pixel-box flex h-11 w-11 items-center justify-center bg-cyan-400/15 text-lg font-black text-cyan-300">
              8B
            </div>
            <div>
              <p class="pixel-font text-sm tracking-[0.25em] text-cyan-300">INSERT COIN</p>
              <h1 class="text-sm font-semibold text-white/80">Retro Arcade Portal</h1>
            </div>
          </div>

          <div class="hidden items-center gap-2 md:flex">
            <UBadge color="neutral" variant="subtle" class="pixel-font border border-cyan-400/30 px-3 py-1 text-[10px] tracking-[0.2em] text-cyan-200">
              COMING SOON
            </UBadge>
            <UBadge color="neutral" variant="subtle" class="pixel-font border border-pink-400/30 px-3 py-1 text-[10px] tracking-[0.2em] text-pink-200">
              PLAYER + CREATOR
            </UBadge>
          </div>
        </header>

        <div class="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:py-14">
          <section class="flex flex-col justify-center">
            <p class="pixel-font mb-4 inline-flex w-fit items-center gap-2 border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[11px] tracking-[0.25em] text-cyan-200">
              <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-300"></span>
              PRESS START
            </p>

            <h2 class="max-w-3xl text-4xl font-black uppercase leading-tight text-white sm:text-5xl xl:text-6xl">
              Tiny Games.
              <span class="block text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.3)]">Big Nostalgia.</span>
            </h2>

            <p class="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              A retro playground for fast 8-bit mini games — play, score, rank, and get ready for a future filled with creator-made arcade chaos.
            </p>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <UButton size="xl" class="pixel-font h-12 justify-center rounded-none border border-cyan-300/60 bg-cyan-300/15 px-6 text-[12px] tracking-[0.2em] text-cyan-100 hover:bg-cyan-300/25">
                JOIN THE MAIL LIST
              </UButton>
              <UButton size="xl" variant="ghost" class="pixel-font h-12 justify-center rounded-none border border-white/15 px-6 text-[12px] tracking-[0.2em] text-white/80 hover:bg-white/5">
                SEE WHAT'S COMING
              </UButton>
            </div>

            <div class="mt-10 grid gap-4 sm:grid-cols-3">
              <div class="pixel-panel p-4">
                <p class="pixel-font text-[10px] tracking-[0.18em] text-cyan-200">QUICK PLAY</p>
                <p class="mt-2 text-sm leading-6 text-white/70">Short sessions, instant fun, one more run energy.</p>
              </div>
              <div class="pixel-panel p-4">
                <p class="pixel-font text-[10px] tracking-[0.18em] text-pink-200">SCORE + RANK</p>
                <p class="mt-2 text-sm leading-6 text-white/70">Rack up points, chase streaks, stay on the board.</p>
              </div>
              <div class="pixel-panel p-4">
                <p class="pixel-font text-[10px] tracking-[0.18em] text-amber-200">CREATOR READY</p>
                <p class="mt-2 text-sm leading-6 text-white/70">Future support for player-made JavaScript mini games.</p>
              </div>
            </div>
          </section>

          <section class="relative">
            <div class="arcade-shell mx-auto max-w-xl p-4 sm:p-5">
              <div class="arcade-screen relative overflow-hidden p-5 sm:p-6">
                <div class="absolute left-4 top-4 flex items-center gap-2 text-[10px] text-green-300/80">
                  <span class="inline-block h-2 w-2 rounded-full bg-green-300 shadow-[0_0_10px_rgba(134,239,172,0.9)]"></span>
                  <span class="pixel-font tracking-[0.18em]">SYSTEM ONLINE</span>
                </div>

                <div class="mt-9 rounded-none border border-cyan-300/25 bg-white/5 p-4 backdrop-blur-sm">
                  <div class="mb-4 flex items-center justify-between">
                    <p class="pixel-font text-[11px] tracking-[0.2em] text-cyan-200">COMING TO THE ARCADE</p>
                    <p class="pixel-font text-[10px] tracking-[0.2em] text-white/45">01 CREDITS</p>
                  </div>

                  <div class="space-y-3">
                    <div
                      v-for="game in games"
                      :key="game.name"
                      class="group border border-white/10 bg-[#09101d]/90 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-[#0b1424]"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div>
                          <h3 class="pixel-font text-[13px] tracking-[0.14em] text-white">{{ game.name }}</h3>
                          <p class="mt-2 text-sm leading-6 text-white/65">{{ game.desc }}</p>
                        </div>
                        <span class="pixel-font shrink-0 border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-[10px] tracking-[0.16em] text-amber-200">
                          SOON
                        </span>
                      </div>
                      <div class="mt-3 flex flex-wrap gap-2 text-xs text-white/55">
                        <span class="border border-white/10 px-2 py-1">Mode: {{ game.mode }}</span>
                        <span class="border border-white/10 px-2 py-1">Session: {{ game.session }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-5 grid gap-3 sm:grid-cols-2">
                  <div class="border border-fuchsia-300/20 bg-fuchsia-300/8 p-4">
                    <p class="pixel-font text-[10px] tracking-[0.18em] text-fuchsia-200">PLAY FAST</p>
                    <p class="mt-2 text-sm leading-6 text-white/70">Replayable runs designed for short breaks and late-night streaks.</p>
                  </div>
                  <div class="border border-cyan-300/20 bg-cyan-300/8 p-4">
                    <p class="pixel-font text-[10px] tracking-[0.18em] text-cyan-200">STAY RANKED</p>
                    <p class="mt-2 text-sm leading-6 text-white/70">Leaderboard-ready scoring and future account sync support.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section class="grid gap-6 border-t border-white/10 py-10 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <p class="pixel-font text-[11px] tracking-[0.22em] text-cyan-200">BUILT FOR PLAYERS. OPEN TO CREATORS.</p>
            <h3 class="mt-3 text-2xl font-black uppercase text-white sm:text-3xl">
              Upload tiny JavaScript games later and plug into the score system.
            </h3>
            <p class="mt-4 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
              We’re building a future where creators can bring weird, fun, fast little games to the arcade and connect them to rankings, points, and community competition.
            </p>

            <div class="mt-6 flex flex-wrap gap-3">
              <span class="pixel-font border border-cyan-300/20 bg-cyan-300/8 px-3 py-2 text-[10px] tracking-[0.18em] text-cyan-200">JAVASCRIPT FRIENDLY</span>
              <span class="pixel-font border border-pink-300/20 bg-pink-300/8 px-3 py-2 text-[10px] tracking-[0.18em] text-pink-200">SCORE API READY</span>
              <span class="pixel-font border border-amber-300/20 bg-amber-300/8 px-3 py-2 text-[10px] tracking-[0.18em] text-amber-200">COMMUNITY DRIVEN</span>
            </div>
          </div>

          <div class="pixel-panel p-5 sm:p-6">
            <p class="pixel-font text-[11px] tracking-[0.2em] text-cyan-200">BE THE FIRST TO PLAY</p>
            <p class="mt-3 text-sm leading-7 text-white/70">
              Join the mail list for launch updates, playtests, and creator news.
            </p>

            <div class="mt-5 space-y-3">
              <UInput
                v-model="email"
                size="xl"
                placeholder="Enter your email"
                class="w-full"
                @keydown.enter="joinWaitlist"
                :ui="{
                  base: 'w-full h-12 rounded-none border border-white/15 bg-white/5 text-white placeholder:text-white/35 focus:border-cyan-300/50 focus:ring-0'
                }"
              />

              <UButton
                block
                size="xl"
                @click="joinWaitlist"
                class="pixel-font w-full h-12 rounded-none border border-cyan-300/60 bg-cyan-300/15 text-[12px] tracking-[0.2em] text-cyan-100 hover:bg-cyan-300/25"
              >
                JOIN MAIL LIST
              </UButton>
            </div>

            <p class="mt-3 text-xs leading-6 text-white/45">
              No spam. Just launch news, testing invites, and arcade updates.
            </p>
          </div>
        </section>

        <footer class="flex flex-col gap-3 border-t border-white/10 pt-6 pb-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p class="pixel-font tracking-[0.22em]">PLAY FAST • RANK HIGHER • CREATE LATER</p>
          <p>INSERT COIN • COMING SOON • BUILT FOR RETRO SOULS</p>
        </footer>
      </section>
    </main>
  </UApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const toast = useToast()

const email = ref('')

const games = [
  {
    name: 'SNAKE RELOADED',
    desc: 'Classic snake, faster pace, tighter corners, higher stakes.',
    mode: 'Survival',
    session: '2–5 min'
  },
  {
    name: 'BRICK BLASTER',
    desc: 'Break everything. Miss nothing. Stay alive for one more wave.',
    mode: 'Arcade',
    session: '3–6 min'
  },
  {
    name: 'PIXEL BLOCKS',
    desc: 'Stack clean, think fast, and don’t let the board swallow you.',
    mode: 'Puzzle',
    session: '3–8 min'
  },
  {
    name: 'MICRO CHAOS',
    desc: 'Rapid-fire absurd micro-games made for short bursts of madness.',
    mode: 'Micro Challenge',
    session: '30–90 sec'
  }
]

const joinWaitlist = () => {
  //coding
  const value = email.value.trim()

  if (!value) {
    toast.add({
      title: 'Email is required',
      description: 'Please enter your email address.',
      color: 'error'
    })
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(value)) {
    toast.add({
      title: 'Invalid email',
      description: 'Please enter a valid email address.',
      color: 'error'
    })
    return
  }

  // 临时 success，后面接真实提交成功后再保留
  toast.add({
    title: 'Success',
    description: 'Email format looks good.',
    color: 'success'
  })

}

</script>

<style scoped>
.pixel-font {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.pixel-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background:
    linear-gradient(to bottom right, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
    rgba(8, 13, 24, 0.88);
  box-shadow:
    0 0 0 1px rgba(34, 211, 238, 0.06) inset,
    0 10px 40px rgba(0, 0, 0, 0.28);
}

.pixel-box {
  border: 2px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 0 0 1px rgba(34, 211, 238, 0.15) inset,
    0 0 20px rgba(34, 211, 238, 0.18);
}

.arcade-shell {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 0 50px rgba(34, 211, 238, 0.08);
}

.arcade-screen {
  border: 1px solid rgba(34, 211, 238, 0.18);
  background:
    radial-gradient(circle at top, rgba(34, 211, 238, 0.08), transparent 45%),
    linear-gradient(180deg, rgba(8, 17, 31, 0.96), rgba(4, 9, 17, 0.98));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    inset 0 0 50px rgba(34, 211, 238, 0.06);
}

.scanlines {
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06) 0,
    rgba(255, 255, 255, 0.06) 1px,
    transparent 1px,
    transparent 4px
  );
  background-size: 100% 4px;
}

.grid-mask {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(circle at center, black 35%, transparent 90%);
}
</style>
