import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export function selectPlay({ commit, state }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}

export function changeMode({ commit, state, getters }, mode) {
  const currentSongId = getters.currentSong.id
  if (PLAY_MODE.random === mode) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  const index = state.playList.findIndex(song => song.id === currentSongId)

  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()
  const sequenceIndex = sequenceList.findIndex((item) => item.id === song.id)
  const playIndex = playList.findIndex((item) => item.id === song.id)
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }

  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('setPlayingState', false)

  }
}

export function clearSongList({ commit, state }) {
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}