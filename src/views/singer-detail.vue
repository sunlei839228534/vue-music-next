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
import createDetailComponent from "@/assets/js/create-details-component";
import { getSingerDetailList } from "@/service/singer";
import { SINGER_KEY } from "@/assets/js/constant";

export default createDetailComponent(
  "singer-detail",
  SINGER_KEY,
  getSingerDetailList
);
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
