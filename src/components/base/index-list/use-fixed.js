import { ref, watch, computed, nextTick } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeights = ref([])
  const currentIndex = ref(0)
  const scrollY = ref(0)
  const distance = ref(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  watch(() => props.data, async () => {
    await nextTick()
    calcuate()
  })

  watch(scrollY, (newY) => {
    for (let i = 0; i < listHeights.value.length - 1; i++) {
      const heightTop = listHeights.value[i]
      const heightBottom = listHeights.value[i + 1]
      if (newY >= heightTop && newY < heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
        break
      }
    }
  })


  function calcuate() {
    const groupChildren = groupRef.value.children
    let height = 0

    listHeights.value.length = 0
    listHeights.value.push(height)

    for (let i = 0; i < groupChildren.length; i++) {
      height += groupChildren[i].clientHeight
      listHeights.value.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }
  return {
    groupRef,
    fixedTitle,
    onScroll,
    fixedStyle,
    currentIndex
  }
}