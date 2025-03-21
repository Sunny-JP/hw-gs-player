<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Player from "./components/Player.vue";
import FlagIcon from 'vue3-flag-icons'
import { useI18n } from 'vue-i18n';
import { screenSaver } from "./screen-saver";

const MenuButton = ref(false);
const closeMenu = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".menu") && !target.closest(".hamburger_btn")) {
    MenuButton.value = false;
  }
};

const { locale } = useI18n();
const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem("selectedLanguage", lang);
};

const updateBodyClass = () => {
  document.body.className = `locale-${locale.value}`;
};

watch(locale, updateBodyClass);

onMounted(() => {
  const savedLanguage = localStorage.getItem("selectedLanguage");
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
  updateBodyClass();
  window.addEventListener("click", closeMenu);
  screenSaver();
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeMenu);
});
</script>

<template>
  <header>
    <nav>
      <div class="title_bar">
        <p><router-link to="/">GS Player</router-link></p>
      </div>
      <div class="hamburger_btn" @click.stop="MenuButton = !MenuButton">
        <span class="line line_01" :class="{ 'btn_line01': MenuButton }"></span>
        <span class="line line_02" :class="{ 'btn_line02': MenuButton }"></span>
        <span class="line line_03" :class="{ 'btn_line03': MenuButton }"></span>
      </div>
      <div class="menu" :class="{ open: MenuButton }">
        <ul>
          <li><router-link to="/" @click="MenuButton = false">{{ $t('menu.top') }}</router-link></li>
          <li><router-link to="/about" @click="MenuButton = false">{{ $t('menu.about') }}</router-link></li>
          <li><router-link to="/favorite" @click="MenuButton = false">Favorite</router-link></li>
          <li><router-link to="/terms" @click="MenuButton = false">{{ $t('menu.terms') }}</router-link></li>
          <li><router-link to="/policy" @click="MenuButton = false">{{ $t('menu.policy') }}</router-link></li>
          <li><router-link to="/enquiries" @click="MenuButton = false">{{ $t('menu.enquiries') }}</router-link></li>
          <li><router-link to="/info" @click="MenuButton = false">{{ $t('menu.info') }}</router-link></li>
        </ul>
        <div class="language-switcher">
          <button class="language_btn" @click="changeLanguage('ja')"><FlagIcon code="jp" size="20" /></button>
          <button class="language_btn" @click="changeLanguage('en')"><FlagIcon code="us" size="20" /></button>
          <button class="language_btn" @click="changeLanguage('zh')"><FlagIcon code="cn" size="20" /></button>
          <button class="language_btn" @click="changeLanguage('ko')"><FlagIcon code="kr" size="20" /></button>
        </div>
        
      </div>
    </nav>
  </header>
  <div id="screenSaver" class="screen-saver">
  </div>
  <router-view />
  <Player/>
</template>
