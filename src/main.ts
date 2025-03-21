import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createManager } from '@vue-youtube/core';
import VueCookies from 'vue3-cookies';
import { createI18n } from 'vue-i18n'
import ja from './locales/ja.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import './style.css'
import 'vue3-flag-icons/styles'

const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'en',
  messages: {
    ja,
    en,
    zh,
    ko,
  },
});

const app = createApp(App)
app.use(createManager())
app.use(i18n)
app.use(router)
app.use(VueCookies)
app.mount('#app')