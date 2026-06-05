import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ref } from 'vue'
import { useUserStore } from '../stores/index'

const API = {
    'password-send-code': '/api/auth/password/send-code',
    'register-send-code': '/api/auth/register/send-code',
    'register': '/api/auth/register/',
    'login':'api/auth/login/',
    'password-reset':'/api/auth/password/reset',
    'game-scores':'/api/game-scores',
    'games':'/api/games',
    'leaderboard-init':'/api/leaderboard/init',
    'leaderboard':'api/leaderboard/{game_id}',
} as const

// 类型定义
type ApiKey = keyof typeof API

// 全局 loading 状态（自己手写，比 useLoading 更稳，零依赖报错）
export const isLoading = ref(false)

const startLoading = () => {
  isLoading.value = true
}
const endLoading = () => {
  isLoading.value = false
}

// 创建 axios 实例
const service = axios.create({
  baseURL: 'https://www.heartbeat.cool:2248',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    startLoading() // 开启 loading
    const userStore = useUserStore()
    const token = userStore.token

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['X-App-Code'] = '8bit' // 你的应用编码

    return config
  },
  (error) => {
    endLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    endLoading() // 关闭 loading
    const res = response.data

    if (res.code !== 200 && res.code !== 0) {
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    endLoading()
    return Promise.reject(error.response?.data || { code: 502, msg: '网络异常' })
  }
)

// ======================================
// 统一请求方法（带 TS 类型）
// ======================================
export const request = {
    // get<T = any>(urlKey: ApiKey, params?: any): Promise<T> {
    //   return service({ url: API[urlKey], method: 'get', params })
    // },
    // 扩展get方法支持动态路径参数
    get<T = any>(urlKey: ApiKey, params?: any, pathParams?: Record<string, string | number>): Promise<T> {
      // 核心修改：将API[urlKey]断言为string，解除字面量类型限制
      let url = API[urlKey] as string;
      // 替换动态占位符
      if (pathParams) {
          Object.entries(pathParams).forEach(([key, value]) => {
              url = url.replace(`{${key}}`, String(value));
          });
      }
      return service({ url, method: 'get', params })
    },
    post<T = any>(urlKey: ApiKey, data?: any): Promise<T> {
      return service({ url: API[urlKey], method: 'post', data })
    },
    put<T = any>(urlKey: ApiKey, data?: any): Promise<T> {
      return service({ url: API[urlKey], method: 'put', data })
    },
    delete<T = any>(urlKey: ApiKey, params?: any): Promise<T> {
      return service({ url: API[urlKey], method: 'delete', params })
    },
}
  
export const useRequestLoading = () => ({ isLoading })

export default service