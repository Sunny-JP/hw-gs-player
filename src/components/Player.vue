<script setup lang="ts">
import { YoutubeIframe } from '@vue-youtube/component';
import { ref, computed, onUnmounted, nextTick } from 'vue';
import queue from '../queue';

let videoId = ref('zxt-_P_WXtM'); // example of long titleName
// let videoId = ref('XAwXaGQwoZ0');  // example of short titleName
const player = ref<any>(null);
const nowTime = ref(0);
const endTime = ref(0);
const title = ref();
const titleName = ref();
const intervalId = ref<number | null>(null);
const isPlaying = ref(false);
let albumTitle = queue.get_albumTitle();

const titleElement = ref<HTMLElement | null>(null);
const needsScroll = ref(false);
const parentWidth = ref(0);
const textWidth = ref(0);
const isAnimating = ref(false);
const SCROLL_SPEED = 40; // px/s
const WAIT_TIME = 2000; // ms

let next_song;
const togglePlay = async () => {
  player.value?.togglePlay(); // Change play-pause
};

const onReady = (event: { target: any }) => {
  endTime.value = Math.floor(event.target.getDuration()); // Get total time and video title
  title.value = event.target.getVideoData();
  titleName.value = title.value['title'];

  nextTick(() => { // Determine if scrolling is necessary
  if (titleElement.value) {
    parentWidth.value = titleElement.value.parentElement?.offsetWidth || 0;
    textWidth.value = titleElement.value.scrollWidth;
    needsScroll.value = textWidth.value > parentWidth.value;

    if (needsScroll.value) {
      startScrolling();
    }
  }
});
};

// Calculate the distance to scroll
const animationDuration = computed(() => {
  const distance = textWidth.value;
  return needsScroll.value ? distance / SCROLL_SPEED : 0;
});

// scrolling function
const startScrolling = async () => {
  if (!needsScroll.value) return;
  await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
  isAnimating.value = true;
};

// When the playback state is changed
const onStateChange = (event: { target: any; data: number }) => {
  console.log("onStateChange");
  if (event.data === 1) { // start
    console.log("start(1)");
    isPlaying.value = true; // play-pause-button
    intervalId.value = window.setInterval(() => { // Get current time per 250ms
      nowTime.value = Math.floor(event.target.getCurrentTime());
    }, 250);
  } else if (event.data === 0) { // end(0)
    console.log("end(0)");
    next_song = queue.get_next();
    if(next_song == null){ //check queue whather exist next song
      isPlaying.value = false;
      if(intervalId.value !== null) {
        clearInterval(intervalId.value);
        intervalId.value = null;
      }
    }else{
      videoId = ref(next_song)
    }
  } else if (event.data === 2) { // stop (2)
    console.log(2);
    isPlaying.value = false; // play-pause-button
    if (intervalId.value !== null) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  }
  albumTitle = queue.get_albumTitle();
};

// Format to mm:ss
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Get formatted time with computed
const formattedNowTime = computed(() => formatTime(nowTime.value));
const formattedEndTime = computed(() => formatTime(endTime.value));

// Clear setInterval when component is destroyed
onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
  }
});
</script>

<template>
  <div class="container">
    <youtube-iframe 
      :video-id="videoId"
      :player-vars="{
        autoplay: 1,
        iv_load_policy: 3,
        loop: 1,
        playlist: videoId,
        controls: 0,
        playsinline: 1,
        rel: 0
        }"
      ref="player"
      @ready="onReady" 
      @state-change="onStateChange" />
    <div class="info_box">
      <div class="title">
        <div ref="titleElement"
            class="scroll-container"
            :class="{ scrolling: isAnimating }"
            :style="isAnimating ? `--animation-duration: ${animationDuration}s;` : ''">
          <span v-if="needsScroll" class="scroll-text">
            {{ titleName }}&nbsp;&nbsp;&nbsp;{{ titleName }}
          </span>
          <span v-else class="single-text">
            {{ titleName }}
          </span>
        </div>
      </div>
      <div class="album">{{albumTitle}}</div>
      <div class="time_container">
        <div class="nowtime">{{ formattedNowTime }}</div>
        <div class="endtime">{{ formattedEndTime }}</div>
      </div>
    </div>
    <button @click="togglePlay" class="play-pause-button">
      <div class="play-pause-icon" :class="{ playing: isPlaying }">
        <div class="bar bar-left"></div>
        <div class="bar bar-right"></div>
      </div>
    </button>
  </div>
</template>

<style scoped>
</style>
