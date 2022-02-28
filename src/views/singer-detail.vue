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
    const result = await getSingerDetailList(this.singer.mid);
    this.songs = await getSongs(result.songs);
    this.loading = false;
  },
  computed: {
    pic() {
      return this.singer && this.singer.pic;
    },
    title() {
      return this.singer && this.singer.name;
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
