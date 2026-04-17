<template>
  <div class="space-y-8 lg:space-y-10">
    <!-- Header -->
    <section class="monolith-shadow grid grid-cols-1 overflow-hidden bg-[var(--color-surface-container-low)] lg:grid-cols-12">
      <div class="flex flex-col justify-center bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-8 lg:p-12">
        <p class="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--color-secondary)]">
          Rankings
        </p>
        <h1 class="text-3xl font-black uppercase leading-none tracking-tight text-[var(--color-primary)] sm:text-4xl md:text-5xl">
          Leaderboard
        </h1>
        <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-on-surface-variant)]">
          Track the strongest players, highest scores, and current streaks across the arcade.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-px bg-[rgba(66,73,78,0.2)] lg:col-span-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-[var(--color-surface-container-lowest)] p-6"
        >
          <p class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
            {{ stat.label }}
          </p>
          <p class="mt-3 text-2xl font-black uppercase text-[var(--color-primary)]">
            {{ stat.value }}
          </p>
        </div>
      </div>
    </section>

    <!-- Filters / Mode Switch -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <!-- 202604171701 class中新加了overflow-x-auto custom-scrollbar  内容超出出现滚动条并自定义滚动条样式-->
      <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] pr-3 pl-3 lg:col-span-9 ">
          <div class="pt-3 pb-3 overflow-x-auto custom-scrollbar h-full">
            <div class="flex flex-nowrap gap-3">
              <!-- 202604171701 根据数据结构调整 将mode 改为 mode.game_name-->
              <button
                v-for="mode in modes"
                :key="mode"
                :class="[
                  'px-4 py-2 text-xs text-nowrap font-bold uppercase tracking-[0.2em] transition',
                  activeMode === mode.game_name
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                ]"
                @click="switchGame(mode)"
              >
                {{ mode.game_name }}
              </button>
            </div>
          </div>
            
      </div>

      <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-4 lg:col-span-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline-variant)]">
            Season
          </span>
          <span class="text-xs font-bold uppercase text-[var(--color-primary)]">
            S1 // LIVE
          </span>
        </div>
      </div>
    </section>

    <!-- Main -->
    <section class="grid grid-cols-1 gap-8 xl:grid-cols-12">
      <!-- Ranking Table -->
      <div class="xl:col-span-8">
        <div class="overflow-hidden border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)]">
          <div class="grid grid-cols-12 border-b border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container-low)] px-4 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-outline-variant)] sm:px-6">
            <div class="col-span-2 sm:col-span-1">Rank</div>
            <div class="col-span-6 sm:col-span-5">Player</div>
            <div class="hidden sm:block sm:col-span-3">Main Game</div>
            <div class="col-span-4 sm:col-span-2 text-right">Score</div>
            <!-- 202604171701 暂时隐藏 以待后用 -->
            <!-- <div class="hidden sm:block sm:col-span-1 text-right">Win</div> -->
          </div>

          <div
            v-for="player in allPlayers"
            :key="player.rank"
            :class="[
              'grid grid-cols-12 items-center border-b border-[rgba(66,73,78,0.12)] px-4 py-4 transition-colors sm:px-6',
              player.rank <= 3
                ? 'bg-[var(--color-surface-container-high)]'
                : 'bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)]'
            ]"
          >
            <div class="col-span-2 sm:col-span-1" v-if="player.rank != '' ">
              <span
                :class="[
                  'inline-flex min-w-[2.5rem] items-center justify-center px-2 py-1 text-xs font-black uppercase',
                  player.rank === 1
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : player.rank === 2
                    ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-secondary)]'
                    : player.rank === 3
                    ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-tertiary)]'
                    : 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface-variant)]'
                ]"
              >
                #{{ String(player.rank).padStart(2, '0') }}
              </span>
            </div>

            <div class="col-span-6 flex items-center gap-3 sm:col-span-5" v-if="player.rank != '' ">
              <img
                :src="player.avatar"
                :alt="player.name"
                class="h-10 w-10 border border-[rgba(66,73,78,0.2)] object-cover grayscale"
              />
              <div class="min-w-0">
                <p class="truncate text-sm font-bold uppercase">
                  {{ player.name }}
                </p>
                <p class="text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                  {{ player.title }}
                </p>
              </div>
            </div>

            <div class="hidden sm:block sm:col-span-3" v-if="player.rank != '' ">
              <p class="truncate text-xs uppercase text-[var(--color-on-surface-variant)]">
                {{ player.game }}
              </p>
            </div>

            <div class="col-span-4 text-right sm:col-span-2" v-if="player.rank != '' ">
              <p class="text-sm font-black uppercase text-[var(--color-primary)]">
                {{ player.score }}
              </p>
            </div>

            <!-- 202604171701 暂时隐藏 以待后用 -->
            <!-- <div class="hidden sm:block sm:col-span-1 text-right">
              <p class="text-xs font-bold uppercase">
                {{ player.winRate }}
              </p>
            </div> -->

            <div class="w-full col-span-12 text-center text-[var(--color-outline-variant)]" v-if="player.rank == '' ">
              Your spot is waiting
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-8 xl:col-span-4">
        <!-- Top 3 -->
        <div class="border border-[rgba(66,73,78,0.2)] bg-[var(--color-surface-container)] p-8">
          <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Top 3 Pilots
          </h2>

          <div class="space-y-4">
            <div
              v-for="player in topThree"
              :key="player.rank"
              class="flex items-center gap-4 bg-[var(--color-surface-container-low)] p-4"
            >
              <div class="flex h-10 w-10 items-center justify-center bg-[var(--color-surface-container-lowest)] text-sm font-black text-[var(--color-primary)]">
                {{ player.rank }}
              </div>

              <img
                :src="player.avatar"
                :alt="player.name"
                class="h-10 w-10 border border-[rgba(66,73,78,0.2)] object-cover grayscale"
              />

              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold uppercase">
                  {{ player.name }}
                </p>
                <p class="text-[16px] uppercase tracking-[0.2em] text-[var(--color-secondary)] flex content-center items-center">
                  <!-- 202604171701 新增加一个奖杯icon -->
                 <span class="material-symbols-outlined" style="font-size:16px">trophy</span>  {{ player.score }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- System Panel -->
        <div class="border-l-2 border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] p-8">
          <h2 class="mb-6 text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Board Status
          </h2>

          <ul class="space-y-5">
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Refresh</span>
              <span class="text-xs font-bold uppercase">Every 5 min</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Active Board</span>
              <span class="text-xs font-bold uppercase text-[var(--color-primary)]">Global</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Records</span>
              <span class="text-xs font-bold uppercase">12,480</span>
            </li>
            <li class="flex items-end justify-between">
              <span class="text-[10px] uppercase text-[var(--color-outline-variant)]">Integrity</span>
              <span class="text-xs font-bold uppercase text-[var(--color-primary)]">Verified</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// ↓ 202604171701  以下全动 为榜单页面的接口请求，逻辑处理和新增css
import { useToast } from '@nuxt/ui/composables' // 关键：引入Nuxt UI的useToast
import { request } from '../utils/request' // 引入request

const toast = useToast() // 调用useToast

const activeMode = ref('All')

const modes = ref([
  {
    game_id:'All',
    game_name:'All'
  }
])

const stats = [
  { label: 'Players Ranked', value: '12.4K' },
  { label: 'Highest Score', value: '999.9K' },
  { label: 'Active Streak', value: '128' },
  { label: 'Updated', value: 'LIVE' }
]

const allPlayers = ref([])
const topThree = ref([])

// 获取游戏清单
const getGames = async () => {
  try {
    const res = await request.get('games','')
    res.data.items.forEach(item => {
      modes.value.push({
        game_id:item.game_id,
        game_name:item.game_name
      })
    });
  }catch(err) {
    toast.add({
      title: 'ERROR',
      description: err.message,
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
  }
}

// 初始化获取 all 游戏清单
const leaderboardInit = async () => {
  try {
    const res = await request.get('leaderboard-init','')
    // 获取游戏清单
    getGames()
    // 处理榜单数据
    allPlayers.value = [];
    res.data.all_leaderboard.forEach(item => {
      allPlayers.value.push({
        rank: 1,
        name: item.nickname,
        title: (item.play_date).toString().slice(0, 19).replace('T',' '),
        game: item.game_name,
        score: item.score,
        winRate: '84%',
        avatar: item.avatar
      })
    })
    // 不足10条 补上占位
    if(allPlayers.value.length < 10){
      const len = 10 - allPlayers.value.length;
      for(let i=0; i<len; i++){
        allPlayers.value.push({
          rank: '',
          name: '',
          title: '',
          game: '',
          score: '',
          winRate: '',
          avatar: null
        })
      }
    }
    // 处理top_3_pilots数据
    topThree.value = []
    res.data.top_3_pilots.forEach((item,index) => {
      console.log(index,item)
      topThree.value.push({
        rank: index + 1,
        name: item.nickname,
        score: item.first_place_count,
        avatar: item.avatar
      })
    });
    // console.log(res)  
  }catch(err) {
    toast.add({
      title: 'ERROR',
      description: err.message,
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
  }
}

// 切换游戏榜单
const switchGame = async (item) => {
  activeMode.value = item.game_name
  // 切换到all时走init接口
  if(item.game_name == 'All'){
    leaderboardInit()
    return false
  }

  try {
    let param = {
      game_id:item.game_id
    }
    const res = await request.get('leaderboard',{},param)
    allPlayers.value = [];
    res.data.items.forEach((item,index) => {
      allPlayers.value.push({
        rank: index + 1,
        name: item.nickname,
        title: (item.play_date).toString().slice(0, 19).replace('T',' '),
        game: item.game_name,
        score: item.score,
        winRate: '84%',
        avatar: item.avatar
      })
    })

    // 不足10条 补上占位
    if(allPlayers.value.length < 10){
      const len = 10 - allPlayers.value.length;
      for(let i=0; i<len; i++){
        allPlayers.value.push({
          rank: '',
          name: '',
          title: '',
          game: '',
          score: '',
          winRate: '',
          avatar: null
        })
      }
    }
    
  }catch(err) {
    toast.add({
      title: 'ERROR',
      description: err.message,
      icon: 'i-lucide-circle-alert',
      color:'warning',
      progress: false
    })
  }
}

onMounted(() => {
  leaderboardInit()
})
</script>

<style scoped>
/* 自定义漂亮滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px; /* 横向滚动条高度 */
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(66, 73, 78, 0.08); /* 轨道背景 */
  border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(66, 73, 78, 0.3); /* 滑块颜色 */
  border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(66, 73, 78, 0.5); /* hover 加深 */
}
</style>