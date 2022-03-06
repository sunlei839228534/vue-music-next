<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          @touchstart.prevent="touchstart"
          @touchmove.prevent="touchmove"
          @touchend.prevent="touchend"
          :style="btnStyle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16;

export default {
  name: "progress-bar",
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  emits: ["progress-changing", "progress-changed"],
  data() {
    return {
      offset: 0,
    };
  },
  methods: {
    touchstart(e) {
      this.touch.x1 = e.touches[0].pageX;
      this.touch.beginWidth = this.$refs.progress.clientWidth;
    },
    touchmove(e) {
      const delta = e.touches[0].pageX - this.touch.x1;
      const tempWidth = this.touch.beginWidth + delta;
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0));
      this.offset = barWidth * progress;
      this.$emit("progress-changing", progress);
    },
    touchend(e) {
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const progress = this.$refs.progress.clientWidth / barWidth;
      this.$emit("progress-changed", progress);
    },
    onClick(e) {
      const rect = this.$el.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const progress = offsetWidth / barWidth;
      this.$emit("progress-changed", progress);
    },
  },
  created() {
    this.touch = {};
  },
  watch: {
    progress(newProgress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      this.offset = barWidth * newProgress;
    },
  },

  computed: {
    progressStyle() {
      return `width: ${this.offset}px`;
    },
    btnStyle() {
      return `transform: translate3d(${this.offset}px,0,0)`;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
