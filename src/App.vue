<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
const MenuButton = ref(false);

const closeMenu = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".menu") && !target.closest(".hamburger_btn")) {
    MenuButton.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", closeMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeMenu);
});
</script>

<template>
  <header>
    <nav>
      <div class="title_bar">
        <p>GS Player</p>
      </div>
      <div class="hamburger_btn" @click.stop="MenuButton = !MenuButton">
        <span class="line line_01" :class="{ 'btn_line01': MenuButton }"></span>
        <span class="line line_02" :class="{ 'btn_line02': MenuButton }"></span>
        <span class="line line_03" :class="{ 'btn_line03': MenuButton }"></span>
      </div>
      <div class="menu" :class="{ open: MenuButton }">
        <ul>
          <!-- 将来的には多言語対応する．中，韓ではそれぞれNoto sans C，Kを用いる -->
          <li><router-link to="/" @click="MenuButton = false">Top</router-link></li>
          <li><router-link to="/" @click="MenuButton = false">My List</router-link></li>
          <li><router-link to="/player" @click="MenuButton = false">Player(仮置き)</router-link></li>
          <hr>
          <li><router-link to="/about" @click="MenuButton = false">About</router-link></li>
          <li><router-link to="/terms" @click="MenuButton = false">利用規約</router-link></li>
          <li><router-link to="/policy" @click="MenuButton = false">プライバシーポリシー</router-link></li>
          <li><router-link to="/enquiries" @click="MenuButton = false">お問い合わせ</router-link></li>
          <li><router-link to="/info" @click="MenuButton = false">運営者情報</router-link></li>
        </ul>
      </div>
    </nav>
  </header>
  <router-view />
</template>
