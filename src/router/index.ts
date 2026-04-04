import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'
import HomeView from '../views/HomeView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import BattleView from '../views/BattleView.vue'
import MarketView from '../views/MarketView.vue'
import SettingsView from '../views/SettingsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgetView from '../views/ForgetView.vue'
import ArcadeView from '../views/ArcadeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'leaderboard',
          name: 'leaderboard',
          component: LeaderboardView
        },
        {
          path: 'battle',
          name: 'battle',
          component: BattleView
        },
        {
          path: 'market',
          name: 'market',
          component: MarketView
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsView
        }
      ]
    },
    {
      path: '/login',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'login',
          component: LoginView
        }
      ]
    },
    {
      path: '/register',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'register',
          component: RegisterView
        }
      ]
    },
    {
      path: '/forget',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'forget',
          component: ForgetView
        }
      ]
    },
    {
        path: '/arcade',
        component: BlankLayout,
        children: [
            {
            path: '',
            name: 'arcade',
            component: ArcadeView
            }
        ]
    }
  ]
})

export default router