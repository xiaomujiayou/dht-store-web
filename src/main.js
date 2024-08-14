import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import axios from 'axios'
import '@/assets/icon-font/iconfont.css'
import router from './router'

const app = createApp(App);
app.use(Vant);
app.use(router)
app.config.globalProperties.$http = axios
axios.defaults.baseURL='/api'
app.mount('#app')
