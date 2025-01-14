import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import { useRoleColorStore } from '@/store/character/role/roleColor'

const app = createApp(App)

app.use(pinia)
app.use(router)

// 初始化 store
const roleColorStore = useRoleColorStore()
roleColorStore.loadSavedColors()

app.mount('#app')
