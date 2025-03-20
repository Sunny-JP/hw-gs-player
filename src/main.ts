import { createApp } from 'vue'
import { createManager } from '@vue-youtube/core';
import './style.css'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue3-cookies';

const app = createApp(App)
app.use(createManager())
app.use(router)
app.use(VueCookies)
app.mount('#app')