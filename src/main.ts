import { createApp } from 'vue'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'
import './assets/main.css'
import router from './router'

import { createPinia } from 'pinia' // 202604081451 引入 createPinia

const app = createApp(App)

app.use(ui)
app.use(router)
app.use(createPinia()) // 202604081451 注册 Pinia


app.mount('#app')