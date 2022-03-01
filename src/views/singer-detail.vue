<template>
  <div class="singer-detail">
    <music-list
      :loading="loading"
      :title="title"
      :pic="pic"
      :songs="songs"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetailList } from "@/service/singer";
import { getSongs } from "@/service/song";
import MusicList from "@/components/music-list/music-list.vue";
import { SINGER_KEY } from "@/assets/js/constant";
import goodStorage from "good-storage";

export default {
  name: "singer-detail",
  components: {
    MusicList,
  },
  props: {
    singer: {
      type: Object,
    },
  },
  data() {
    return {
      songs: [],
      loading: true,
    };
  },
  async created() {
    const computedSinger = this.computedSinger;
    if (!computedSinger) {
      const path = this.$route.matched[0].path;
      this.$router.push({
        path,
      });
      return;
    }
    const result = await getSingerDetailList(computedSinger.mid);
    this.songs = await getSongs(result.songs);
    this.loading = false;
  },
  computed: {
    computedSinger() {
      let ret = this.singer;
      if (ret) {
        return ret;
      } else {
        ret = goodStorage.session.get(SINGER_KEY);
      }
      return ret;
    },
    pic() {
      const computedSinger = this.computedSinger;
      return computedSinger && computedSinger.pic;
    },
    title() {
      const computedSinger = this.computedSinger;
      return computedSinger && computedSinger.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-background;
}
</style>
