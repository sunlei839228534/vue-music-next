<template>
  <div class="singer" v-loading="!singers.length">
    <index-list @select="onSelectSinger" :data="singers"></index-list>
    <router-view :singer="selectedSinger"></router-view>
  </div>
</template>

<script>
import { getSingerList } from "@/service/singer.js";
import IndexList from "@/components/base/index-list/index-list";
import { SINGER_KEY } from "@/assets/js/constant";
import goodStorage from "good-storage";

export default {
  name: "singer",
  components: {
    IndexList,
  },
  data() {
    return {
      singers: [],
      selectedSinger: null,
    };
  },
  methods: {
    onSelectSinger(item) {
      this.selectedSinger = item;
      this.cacheSinger(item);
      this.$router.push(`/singer/${item.mid}`);
    },
    cacheSinger(singer) {
      goodStorage.session.set(SINGER_KEY, singer);
    },
  },
  async created() {
    const result = await getSingerList();
    this.singers = result.singers;
  },
};
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;

  width: 100%;
}
</style>
