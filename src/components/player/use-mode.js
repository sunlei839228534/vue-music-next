import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

//icon-sequence 顺序播放
//icon-random 随机播放
//icon-loop 循环播放

function useMode() {
  const store = useStore()
  const mode = computed(() => store.state.playMode)
  const modeIcon = computed(() => {
    return mode.value === PLAY_MODE.sequence ? 'icon-sequence' : mode.value === PLAY_MODE.loop ? 'icon-loop' : 'icon-random'
  })


  function changeMode() {
    const nextMode = (mode.value + 1) % 3
    store.dispatch('changeMode', nextMode)
  }

  return { modeIcon, changeMode }
}

export default useMode