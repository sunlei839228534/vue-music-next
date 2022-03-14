<template>
  <div class="player" v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" alt="" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img
                  ref="cdImageRef"
                  :src="currentSong.pic"
                  alt=""
                  class="image"
                  :class="cdStyle"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
                :progress="progress"
              ></progress-bar>
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <mini-player :togglePlay="togglePlay" :progress="progress"></mini-player>
    <audio
      ref="audioRef"
      @error="error"
      @canplay="onReady"
      @pause="pause"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, nextTick, ref, watch } from "vue";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useCd from "./use-cd";
import useLyric from "./use-lyric";
import useMiddleInteractive from "./use-middle-interactive";
import useAnimation from "./use-animation";
import Scroll from "@/components/base/scroll/scroll";
import MiniPlayer from "@/components/player/mini-player";
import ProgressBar from "./progress-bar.vue";
import { formatTime } from "@/assets/js/util";
import { PLAY_MODE } from "@/assets/js/constant";
import usePlayHistory from "./use-play-history";

export default {
  name: "player",
  components: {
    ProgressBar,
    Scroll,
    MiniPlayer,
  },
  setup() {
    //data
    const audioRef = ref(null);
    const songReady = ref(false);
    const currentTime = ref(0);
    const progressChanging = ref(false);
    const barRef = ref(null);

    //vuex
    const store = useStore();

    //hooks
    const { modeIcon, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();
    const { cdStyle, cdRef, cdImageRef } = useCd();
    const {
      currentLyric,
      currentLineNum,
      playLyric,
      stopLyric,
      lyricListRef,
      lyricScrollRef,
      pureMusicLyric,
      playingLyric,
    } = useLyric(songReady, currentTime);
    const {
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      middleLStyle,
      middleRStyle,
      currentShow,
    } = useMiddleInteractive();
    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } =
      useAnimation();
    const { savePlay } = usePlayHistory();

    //computed
    const playlist = computed(() => store.state.playList);
    const currentSong = computed(() => store.getters.currentSong);
    const currentIndex = computed(() => store.state.currentIndex);
    const fullScreen = computed(() => store.state.fullScreen);
    const playing = computed(() => store.state.playing);
    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });
    const disableCls = computed(() => {
      return songReady.value ? "" : "disable";
    });
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration;
    });
    const mode = computed(() => store.state.playMode);

    //watch
    watch(currentSong, (newSong) => {
      if (!newSong.url || !newSong.id) {
        return;
      }
      currentTime.value = 0;
      songReady.value = false;
      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
      store.commit("setPlayingState", true);
    });
    watch(playing, (newPlaying) => {
      if (!songReady.value) return;
      if (newPlaying) {
        audioRef.value.play();
        playLyric();
      } else {
        audioRef.value.pause();
        stopLyric();
      }
    });
    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick();
        console.log(barRef.value);
        barRef.value.setOffset(progress.value);
      }
    });

    //function
    function goBack() {
      store.commit("setFullScreen", false);
    }
    function togglePlay() {
      if (!songReady.value) return;
      store.commit("setPlayingState", !playing.value);
    }
    function pause() {
      store.commit("setPlayingState", false);
    }
    function prev() {
      const list = playlist.value;
      if (!songReady.value || !list.length) {
        return;
      }

      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value - 1;
        if (index === -1) {
          index = list.length - 1;
        }
        store.commit("setCurrentIndex", index);
      }
    }

    function next() {
      const list = playlist.value;
      if (!songReady.value || !list.length) {
        return;
      }

      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value + 1;
        if (index === list.length) {
          index = 0;
        }
        store.commit("setCurrentIndex", index);
      }
    }

    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.commit("setPlayingState", true);
    }

    function onReady() {
      if (songReady.value) return;
      songReady.value = true;
      playLyric();
      savePlay(currentSong.value);
    }

    function error() {
      songReady.value = true;
    }

    function updateTime(e) {
      if (!progressChanging.value) {
        currentTime.value = e.target.currentTime;
      }
    }
    function onProgressChanging(progress) {
      progressChanging.value = true;
      currentTime.value = currentSong.value.duration * progress;
      playLyric();

      stopLyric();
    }

    function onProgressChanged(progress) {
      progressChanging.value = false;
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress;
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
      playLyric();
    }

    function end() {
      currentTime.value = 0;
      if (mode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }

    return {
      currentTime,
      currentSong,
      playlist,
      barRef,
      fullScreen,
      audioRef,
      goBack,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      onReady,
      disableCls,
      error,
      modeIcon,
      changeMode,
      getFavoriteIcon,
      updateTime,
      toggleFavorite,
      formatTime,
      progress,
      onProgressChanged,
      onProgressChanging,
      end,
      cdStyle,
      cdRef,
      cdImageRef,
      //lyric
      currentLineNum,
      currentLyric,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      //touch
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      middleLStyle,
      middleRStyle,
      currentShow,
      //animation
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
    };
  },
};
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          overflow: hidden;
          margin: 30px auto 0 auto;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 2s;
      .top,
      .bottom {
        transition: all 2s cubic-bezier(0.45, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
