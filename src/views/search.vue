<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              @click="addQuery(item.key)"
              v-for="item in hotKeys"
              :key="item.id"
              class="item"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            ref="confirmRef"
            @confirm="clearSearch"
          ></confirm>
          <search-list
            @select="addQuery"
            @delete="deleteSearch"
            :searches="searchHistory"
          >
          </search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        @select-singer="selectSinger"
        @select-song="selectSong"
        :query="query"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from "@/components/search/search-input";
import Suggest from "@/components/search/suggest";
import SearchList from "@/components/base/search-list/search-list";
import Scroll from "@/components/wrap-scroll";
import Confirm from "@/components/base/confirm/confirm";
import goodStorage from "good-storage";

import { computed, nextTick, ref, watch } from "vue";
import { getHotKeys } from "@/service/search";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { SINGER_KEY } from "@/assets/js/constant";
import useSearchHistory from "@/components/search/use-search-history";

export default {
  name: "search",
  components: {
    SearchInput,
    Suggest,
    SearchList,
    Scroll,
    Confirm,
  },
  data() {
    return {
      query: "",
    };
  },
  setup() {
    const query = ref("");
    const hotKeys = ref([]);
    const store = useStore();
    const selectedSinger = ref(null);
    const scrollRef = ref(null);
    const confirmRef = ref(null);

    const router = useRouter();

    const searchHistory = computed(() => store.state.searchHistory);

    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory();

    //在 Composition API 中，setup 函数相当于 created 生命周期

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys;
    });

    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick();
        refreshScroll();
      }
    });

    function refreshScroll() {
      scrollRef.value.scroll.refresh();
    }

    function addQuery(s) {
      query.value = s;
    }
    function selectSong(song) {
      saveSearch(query.value);
      store.dispatch("addSong", song);
    }
    function selectSinger(singer) {
      saveSearch(query.value);
      selectedSinger.value = singer;
      cacheSinger(singer);
      router.push({
        path: `/search/${singer.mid}`,
      });
    }

    function cacheSinger(singer) {
      goodStorage.session.set(SINGER_KEY, singer);
    }

    function showConfirm() {
      console.log(confirmRef.value);
      confirmRef.value.show();
    }

    return {
      scrollRef,
      query,
      hotKeys,
      addQuery,
      selectSong,
      selectSinger,
      selectedSinger,
      searchHistory,
      deleteSearch,
      //confirm
      confirmRef,
      showConfirm,
      clearSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>

