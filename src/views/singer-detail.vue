<template>
  <div class="singer-detail"></div>
</template>

<script>
import { getSingerDetailList } from "@/service/singer";
import { getSongs } from "@/service/song";

export default {
  name: "singer-detail",
  props: {
    singer: {
      type: Object,
    },
  },
  async created() {
    const result = await getSingerDetailList(this.singer.mid);
    const songs = await getSongs(result.songs);
    console.log(songs);
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
