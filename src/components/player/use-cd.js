import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const store = useStore()
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const playing = computed(() => store.state.playing)
  const cdStyle = computed(() => playing.value ? 'playing' : '')

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat('', wrapperTransform)
  }

  return {
    cdStyle,
    cdRef,
    cdImageRef
  }
}