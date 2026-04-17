import { defineStore } from 'pinia'

// 直接把类型接口写在当前文件里
interface UserState {
  token: string
}

export const useUserStore = defineStore('user', {
  // 定义状态并指定类型
  state: (): UserState => ({
    token: localStorage.getItem('8bit_token') || '',
  }),

  // 修改状态的方法
  actions: {
    // 存储 Token
    setToken(token: string): void {
      this.token = token
      localStorage.setItem('8bit_token', token)
    },

    // 清除 Token（退出登录）
    clearToken(): void {
      this.token = ''
      localStorage.removeItem('8bit_token')
    },
  },
})