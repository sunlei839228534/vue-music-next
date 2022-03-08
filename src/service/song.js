import { get } from './base'

export function getSongs(songs) {
  return get('/api/getSongsUrl', { mid: songs.map(i => i.mid) }).then(res => {
    const { map } = res
    return songs.map(i => {
      i.url = map[i.mid]
      return i
    }).filter(i => i.url.indexOf('vkey') > -1)
  })
}

const lyricMap = {}
export function getLyric(song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid;

  if (lyricMap[mid]) {
    return Promise.resolve(lyricMap[mid])
  }

  return get('/api/getLyric', {
    mid
  }).then(result => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}