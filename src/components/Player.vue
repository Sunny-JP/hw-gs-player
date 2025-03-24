<script setup lang="ts">
import { YoutubeIframe } from '@vue-youtube/component';
import { ref, computed, onUnmounted, watch } from 'vue';
import queue from '../queue';
import Tracklist from './TrackList.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiRepeatOnce, mdiRepeatOff, mdiStarCheck, mdiStarPlusOutline } from '@mdi/js';

// YouTube player instance
const player = ref<any>(null);

// Video time
const nowTime = ref(0);
const endTime = ref(0);
const intervalId = ref<number | null>(null);
const isPlaying = ref(false);

// Video title
const title = ref();
const titleName = ref();

// Album info
let albumTitle = queue.get_albumTitle();

// Fullscreen mode
const isFullscreen = ref(false);
const animationClass = ref("");

// Toggle fullscreen mode
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// Watch fullscreen state changes
watch(isFullscreen, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    animationClass.value = newVal ? "slide-up" : "slide-down";
    
    // Remove animation class after transition
    setTimeout(() => {
      animationClass.value = "";
    }, 250);
  }
});

// Toggle play/pause
const togglePlay = async () => {
  player.value?.togglePlay();
};

// When player is ready
const onReady = (event: { target: any }) => {
  endTime.value = Math.floor(event.target.getDuration());
  title.value = event.target.getVideoData();
  titleName.value = title.value['title'];
};

// Handle video state changes
const onStateChange = (event: { target: any; data: number }) => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }

  if (event.data === 1) { // Playing
    isPlaying.value = true;
    intervalId.value = window.setInterval(() => {
      nowTime.value = Math.floor(event.target.getCurrentTime());
    }, 200);
  } else if (event.data === 0) { // End
    isPlaying.value = false;
    queue.get_next();
  } else if (event.data === 2) { // Paused
    isPlaying.value = false;
  }

  albumTitle = queue.get_albumTitle();
};

// Format time as mm:ss
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Computed formatted time
const formattedNowTime = computed(() => formatTime(nowTime.value));
const formattedEndTime = computed(() => formatTime(endTime.value));

// Clear interval on component unmount
onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
  }
});

const renderKey = queue.get_playerRenderKey();

</script>

<template>
  <div class="layout">
    <div 
      :class="[
        isFullscreen ? 'fscontainer' : 'container',
        animationClass
      ]" 
      :key="renderKey"
    >
      <youtube-iframe
        :video-id="queue.get_nowSong().videoId"
        :player-vars="{
          autoplay: 1,
          iv_load_policy: 3,
          loop: 0,
          controls: 0,
          playsinline: 1,
          rel: 0
        }"
        ref="player"
        @ready="onReady" 
        @state-change="onStateChange" 
      />

      <div class="info_box">
        <!-- Video title -->
        <div class="title" @click="toggleFullscreen">
          {{ titleName }}
        </div>

        <!-- Time and album info -->
        <div class="time_container">
          <div class="nowtime">{{ formattedNowTime }}</div>
          <div class="endtime">{{ formattedEndTime }}</div>
          <div class="album">{{ albumTitle }}</div>
        </div> 

        <div class="fs_album_container">
          <div class="fs_album">{{ albumTitle }}</div>
          <div class="fs_loop" @click="queue.onLoopButton()">
            <SvgIcon type="mdi" :path="queue.isLoop.value ? mdiRepeatOnce : mdiRepeatOff" />
          </div>
          <div class="fs_fav" @click="queue.event_favorite(queue.get_nowSong())">
            <SvgIcon type="mdi" :path="queue.isFavorite.value ? mdiStarCheck : mdiStarPlusOutline" />
          </div>
        </div>

        <div class="fs_time_container">
          <div class="nowtime">{{ formattedNowTime }}</div>
          <div class="endtime">{{ formattedEndTime }}</div>
        </div>
      </div>

      <div class="control_box">
      <!-- Play/Pause button -->
        <button @click="togglePlay" class="play-pause-button">
          <div class="play-pause-icon" :class="{ playing: isPlaying }">
            <div class="bar bar-left"></div>
            <div class="bar bar-right"></div>
          </div>
        </button>
      </div>
    </div>

    <div 
      :class="[
        isFullscreen ? 'fstracklist-container' : 'tracklist-container',
        animationClass
      ]"
    >
      <Tracklist />
    </div>
  </div>
</template>

<style scoped>
@import '../player-style.css';
</style>
