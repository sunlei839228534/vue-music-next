<template>
  <m-header></m-header>
  <tab />
  <router-view></router-view>
  <player></player>
</template>
<script>
import MHeader from "@/components/header/header.vue";
import Tab from "@/components/tab/tab.vue";
import Player from "@/components/player/player";

export default {
  name: "App",
  components: {
    MHeader,
    Tab,
    Player,
  },
};
</script>

<style lang="scss"></style>
