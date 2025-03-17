<script setup lang="ts">
import { YoutubeIframe } from '@vue-youtube/component';
import { ref, computed, onUnmounted, nextTick } from 'vue';
import queue from '../queue';

//let videoId = ref('zxt-_P_WXtM'); // example of long titleName
// let videoId = ref('XAwXaGQwoZ0');  // example of short titleName
const player = ref<any>(null);
const nowTime = ref(0);
const endTime = ref(0);
let title = ref();
let titleName = ref();
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


const isFullscreen = ref(false);

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};



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
  if (event.data === 1) { // start
    isPlaying.value = true; // play-pause-button
    intervalId.value = window.setInterval(() => { // Get current time per 250ms
      nowTime.value = Math.floor(event.target.getCurrentTime());
    }, 250);
  } else if (event.data === 0) { // end(0)
    queue.get_next();
  } else if (event.data === 2) { // stop (2)
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

const renderKey = queue.get_playerRenderKey();
</script>

<template>
  <div :class="{ 'container': !isFullscreen, 'fscontainer': isFullscreen }" :key="renderKey">
    <youtube-iframe
      :video-id=queue.get_nowSong()
      :player-vars="{
        autoplay: 1,
        iv_load_policy: 3,
        loop: 1,
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
    <button @click="queue.onLoopButton()">
      LoopButton
    </button>
    Queue
    <div v-for="(SongName, index) in queue.get_queueTitleList()">
      {{ index }} : {{ SongName }}
    </div>   
  </div>
  <button @click="toggleFullscreen" class="toggle-btn">
        {{ isFullscreen ? '通常表示' : 'フルスクリーン' }}
      </button>
</template>

<style scoped>
.toggle-btn {
  position: fixed;
  bottom: 90px;
  background: #4c4c4c;
  color: #ffffff;
  border: none;
  padding: 5px;
  cursor: pointer;
}
</style>
