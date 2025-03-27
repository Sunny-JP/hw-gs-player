<script setup lang="ts">
import queue from '../queue';
const queueTitleList = queue.get_queueTitleList();
</script>

<template>
  <div class="page">
    <h1>Tracklist</h1>
    <table>
      <tbody>
        <div v-for="(Title,index) in queueTitleList">
          <tr>
            <td>{{ index }}</td>
            <td>{{ Title }}</td>
          </tr>
        </div>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* default style (mobile) */

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
}
}
</style>