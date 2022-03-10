import { computed, ref } from "vue"

export default function useShortcut(props, groupRef) {
  const CLINET_HEIGHT = 18
  const scrollRef = ref(null)
  const shortcutList = computed(() => {
    return props.data.map(i => i.title)
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    touch.y1 = e.targetTouches[0].pageY
    const touchIndex = parseInt(e.target.dataset.index)
    touch.touchIndex = touchIndex
    scrollTo(touchIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.targetTouches[0].pageY
    const delta = (touch.y2 - touch.y1) / CLINET_HEIGHT | 0
    const touchIndex = touch.touchIndex + delta
    scrollTo(touchIndex)
  }

  function scrollTo(index) {
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const touchElement = groupRef.value.children[index]
    scrollRef.value.scroll.scrollToElement(touchElement, 0)
  }
  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef
  }
}