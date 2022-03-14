<template>
  <m-header></m-header>
  <tab />
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
  <router-view :style="viewStyle" name="user" v-slot="{ Component }">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </transition>
  </router-view>
  <player></player>
</template>
<script>
import MHeader from "@/components/header/header.vue";
import Tab from "@/components/tab/tab.vue";
import Player from "@/components/player/player";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    MHeader,
    Tab,
    Player,
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? "60px" : 0;
      return {
        bottom,
      };
    },
    ...mapState(["playList"]),
  },
};
</script>

<style lang="scss"></style>
