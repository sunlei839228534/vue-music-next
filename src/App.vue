<template>
  <m-header></m-header>
  <tab />
  <router-view></router-view>
</template>
<script>
import MHeader from "@/components/header/header.vue";
import Tab from "@/components/tab/tab.vue";

export default {
  name: "App",
  components: {
    MHeader,
    Tab,
  },
};
</script>

<style lang="scss">
</style>
