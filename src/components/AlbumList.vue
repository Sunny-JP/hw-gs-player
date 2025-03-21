<script setup lang="ts">
import AlbumList from '../assets/AlbumsList.json';
import queue, { type Queue } from '../queue';

function add_play_album(albumIndex: number) {
  console.log("The Album will play! The Album index is " + albumIndex);
  const albumSongList: Queue[] = AlbumList[albumIndex].songs.map((songs) => {
    const queueinter: Queue = {videoId: songs.videoId, SongName: songs.title.ja}
    return queueinter;});
  queue.add_album(albumSongList,AlbumList[albumIndex].albumTitle.ja);// *.ja will change depends on using languare
}
</script>

<template>
  <div class="page">
    <h1>Album List</h1>
    <div class="album-container">
      <div v-for="(AlbumList, index) in AlbumList">
        <button
        v-on:click="add_play_album(index)" class="button_album">
          <img :src=AlbumList.albumArt alt="" sizes="" srcset="">
          <div class="album-title">{{ AlbumList.albumTitle.ja }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.album-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(1px, 1vw, 10px);
}

.button_album {
  font-family: "Poppins", "Noto Sans JP", "Helvetica Neue", "Helvetica", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
  font-size: clamp(1.5px, calc(3vw - 1px), 15px);
  background: #000000;
  color: #ffffff;
  border: #404040 solid 2px;
  padding: 5px;
  width: 30vw;
  max-width: 200px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button_album img {
  width: 100%;
  height: auto;
}

.album-title {
  margin-top: 5px;
  text-align: center;
}
</style>