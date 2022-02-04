import BScroll from "@better-scroll/core";
import ObserveDOM from '@better-scroll/observe-dom'

BScroll.use(ObserveDOM)
import { onMounted, onUnmounted, ref } from 'vue'

export default function useScroll(wrapperRef, options) {
  const scroll = ref(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })
}