<script setup lang="ts">
import { YoutubeIframe } from '@vue-youtube/component';
import { ref, computed, onUnmounted, nextTick } from 'vue';
import queue from '../queue';

// let videoId = ref('zxt-_P_WXtM'); // example of long titleName
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
      <div class="title" @click="toggleFullscreen">
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
        <div v-for="(, index) in queue.get_queueTitleList()">
          #{{ index }}　
        </div>
        <div class="nowtime">{{ formattedNowTime }}</div>
        <div class="endtime">{{ formattedEndTime }}</div>
      </div>
      <div class="queue" v-for="(SongName, index) in queue.get_queueTitleList()">
          #{{ index }} : {{ SongName }}
      </div> 
      <div class="fs_time_container">
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
  <button @click="queue.onLoopButton()" class="toggle-btn-loop">
    Loop
  </button>
</template>

<style scoped>
/* overall frame */
.container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 10vw;
  max-height: 60px;
  background: #000000;
  border-top: #404040 solid 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: clamp(1px, 2vw, 10px);
  padding-bottom: clamp(1px, 2vw, 10px);
  flex-direction: row;
  animation: slideDown 0.25s ease forwards;
}

.fscontainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: #000000;
  animation: slideUp 0.25s ease forwards;
}

@keyframes slideDown {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
  }
  40%,100% {
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
  }
  40%,100% {
    opacity: 1;
  }
}

/* title, album, time */
.container .info_box {
  margin-left: 10px;
  padding: 0px 10px 0px 0px;
  width: 70vw;
  max-width: 300px;
  color: white;
}

.fscontainer .info_box {
  position: relative;
  top: 55px;
  margin: 5px;
  width: 100%;
  max-width: 500px;
}

.title {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  width: 100%;
}

.container .scroll-container {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: clamp(2px, calc(4vw - 1.3px), 20px);
}

.fscontainer .scroll-container {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: clamp(3px, calc(6vw - 2px), 30px);
}

.scrolling .scroll-text {
  display: inline-block;
  animation: scrollText var(--animation-duration) linear infinite;
}

@keyframes scrollText {
  0% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(0);
  }

  97% {
    opacity: 1;
  }

  98% {
    opacity: 0;
    transform: translateX(calc(-50%));
  }

  99% {
    opacity: 0;
    transform: translateX(0);
  }

  100% {
    opacity: 1;
  }
}

.single-text {
  display: inline-block;
  opacity: 1;
}

.container .album {
  font-size: 0;
}

.fscontainer .album {
  font-size: clamp(2px, calc(4vw - 1.3px), 20px);
}

.container .queue {
  font-size: 0;
}

.fscontainer .queue {
  font-size: clamp(1.5px, calc(3vw - 1px), 15px);
}

.container .time_container {
  font-family: "Lekton", monospace;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: clamp(1.5px, calc(3vw - 1px), 15px);
}

.container .fs_time_container {
  font-size: 0;
}

.fscontainer .time_container {
  font-size: 0;
}

.fscontainer .fs_time_container {
  font-family: "Lekton", monospace;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 0.5em;
  margin-bottom: 2em;
  font-size: clamp(1.75px, calc(3.5vw - 1.15px), 17.5px);
}

.container .endtime {
  margin-left: 5px;
  text-align: right;
}

.container .endtime::before {
  content: "-";
  padding-right: 5px;
}

.fscontainer .endtime {
  margin-left: auto;
  text-align: right;
}

/* control button */
.play-pause-button {
  font-size: clamp(2px, 4vw, 20px);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fscontainer .play-pause-button {
  position: relative;
  top: 55px;
}

.play-pause-icon {
  position: relative;
  width: 8vw;
  max-width: 2em;
  height: 9vw;
  max-height: 2.2em;
}

.bar {
  position: absolute;
  background: white;
  width: 0.9em;
  height: 2.2em;
  transition: all 0.3s ease-in-out;
}

.bar-left {
  left: 0.12em;
  clip-path: polygon(0% 0%, 100% 26%, 100% 74%, 0% 100%);
}

.bar-right {
  right: 0.12em;
  clip-path: polygon(0% 25%, 100% 50%, 0% 75%);
}

.playing .bar-left,
.playing .bar-right {
  clip-path: inset(0 0 0 0);
  width: 0.5em;
}


.toggle-btn-loop {
  position: fixed;
  bottom: 90px;
  left: 60px;
  background: #4c4c4c;
  color: #ffffff;
  border: none;
  padding: 5px;
  cursor: pointer;
}
</style>
