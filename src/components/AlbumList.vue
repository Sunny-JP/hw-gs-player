<script setup lang="ts">
import AlbumList from '../assets/AlbumsList.json';
import queue from '../queue';
function add_play_album(albumIndex: number) {
  console.log("The Album will play! The Album index is" + albumIndex);
  const albumSongList = AlbumList[albumIndex].songs.map((songs) => songs.videoId)
  queue.add_album(albumSongList,AlbumList[albumIndex].albumTitle.ja);// *.ja will change depends on using languare
}
</script>

<template>
  <div class="page">
    <h1>Album List</h1>
    <div v-for="(AlbumList, index) in AlbumList">
      <button
      v-on:click="add_play_album(index)">
      AlbumTitle: {{ AlbumList.albumTitle.ja }}
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>