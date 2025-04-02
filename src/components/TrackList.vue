<script setup lang="ts">
import { computed } from "vue";
import queue from '../queue';

const queueTitleList = computed(() => queue.get_queueTitleList());
</script>

<template>
  <div class="page">
    <h1>{{ $t('menu.tracklist') }}</h1>
    <table>
      <tbody>
        <tr v-for="(Title, index) in queueTitleList" :key="index" @click="queue.play_in_queue(index)">
          <td class="index">{{ String(index).padStart(3, '0') }}</td>
          <td class="title">{{ Title }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* default style */
.page{
  padding: 20px;
  transition: opacity 0.3s ease-in-out;
}

h1{
  font-size: 24px;
  padding-bottom: 10px;
}

.index{
  font-family: "Lekton", monospace;
  font-size: 14px;
}

.index::after {
  content: "\00A0";
}

.title {
  font-size: 20px;
}

table td {
  display: table-cell;
  vertical-align: middle; /* 上下中央揃え */
  padding: 1px; /* セル内の余白を調整 */
}

/* 2column style (PC) */
@media (min-aspect-ratio: 1/1) {
  .fstracklist-container .page {
    position: block;
    top: 0;
    padding: 30px;
    z-index: 30;
    width: calc(50vw - 60px);
    height: calc(100% - 60px);
    background: #000000;
    font-size: 20px;
  }
}
</style>