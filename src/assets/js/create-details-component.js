import MusicList from "@/components/music-list/music-list.vue";
import goodStorage from "good-storage";
import { getSongs } from "@/service/song";

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList,
    },
    props: {
      data: {
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
      const computedData = this.computedData;
      if (!computedData) {
        const path = this.$route.matched[0].path;
        this.$router.push({
          path,
        });
        return;
      }
      const result = await fetch(computedData);
      this.songs = await getSongs(result.songs);
      this.loading = false;
    },
    computed: {
      computedData() {
        let ret = this.data;
        if (ret) {
          return ret;
        } else {
          const cached = goodStorage.session.get(key)

          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = goodStorage.session.get(key);
          }
        }
        return ret;
      },
      pic() {
        const computedData = this.computedData;
        return computedData && computedData.pic;
      },
      title() {
        const computedData = this.computedData;
        return computedData && (computedData.name || computedData.title);
      },
    },
  }
}